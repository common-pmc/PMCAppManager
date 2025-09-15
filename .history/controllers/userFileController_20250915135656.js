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
const {where} = require ('sequelize');

const SECRET = process.env.JWT_SECRET || 'my_secret_key';

exports.downloadFile = async (req, res) => {
  try {
    const {token} = req.params;
    const decoded = jwt.verify (token, SECRET);
    const downloadingUser = await User.findByPk (decoded.userId);
    if (!downloadingUser || !downloadingUser.active) {
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

    await DownloadHistory.create ({
      userId: decoded.userId,
      fileId: file.id,
      downloadedAt: new Date (),
    });

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

    await file.update ({downloadedBy: decoded.userId});

    res.download (filePath, file.originalName);
  } catch (error) {
    console.error ('Грешка при изтегляне на файла: ', error);
    res
      .status (500)
      .json ({message: 'Неуспешно изтегляне на файл. Моля опитайте по-късно.'});
  }
};

// потребител да вижда само файловете от неговата фирма
exports.getFilesByCompany = async (req, res) => {
  try {
    const user = req.user;

    const files = await File.findAll ({
      where: {companyId: user.companyId},
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
    });

    const formattedFiles = files.map (file => ({
      id: file.id,
      filename: file.filename,
      originalname: file.originalname || file.filename,
      url: `${req.protocol}://${req.get ('host')}/uploads/${file.filename}`,
      description: file.description,
      company: file.owner?.Company
    }));
  } catch (error) {
    //
  }
};
