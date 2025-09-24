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
    if (isNaN (userId)) {
      return res.status (400).json ({error: 'Invalid user ID'});
    }
  } catch (error) {
    //
  }
};
