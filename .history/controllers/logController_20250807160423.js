const {
  DownloadLog,
  DownloadHistory,
  User,
  File,
} = require ('../database/models');

exports.getDownloadLogs = async (req, res) => {
  try {
    const logs = await DownloadLog.findAll ({
      include: [
        {
          model: DownloadHistory,
          as: 'downloadHistory',
          include: [
            {
              model: User,
              as: 'user',
            },
            {
              model: File,
              as: 'file',
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error ('Грешка при получаване на логове за изтегляне:', error);
    res.status (500).json ({message: 'Вътрешна грешка на сървъра'});
  }
};
