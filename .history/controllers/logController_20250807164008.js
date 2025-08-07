const {
  DownloadLog,
  DownloadHistory,
  User,
  File,
} = require ('../database/models');

exports.getFullDownloadLogs = async (req, res) => {
  try {
    const logs = await DownloadLog.findAll ({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'company'],
        },
        {
          model: File,
          as: 'file',
          attributes: ['id', 'original', 'serverFilename'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status (200).json (logs);
  } catch (error) {
    console.error ('Error fetching download logs:', error);
    res.status (500).json ({message: 'Internal server error'});
  }
};
