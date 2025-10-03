const bcrypt = require ('bcryptjs');
const {User, Company, Department} = require ('../database/models');

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
    const users = await User.findAll ({
      where: {isDeleted: false},
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
      order: [['createdAt', 'DESC']],
    });
    res.status (200).json (users);
  } catch (error) {
    console.error ('Грешка при зареждане на потребителите.', error);
    res.status (500).json ({message: 'Internal Server Error'});
  }
};

const getUserDashboard = async (req, res) => {
  try {
    const user = req.user;
    res.json ({
      status: user.isActive ? 'активен' : 'неактивен',
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
