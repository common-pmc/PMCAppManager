const {
  File,
  User,
  Company,
  Department,
  DownloadHistory,
  DownloadLog,
} = require ('../database/models');
const jwt = require ('jsonwebtoken');
const path = require ('path');
const fs = require ('fs');
const archiver = require ('archiver');
const {Op} = require ('sequelize');
const mime = require ('mime-types');

const SECRET = process.env.JWT_SECRET || 'my_secret_key';

// Сваляне на файл
exports.downloadFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const user = req.user;

    if (!user.isActive) {
      return res.status (403).json ({
        message: 'Вашия акаунт е деактивиран. Нямате право да сваляте файлове.',
      });
    }

    const file = await File.findByPk (fileId);
    if (!file) {
      return res.status (404).json ({message: 'Файлът не е намерен.'});
    }

    // проверка дали файлът принадлежи на същата фирма като потребителя
    if (
      file.companyId !== user.companyId ||
      file.departmentId !== user.departmentId
    ) {
      return res.status (403).json ({message: 'Нямате достъп до този файл.'});
    }

    const filePath = path.join (__dirname, '..', 'uploads', file.filename);

    if (!fs.existsSync (filePath)) {
      return res
        .status (404)
        .json ({message: 'Файлът не е намерен на сървъра.'});
    }

    // Определя MIME типа
    const mimeType = mime.lookup (filePath) || 'application/octet-stream';
    res.setHeader ('Content-Type', mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);

    // записваме в DownloadHistory и DownloadLog
    await DownloadHistory.create ({
      userId: user.id,
      fileId: file.id,
      downloadedAt: new Date (),
    });

    await DownloadLog.create ({
      userId: user.id,
      fileId: file.id,
      ipAddress: req.ip ||
        req.headers['x-forwarded-for'] ||
        req.connection?.remoteAddress,
      userAgent: req.headers['user-agent'] || 'Unknown',
      timestamp: new Date (),
    });

    res.download (filePath, file.filename);
  } catch (error) {
    console.error ('Грешка при сваляне на файл: ', error);
    res
      .status (500)
      .json ({message: 'Неуспешно сваляне на файла. Моля опитайте по-късно.'});
  }
};

// Сваляне на всички няколко файла едновременно в zip архив
exports.downloadZip = async(req, res) => {
  try {
    const user = req.user;
    const ids = Array.isArray(req.body.ids) ? req.body.ids.map(id => parseInt(id)) : [];

    if(!user.isActive) {
      return res.status(403).json({
        message: 'Вашия акаунт е деактивиран. Нямате право да сваляте файлове.'
      });
    }

    if(!ids || ids.length === 0) {
      return res.status(400).json({message: 'Не са избрани файлове за сваляне.'});
    }

    // Взимаме само тези файлове, които потребителят има право да сваля (от същата фирма и отдел).
    const files = await File.findAll({
      where: {
        id: ids,
        companyId: user.companyId,
        departmentId: user.departmentId
      }
    });

    if (files.length === 0) {
      return res.status(404).json({message: 'Не са намерени файлове за сваляне.'});
    }
    
    // ZIP Headers
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=files.zip');

    // Създаваме архив
    const archive = archiver('zip', {
      zlib: { level: 9 } // Ниво на компресия
    });

    archive.on('error', err => {
      console.error('Грешка при създаване на архива: ', err);
      res.status(500).send({ message: 'Грешка при създаване на архива.' });
    });

    // Пайпваме архива към response-а
    archive.pipe(res);

    // Добавяме файловете в архива и записваме логове/история за всеки:
    for (const file of files) {
      const filePath = path.join(__dirname, '..', 'uploads', file.filename);
      if (!fs.existsSync(filePath)) {
        // Пропускаме ако няма файл на сървъра
        continue;
    }
    // Добавяме файла в архива с оригиналното му име
    archive.file(filePath, { name: file.filename });

    // Записваме в DownloadHistory и DownloadLog
    await DownloadHistory.create({
      userId: user.id,
      fileId: file.id,
      downloadedAt: new Date()
    });

    await DownloadLog.create({
      userId: user.id,
      fileId: file.id,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent'] || 'Unknown',
      timestamp: new Date()
    });

    // Маркираме кой е последния свалил файла
    await file.update({ lastDownloadedBy: user.id });
    }

    // Завършваме архива
    // когато archive завърши - response ще се затвори автоматично
    await archive.finalize();
  
  } catch (error) {
    console.error('Грешка при сваляне на zip архив: ', error);
    // Ако не е изпратен отговор, пращаме грешка
    res.status(500).send({ message: 'Грешка при сваляне на zip архив.' }); 
  }
}

// потребител да вижда само файловете от неговата фирма
exports.getFilesByCompany = async (req, res) => {
  try {
    const user = req.user;

    const files = await File.findAll ({
      where: {
        companyId: user.companyId,
        [Op.or]: [
          {departmentId: null},
          {departmentId: user.departmentId},
        ],
      },
      include: [
        {model: Company, as: 'Company', attributes: ['id', 'companyName']},
        {
          model: Department,
          as: 'Department',
          attributes: ['id', 'departmentName'],
        },
        {model: User, as: 'lastDownloader', attributes: ['id', 'email']},
      ],    
      order: [['createdAt', 'DESC']],
    });

    const formattedFiles = await Promise.all (
      files.map (async file => {
        const lastDownload = await DownloadHistory.findOne ({
          where: {fileId: file.id},
          include: [{model: User, as: 'User', attributes: ['id', 'email']}],
          order: [['downloadedAt', 'DESC']],
        });

        return {
          id: file.id,
          filename: file.filename,
          originalname: file.originalname || file.filename,
          url: `${req.protocol}://${req.get ('host')}/files/download/${file.id}`,
          description: file.description,
          company: file.Company
            ? {id: file.Company.id, name: file.Company.companyName}
            : null,
          department: file.Department
            ? {id: file.Department.id, name: file.Department.departmentName}
            : null,
          lastDownloadedBy: lastDownload ? lastDownload.User.email : null,
          lastDownloadedAt: lastDownload ? lastDownload.downloadedAt : null,
        };
      })
    );

    res.json (formattedFiles);
  } catch (error) {
    console.error ('Грешка при зареждане на файловете: ', error);
    res.status (500).json ({
      message: 'Неуспешно зареждане на файловете. Моля опитайте по-късно.',
    });
  }
};
