const {File, User, Company, Department} = require ('../database/models');
const path = require ('path');
const fs = require ('fs');

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

    const extension = path.extname (req.file.filename);

    const file = await File.create ({
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: path.join (__dirname, '..', 'uploads', req.file.filename),
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
    const files = await File.findAll ({
      include: [
        {model: Company, as: 'Company', attributes: ['id', 'companyName']},
        {
          model: Department,
          as: 'Department',
          attributes: ['id', 'departmentName'],
        },
        {model: User, as: 'owner', attributes: ['id', 'email']},
        {model: User, as: 'lastDownloader', attributes: ['id', 'email']},
      ],
    });

    const formattedFiles = files.map (file => ({
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

    res.status (200).json (formattedFiles);
  } catch (error) {
    console.error ('Грешка при извличане на файловете:', error);
    res.status (500).json ({message: 'Грешка при извличане на файловете.'});
  }
};
