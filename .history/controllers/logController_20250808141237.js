const {
  DownloadLog,
  DownloadHistory,
  User,
  File,
} = require ('../database/models');
const {Op} = require ('sequelize');

exports.getFileDownloadDetails = async (req, res) => {
  try {
    const {fileId} = req.params;
  } catch (error) {
    console.error ('Error fetching file download details:', error);
    return res.status (500).json ({message: 'Internal server error'});
  }
};
