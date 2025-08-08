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

    const combined = histories.map (h => {
      const matchingLog = logs.find (
        l =>
          l.userId === h.userId &&
          Math.abs (new Date (l.timestamp) - new Date (h.downloadedAt)) < 5000
      );

      return {
        type: 'history',
        id: h.id,
        userId: h.userId,
        userEmail: h.User.email,
        company: h.User.company,
        downloadedAt: h.downloadedAt,
        ipAddress: matchingLog ? matchingLog.ipAddress : null,
        userAgent: matchingLog ? matchingLog.userAgent : null,
      };
    });

    // You may want to send the combined result in the response
    return res.json ({combined});
  } catch (error) {
    console.error ('Error fetching file download details:', error);
    return res.status (500).json ({message: 'Internal server error'});
  }
};
