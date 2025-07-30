const {File} = require ('../database/models');

const uploadFile = async (req, res) => {
  try {
    const file = await File.create ({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      userId: req.user.id, // Assuming user ID is stored in req.user
    });
  } catch (error) {
    console.error ('Error uploading file:', error);
    res.status (500).json ({message: 'Грешка при качване на файла'});
  }
};
