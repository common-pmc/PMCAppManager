const {
  File,
  User,
  Company,
  Department,
  DownloadHistory,
  DownloadLog,
} = require ('../database/models');
const jwt = require ('jsonwebtoken');
const path = require ('path');
const fs = require ('fs');

const SECRET = process.env.JWT_SECRET || 'my_secret_key';

exports.downloadFile = async (req, res) => {
  try {
    const {token} = req.params;
    const decoded = jwt.verify (token, SECRET);
    const downloadingUser = await User.findByPk (decoded.userId);
    if (!downloadingUser || !downloadingUser.active) {
      return res.status (403).json ({
        message: 'Вашият акаунт е деактивиран. Нямате право да сваляте файлове.',
      });
    }

    const file = await File.findByPk (decoded.fileId);
    if (!file) {
      return res.status (404).json ({message: 'Файлът не е намерен.'});
    }

    const filePath = path.join (__dirname, '..', 'uploads', file.filename);

    if (!fs.existsSync (filePath)) {
      return res
        .status (404)
        .json ({message: 'Файлът не е намерен на сървъра.'});
    }
  } catch (error) {
    //
  }
};
