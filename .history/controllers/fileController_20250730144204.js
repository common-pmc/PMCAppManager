const {File} = require ('../database/models');
const jwt = require ('jsonwebtoken');

const uploadFile = async (req, res) => {
  try {
    const file = await File.create ({
      filename: req.file.filename,
      originalname: req.file.originalname,
      company: req.user.company,
      downloadedBy: '', // Initially empty, can be updated later
    });
    res.status (201).json ({
      message: 'Файлът е качен успешно',
      file: {
        id: file.id,
        filename: file.filename,
        originalname: file.originalname,
        company: file.company,
      },
    });
  } catch (error) {
    console.error ('Грешка при качване:', error);
    res.status (500).json ({message: 'Грешка при качване на файла.'});
  }
};
