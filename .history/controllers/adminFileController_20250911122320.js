const {File, User, Company, Department} = require ('../database/models');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res
        .status (403)
        .json ({message: 'Само администратори имат право да качват файлове.'});
    }

    const {companyId, departmentId} = req.body;

    if (!companyId) {
      return res.status (400).json ({message: 'Моля изберете фирма.'});
    }

    if (!req.file) {
      return res
        .status (400)
        .json ({message: 'Моля изберете файл за качване.'});
    }

    const file = await File.create ({
      filename: req.file.filename,
      originalname: req.file.originalname,
      userId: req.user.id,
      description: req.body.description || '',
      companyId,
      departmentId: departmentId || null,
      downloadedBy: null,
    });

    const fileUrl = `${req.protocol}://${req.get ('host')}/uploads/${req.file.filename}`;
    res.status (201).json ({});
  } catch (error) {
    console.error ('Грешка при качване:', error);
    res.status (500).json ({message: 'Грешка при качване на файла.'});
  }
};
