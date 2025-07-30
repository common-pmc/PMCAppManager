const {File} = require ('../database/models');

const uploadFile = async (req, res) => {
  try {
    const file = await File.create ({
      filename: req.file.filename,
      originalname: req.file.originalname,
      company: req.user.company,
      downloadedBy: '', // Initially empty, can be updated later
    });
  } catch (error) {
    console.error ('Error uploading file:', error);
    res.status (500).json ({message: 'Грешка при качване на файла'});
  }
};
