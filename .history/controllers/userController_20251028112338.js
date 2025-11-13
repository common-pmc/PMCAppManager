const bcrypt = require ('bcryptjs');
const {Op, fn, col, where: sequelizeWhere, where} = require ('sequelize');
const {User, Company, Department} = require ('../database/models');
const {paginate} = require ('../utils/paginate');

const createUser = async (req, res) => {
  try {
    const {
      email,
      password,
      companyId,
      departmentId,
      isAdmin,
      isActive,
    } = req.body;

    const existingUser = await User.findOne ({where: {email}});
    if (existingUser) {
      return res.status (400).json ({message: 'Потребителят вече съществува'});
    }

    const hashedPassword = await bcrypt.hash (password, 10);
    const newUser = await User.create ({
      email,
      password: hashedPassword,
      companyId,
      departmentId,
      isAdmin,
      isActive,
    });
    res.status (201).json ({
      message: 'Потребителят е създаден успешно',
      user: {
        id: newUser.id,
        email: newUser.email,
        company: newUser.company,
        departmentId: newUser.departmentId,
        isAdmin: newUser.isAdmin,
      },
    });
    console.log ('Получено departmentId:', departmentId);
  } catch (error) {
    console.error ('Грешка при създаване на потребителя.', error);
    res.status (500).json ({message: 'Internal Server Error'});
  }
};

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt (req.query.page) || 1;
    const limit = parseInt (req.query.limit) || 10;
    const search = req.query.search || '';

    const {data, pagination} = await paginate (User, {
      page,
      limit,
      searchField: 'email',
      searchValue: search,
      where: {isDeleted: false},
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
      ],
      attributes: [
        'id',
        'email',
        'companyId',
        'departmentId',
        'isAdmin',
        'isActive',
        'isDeleted',
        'deletedAt',
        'createdAt',
        'updatedAt',
      ],
      order: [['createdAt', 'DESC']],
      maxLimit: 100,
    });

    res.status (200).json ({data, pagination});

    // const users = await User.findAll ({
    //   where: {isDeleted: false},
    //   attributes: [
    //     'id',
    //     'email',
    //     'companyId',
    //     'departmentId',
    //     'isAdmin',
    //     'isActive',
    //     'isDeleted',
    //     'deletedAt',
    //     'createdAt',
    //     'updatedAt',
    //   ],
    //   include: [
    //     {
    //       model: Company,
    //       as: 'Company',
    //       attributes: ['id', 'companyName'],
    //     },
    //     {
    //       model: Department,
    //       as: 'Department',
    //       attributes: ['id', 'departmentName'],
    //     },
    //   ],
    //   order: [['createdAt', 'DESC']],
    // });
    // res.status (200).json (users);
  } catch (error) {
    console.error ('Грешка при зареждане на потребителите.', error);
    res.status (500).json ({message: 'Internal Server Error'});
  }
};

const getUserDashboard = async (req, res) => {
  try {
    const user = req.user;
    res.json ({
      status: user.isActive ? 'active' : 'inactive',
      files: [],
    });
  } catch (error) {
    console.error ('Грешка при зареждане на дашборда на потребителя.', error);
    res.status (500).json ({message: 'Internal Server Error'});
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserDashboard,
};
