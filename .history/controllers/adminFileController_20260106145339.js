const {File, User, Company, Department, DownloadHistory, DownloadLog} = require ('../database/models');
const path = require ('path');
const fs = require ('fs');
const {Op, fn, col, where} = require ('sequelize');
const mime = require ('mime-types');
const paginate = require ('../utils/paginate');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res
        .status (403)
        .json ({message: 'Само администратори имат право да качват файлове.'});
    }

    const {companyId, departmentId, description} = req.body;

    if (!companyId) {
      return res.status (400).json ({message: 'Моля изберете фирма.'});
    }

    if (!req.file) {
      return res
        .status (400)
        .json ({message: 'Моля изберете файл за качване.'});
    }

    const extension = path.extname (req.file.filename).replace ('.', '');

    const file = await File.create ({
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: path.join ('uploads', req.file.filename),
      extension,
      userId: req.user.id,
      description: req.body.description || null,
      companyId: Number (companyId),
      departmentId: departmentId ? Number (departmentId) : null,
    });

    const fileUrl = `${req.protocol}://${req.get ('host')}/uploads/${req.file.filename}`;
    res.status (201).json ({
      message: 'Файлът е качен успешно.',
      file: {
        id: file.id,
        filename: file.filename,
        originalname: file.originalname,
        url: fileUrl,
        path: file.path,
        extension: file.extension,
        description: file.description,
        companyId: file.companyId,
        departmentId: file.departmentId,
        uploadedBy: req.user.id,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
      },
    });
  } catch (error) {
    console.error ('Грешка при качване:', error);
    res.status (500).json ({message: 'Грешка при качване на файла.'});
  }
};

exports.getAllFiles = async (req, res) => {
  try {
    const page = parseInt (req.query.page) || 1;
    const limit = parseInt (req.query.limit) || 10;
    const search = req.query.search || '';
    console.log ('[getAllFiles] incoming query:', {page, limit, search});

    const {data, meta} = await paginate (File, {
      page,
      limit,
      searchField: 'filename',
      searchValue: search,
      include: [
        {
          model: Company,
          as: 'Company',
          attributes: ['id', 'companyName'],
        },
        {
          model: Department,
          as: 'Department',
          attributes: ['id', 'departmentName'],
        },
        {model: User, as: 'owner', attributes: ['id', 'email']},
        {model: User, as: 'lastDownloader', attributes: ['id', 'email']},
      ],
      order: [['createdAt', 'DESC']],
      maxLimit: 100,
    });

    const formattedFiles = data.map (file => ({
      id: file.id,
      filename: file.filename,
      originalname: file.originalname || file.filename,
      url: `${req.protocol}://${req.get ('host')}/uploads/${file.filename}`,
      description: file.description,
      company: file.Company
        ? {id: file.Company.id, companyName: file.Company.companyName}
        : null,
      department: file.Department
        ? {
            id: file.Department.id,
            departmentName: file.Department.departmentName,
          }
        : null,
      uploadedBy: file.owner
        ? {
            id: file.owner.id,
            email: file.owner.email,
          }
        : null,
      lastDownloadedBy: file.lastDownloader
        ? {
            id: file.lastDownloader.id,
            email: file.lastDownloader.email,
          }
        : null,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    }));

    res.status (200).json ({data: formattedFiles, meta});
  } catch (error) {
    console.error ('Грешка при извличане на файловете:', error);
    res.status (500).json ({message: 'Грешка при извличане на файловете.'});
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const user = req.user;

    if (!user.isAdmin) {
      return res
        .status (403)
        .json ({message: 'Само администратори имат право да свалят файлове.'});
    }

    const file = await File.findByPk (fileId);
    if (!file) {
      return res.status (404).json ({message: 'Файлът не е намерен.'});
    }

    const filePath = path.join (__dirname, '..', 'uploads', file.filename);

    if (!fs.existsSync (filePath)) {
      return res
        .status (404)
        .json ({message: 'Файлът не е намерен на сървъра.'});
    }

    // Определя MIME типа
    const mimeType = mime.lookup (filePath) || 'application/octet-stream';
    res.setHeader ('Content-Type', mimeType);
    res.setHeader (
      'Content-Disposition',
      `attachment; filename="${file.originalname}"`
    );

    // Записваме в DownloadHistory и DownloadLog
    await DownloadHistory.create ({
      userId: user.id,
      fileId: file.id,
      downloadedAt: new Date (),
    });

    await DownloadLog.create ({
      userId: user.id,
      fileId: file.id,
      ipAddress: req.ip ||
        req.headers['x-forwarded-for'] ||
        req.connection?.remoteAddress,
      userAgent: req.headers['user-agent'] || 'Unknown',
      timestamp: new Date (),
    });

    // Обновяваме downloadedBy поле с id на потребителя
    

    res.download (filePath, file.originalname, err => {
      if (err) {
        console.error ('Грешка при сваляне на файл:', err);
      }
    });
  } catch (error) {
    console.error ('Грешка при сваляне на файла:', error);
    res.status (500).json ({message: 'Неуспешно сваляне на файла.'});
  }
};
