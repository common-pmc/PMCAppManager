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

    // 2) Взимаме история на тегленията (DownloadHistory) с файлове, сортирани по дата
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
          ],
        },
      ],
    });
  } catch (error) {
    //
  }
};
