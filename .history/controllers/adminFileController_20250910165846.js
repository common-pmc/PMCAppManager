const {File, User, Company, Department} = require ('../database/models');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res
        .status (403)
        .json ({message: 'Само администратори имат право да качват файлове.'});
    }
  } catch (error) {
    console.error ('Грешка при качване:', error);
    res.status (500).json ({message: 'Грешка при качване на файла.'});
  }
};
