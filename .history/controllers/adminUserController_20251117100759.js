const {Op} = require ('sequelize');
const {
  File,
  User,
  DownloadHistory,
  Company,
  Department,
} = require ('../database/models');
const paginate = require ('../utils/paginate');

exports.getUserDetails = async (req, res) => {
  try {
    const userId = parseInt (req.params.id);
    if (isNaN (userId)) {
      return res.status (400).json ({error: 'Невалидно ID на потребител.'});
    }

    const page = parseInt (req.query.page) || 1;
    const limit = parseInt (req.query.limit) || 10;
    const search = req.query.search || '';

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
    // само за конкретния потребител
    const {data: history, meta} = await paginate (DownloadHistory, {
      page,
      limit,
      where: {userId: user.id},
      include: [
        {
          model: File,
          as: 'File',
          attributes: ['id', 'filename', 'createdAt'],
          where: search
            ? {
                filename: {[Op.like]: `%${search}%`},
              }
            : undefined,
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
      // buildWhere дава възможност да търсим по полета от include (пример: File.filename)
      buildWhere: (searchField, searchValue) => {
        if (searchField === 'filename') {
          return {
            '$File.filename$': {[Op.like]: `%${searchValue}%`},
          };
        }
        return {}; // Ако няма съвпадение, връщаме празен обект
      },
      searchField: 'filename',
      searchValue: search,
    });

    // const history = await DownloadHistory.findAll ({
    //   where: {userId: req.params.id},
    //   include: [
    //     {
    //       model: File,
    //       as: 'File',
    //       attributes: ['id', 'filename', 'createdAt'],
    //     },
    //   ],
    //   order: [['createdAt', 'DESC']],
    // });

    // 3) Форматиране на записите за фронтенда
    const downloads = history.map (entry => {
      const file = entry.File || {};
      return {
        id: entry.id,
        fileId: file.id || null,
        filename: file.filename || null,
        fileCompany: user.Company
          ? {id: user.Company.id, name: user.Company.companyName}
          : null,
        fileDepartment: user.Department
          ? {id: user.Department.id, name: user.Department.departmentName}
          : null,
        downloadedAt: entry.createdAt,
      };
    });

    // 4) Връщаме user + downloads + meta (meta съдържа total,page,pageCount,pageSize)
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
      downloads,
      meta,
    });
  } catch (error) {
    console.error ('Грешка при извличане на детайли за потребителя.', error);
    res
      .status (500)
      .json ({message: 'Грешка при извличане на детайли за потребителя.'});
  }
};

exports.toggleUserActive = async (req, res) => {
  // Активиране/деактивиране на потребител
  try {
    const id = req.params.id;

    // Администраторът не може да деактивира сам себе си
    if (req.user && req.user.id === parseInt (id)) {
      return res
        .status (400)
        .json ({error: 'Администраторът не може да деактивира сам себе си.'});
    }

    const user = await User.findByPk (id);
    if (!user) {
      return res.status (404).json ({error: 'Потребителят не е намерен.'});
    }
    await user.update ({isActive: !user.isActive});
    res.json ({id: user.id, isActive: user.isActive});
  } catch (error) {
    //
  }
};

exports.deleteUser = async (req, res) => {
  // Изтриване на потребител по ID - потребителят получава флаг isDeleted = true (т.нар. soft delete)
  try {
    const id = req.params.id;
    const user = await User.findByPk (id);
    if (!user) {
      return res.status (404).json ({error: 'Потребителят не е намерен.'});
    }
    if (user.isDeleted) {
      return res.status (400).json ({error: 'Потребителят вече е изтрит.'});
    }

    // Администраторът не може да изтрие сам себе си
    if (req.user && req.user.id === user.id) {
      return res
        .status (400)
        .json ({error: 'Администраторът не може да изтрие сам себе си.'});
    }

    await user.update ({
      isDeleted: true,
      isActive: false,
      deletedAt: new Date (),
    });

    res.json ({message: 'Потребителят е изтрит успешно.'});
  } catch (error) {
    //
  }
};
