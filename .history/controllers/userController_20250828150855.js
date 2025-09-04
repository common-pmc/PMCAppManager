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
      attributes: [
        'id',
        'email',
        'companyId',
        'departmentId',
        'isAdmin',
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

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk (req.params.id, {
      include: [
        {
          model: Company,
          as: 'Company',
          attributes: ['id', 'companyName'],
        },
        {
          model: Department,
          as: 'Department',
          attributes: ['id', 'departmentName', 'companyId'],
        },
      ],
    });
    if (!user) {
      return res.status (404).json ({message: 'Потребителят не е намерен'});
    }
    res.status (200).json (user);
  } catch (error) {
    res.status (500).json ({message: 'Internal Server Error'});
    console.error ('Грешка при зареждане на потребителя.', error);
  }
};

const updateUser = async (req, res) => {
  try {
    //
  } catch (error) {
    //
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
