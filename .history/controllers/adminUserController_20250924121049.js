const {
  File,
  User,
  DownloadHistory,
  Company,
  Department,
} = require ('../database/models');

exports.getUserDetails = async (req, res) => {
  try {
    const userId = parseInt (req.params.id);
  } catch (error) {
    //
  }
};
