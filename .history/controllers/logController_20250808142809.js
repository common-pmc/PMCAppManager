const {
  DownloadLog,
  DownloadHistory,
  User,
  File,
} = require ('../database/models');
const {Op, where} = require ('sequelize');

exports.getFileDownloadDetails = async (req, res) => {
  try {
    const {fileId} = req.params;

    const histories = await DownloadHistory.findAll ({
      where: {fileId},
      include: [{model: User, attributes: ['id', 'email', 'company']}],
      order: [['downloadedAt', 'DESC']],
    });

    const logs = await DownloadLog.findAll ({
      where: {fileId},
      include: [{model: User, attributes: ['id', 'email', 'company']}],
      order: [['timestamp', 'DESC']],
    });

    const combined = histories.map (history => {});
  } catch (error) {
    console.error ('Error fetching file download details:', error);
    return res.status (500).json ({message: 'Internal server error'});
  }
};
