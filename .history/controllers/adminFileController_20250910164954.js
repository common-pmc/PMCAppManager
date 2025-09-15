const {File, User, Company, Department} = require ('../database/models');

exports.uploadFile = async (req, res) => {
  try {
    //
  } catch (error) {
    console.error ('Грешка при качване:', error);
    res.status (500).json ({message: 'Грешка при качване на файла.'});
  }
};
