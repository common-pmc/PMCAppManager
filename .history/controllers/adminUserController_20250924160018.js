const {where} = require ('sequelize');
const {
  File,
  User,
  DownloadHistory,
  Company,
  Department,
} = require ('../database/models');

exports.getUserDetails = async (req, res) => {
  try {
    const userId = parseInt (req.params.id);
    if (isNaN (userId)) {
      return res.status (400).json ({error: 'Невалидно ID на потребител.'});
    }

    // 1) Основна информация за потребителя
    const user = await User.findByPk (userId, {
      attributes: [
        'id',
        'email',
        'isAdmin',
        'isActive',
        'companyId',
        'departmentId',
        'createdAt',
      ],
      include: [
        {model: Company, as: 'Company', attributes: ['id', 'companyName']},
        {
          model: Department,
          as: 'Department',
          attributes: ['id', 'departmentName'],
        },
      ],
    });

    if (!user) {
      return res.status (404).json ({error: 'Потребителят не е намерен.'});
    }

    // 2) Взимаме история на тегленията (DownloadHistory) с файловете, сортирани по дата
    const history = await DownloadHistory.findAll ({
      where: {userId},
      include: [
        {
          model: File,
          as: 'File',
          attributes: [
            'id',
            'filename',
            'originalname',
            'companyId',
            'departmentId',
            'createdAt',
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // 3) Събираме уникалните companyId/departmentId от файловете
    const companyIds = new Set ();
    const departmentIds = new Set ();
    history.forEach (entry => {
      if (entry.File) {
        if (entry.File.companyId) companyIds.add (entry.File.companyId);
        if (entry.File.departmentId)
          departmentIds.add (entry.File.departmentId);
      }
    });

    const companies = companyIds.size
      ? await Company.findAll ({
          where: {id: Array.from (companyIds)},
          attributes: ['id', 'companyName'],
        })
      : [];
    const departments = departmentIds.size
      ? await Department.findAll ({
          where: {id: Array.from (departmentIds)},
          attributes: ['id', 'departmentName'],
        })
      : [];

    const companyMap = Object.fromEntries (
      companies.map (c => [c.id, c.companyName])
    );
    const departmentMap = Object.fromEntries (
      departments.map (d => [d.id, d.departmentName])
    );

    // 4) Форматираме записите за фронтенда
    const downloads = history.map (entry => {
      const file = entry.File || {};
      return {
        id: entry.id,
        fileId: file.id || null,
        filename: file.filename || null,
        originalname: file.originalname || file.filename || null,
        fileCompany: file.companyId
          ? {id: file.companyId, name: companyMap[file.companyId]}
          : null,
        fileDepartment: file.departmentId
          ? {id: file.departmentId, name: departmentMap[file.departmentId]}
          : null,
        downloadedAt: entry.createdAt,
      };
    });

    // 5) Връщаме структура: user + downloads
    res.json ({
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        company: user.Company
          ? {id: user.Company.id, name: user.Company.companyName}
          : null,
        department: user.Department
          ? {id: user.Department.id, name: user.Department.departmentName}
          : null,
        createdAt: user.createdAt,
      },
      downloads: downloads,
    });
  } catch (error) {
    console.error ('Error fetching user details:', error);
    res.status (500).json ({error: 'Възникна грешка на сървъра.'});
  }
};
