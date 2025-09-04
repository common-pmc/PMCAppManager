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

const SECRET = process.env.JWT_SECRET || 'my_secret_key';

exports.downloadFile = async (req, res) => {
  try {
    const {token} = req.params;
    const decoded = jwt.verify (token, SECRET);
    const downloadingUser = await User.findByPk (decoded.userId);
    if (!downloadingUser || !downloadingUser.isActive) {
      return res.status (403).json ({
        message: 'Вашият акаунт е деактивиран. Нямате право да сваляте файлове.',
      });
    }
    const file = await File.findByPk (decoded.fileId);
    if (!file) {
      return res.status (404).json ({message: 'Файлът не е намерен.'});
    }
    const filePath = path.join (__dirname, '..', 'uploads', file.filename);
    if (!fs.existsSync (filePath)) {
      return res
        .status (404)
        .json ({message: 'Файлът не е намерен на сървъра.'});
    }

    // Create a record in download history
    await DownloadHistory.create ({
      userId: decoded.userId,
      fileId: file.id,
      downloadedAt: new Date (),
    });

    // Create a record in download log
    await DownloadLog.create ({
      userId: decoded.userId,
      fileId: file.id,
      downloadedAt: new Date (),
      ipAddress: req.ip ||
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress,
      userAgent: req.headers['user-agent'] || 'Unknown',
      timestamp: new Date (),
    });

    // Update the downloadedBy field / create a record in DownloadLog
    await file.update ({
      downloadedBy: decoded.userId,
    });
    res.download (filePath, file.originalname);
  } catch (error) {
    console.error ('Грешка при изтегляне на файла:', error);
    res.status (500).json ({message: 'Грешка при изтегляне на файла.'});
  }
};

exports.uploadFile = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res
        .status (403)
        .json ({message: 'Само администратори имат право да качват файлове.'});
    }

    const {companyId, departmentId} = req.body;
    if (!companyId) {
      return res.status (400).json ({message: 'Моля, изберете фирма.'});
    }

    if (!req.file) {
      return res
        .status (400)
        .json ({message: 'Моля, изберете файл за качване.'});
    }

    // Създаваме файл, като userId е админа (който качва)
    const file = await File.create ({
      filename: req.file.filename,
      originalname: req.file.originalname,
      userId: req.user.id, // админът, който качва файла
      description: req.body.description || '',
      companyId: companyId,
      departmentId: departmentId || null,
      downloadedBy: null,
    });

    // Създава URL към качения файл
    const fileUrl = `${req.protocol}://${req.get ('host')}/uploads/${req.file.filename}`;

    res.status (201).json ({
      message: 'Файлът е качен успешно',
      file: {
        id: file.id,
        filename: file.filename,
        originalname: file.originalname,
        url: fileUrl, // линк към файла
        description: file.description,
        companyId: file.companyId,
        departmentId: file.departmentId,
        uploadedBy: req.user.id,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
      },
    });
  } catch (error) {
    console.error ('Грешка при качване:', error);
    res.status (500).json ({message: 'Грешка при качване на файла.'});
  }
};

exports.getFiles = async (req, res) => {
  try {
    const user = req.user;

    const queryOptions = {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'email', 'companyId', 'departmentId'],
          include: [
            {model: Company, as: 'Company', attributes: ['id', 'companyName']},
            {
              model: Department,
              as: 'Department',
              attributes: ['id', 'departmentName'],
            },
          ],
        },
        {
          model: User,
          as: 'lastDownloader',
          attributes: ['id', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    };

    // Ако потребителят не е админ, филтрираме файловете по фирма и отдел
    if (!user.isAdmin) {
      queryOptions.where = {
        userId: user.id,
      };
    }

    const files = await File.findAll (queryOptions);

    const formattedFiles = files.map (file => ({
      id: file.id,
      filename: file.filename,
      originalname: file.originalname || file.filename,
      url: `${req.protocol}://${req.get ('host')}/uploads/${file.filename}`,
      description: file.description,
      company: file.owner.Company
        ? {
            id: file.owner.Company.id,
            companyName: file.owner.Company.companyName,
          }
        : null,
      department: file.owner.Department
        ? {
            id: file.owner.Department.id,
            departmentName: file.owner.Department.departmentName,
          }
        : null,
      uploadedBy: {
        id: file.owner.id,
        email: file.owner.email,
      },
      lastDownloadedBy: file.lastDownloader
        ? {
            id: file.lastDownloader.id,
            email: file.lastDownloader.email,
          }
        : null,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    }));

    res.json (formattedFiles);
  } catch (error) {
    console.error ('грешка при извличане на файловете:', error);
    res.status (500).json ({message: 'Грешка при зареждане на файловете.'});
  }
};
