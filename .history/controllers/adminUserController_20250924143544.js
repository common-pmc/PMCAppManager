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
  } catch (error) {
    //
  }
};
