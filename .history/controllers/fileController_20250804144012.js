const {File} = require ('../database/models');
const jwt = require ('jsonwebtoken');
const path = require ('path');
const fs = require ('fs');

const SECRET = process.env.JWT_SECRET || 'my_secret_key';

exports.generateDownloadLink = (req, res) => {
  const {fileId} = req.params;
  const token = jwt.sign ({fileId, userId: req.user.id}, SECRET, {
    expiresIn: '1h', // Link valid for 1 hour
  });

  const link = `${req.protocol}://${req.get ('host')}/api/files/download/${token}`;
  res.json ({downloadLink: link});
};

exports.downloadFile = async (req, res) => {
  try {
    const {token} = req.params;
    const decoded = jwt.verify (token, SECRET);
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
    const file = await File.create ({
      filename: req.file.filename,
      originalname: req.file.originalname,
      company: req.user.company,
      downloadedBy: '',
    });

    // Създава URL към качения файл
    const fileUrl = `${req.protocol}://${req.get ('host')}/uploads/${req.file.filename}`;

    res.status (201).json ({
      message: 'Файлът е качен успешно',
      file: {
        id: file.id,
        filename: file.filename,
        originalname: file.originalname,
        company: file.company,
        url: fileUrl, // линк към файла
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
    const files = user.isAdmin
      ? await File.findAll ({order: [['createdAt', 'DESC']]})
      : await File.findAll ({where: {company: user.company}});
  } catch (error) {
    error.status = 500;
    error.message = 'Грешка при получаване на файловете.';
    console.error ('Грешка при получаване на файловете:', error);
    res.status (error.status || 500).json ({message: error.message});
  }
};
