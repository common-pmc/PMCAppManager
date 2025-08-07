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
          attributes: ['id', 'originalname', 'company'],
        },
      ],
      order: [['timestamp', 'DESC']],
    });

    const history = DownloadHistory.findAll ({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'company'],
        },
        {
          model: File,
          as: 'file',
          attributes: ['id', 'originalname', 'company'],
        },
      ],
      order: [['downLoadedAt', 'DESC']],
    });

    res.status (200).json ({logs, history});
  } catch (error) {
    console.error ('Грешка при извличане на обединени логове:', error);
    res.status (500).json ({message: 'Internal server error'});
  }
};
