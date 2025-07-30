const {File} = require ('../database/models');

const uploadFile = async (req, res) => {
  try {
  } catch (error) {
    console.error ('Error uploading file:', error);
    res.status (500).json ({message: 'Грешка при качване на файла'});
  }
};
