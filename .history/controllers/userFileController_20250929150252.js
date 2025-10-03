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
const {where} = require ('sequelize');

const SECRET = process.env.JWT_SECRET || 'my_secret_key';

// Сваляне на файл
exports.downloadFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const user = req.user;

    if(!user.isActive) {
      return res.status(403).json({
        message: "Вашия акаунт е деактивиран. Нямате право да сваляте файлове."
      })
    }

    const file = await File.findByPk(fileId);
    if(!file) {
      return res.status(404).json({message: 'Файлът не е намерен.'});
    }

    // проверка дали файлът принадлежи на същата фирма като потребителя
    if(file.companyId !== user.companyId) {
      return res.status(403).json({message: 'Нямате достъп до този файл.'});
    }

    const filePath = path.join(__dirname, '..', 'uploads', file.filename);
    
    if(!fs.existsSync(filePath)) {
      return res.status(404).json({message: 'Файлът не е намерен на сървъра.'});
    }

    // записваме в DownloadHistory и DownloadLog
  } catch (error) {
    // 
  }
}

// потребител да вижда само файловете от неговата фирма
exports.getFilesByCompany = async (req, res) => {
  try {
    const user = req.user;

    const files = await File.findAll ({
      where: {companyId: user.companyId},
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'email', 'companyId', 'departmentId'],
          include: [
            {model: Company, as: 'Company', attributes: ['id', 'companyName']},
            {
              model: Department,
              as: 'Department',
              attributes: ['id', 'departmentName'],
            },
          ],
        },
        {
          model: User,
          as: 'lastDownloader',
          attributes: ['id', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const formattedFiles = files.map (file => ({
      id: file.id,
      filename: file.filename,
      originalname: file.originalname || file.filename,
      url: `${req.protocol}://${req.get ('host')}/uploads/${file.filename}`,
      description: file.description,
      company: file.owner?.Company
        ? {id: file.owner.Company.id, name: file.owner.Company.companyName}
        : null,
      department: file.owner?.Department
        ? {id: file.owner.Department.id, name: file.owner.Department.departmentName}
        : null,
      uploadedBy: file.owner
        ? {id: file.owner.id, email: file.owner.email}
        : null,
      lastDownloadedBy: file.lastDownloader
        ? {id: file.lastDownloader.id, email: file.lastDownloader.email}
        : null,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    }));

    res.json (formattedFiles);
  } catch (error) {
    console.error('Грешка при зареждане на файловете: ', error);
    res.status(500).json({message: 'Неуспешно зареждане на файловете. Моля опитайте по-късно.'});
  }
};
