const bcrypt = require ('bcryptjs');
const {User} = require ('../database/models');

const createUser = async (req, res) => {
  try {
    const {email, password, companyId, isAdmin, isActive} = req.body;

    const existingUser = await User.findOne ({where: {email}});
    if (existingUser) {
      return res.status (400).json ({message: 'Потребителят вече съществува'});
    }

    const hashedPassword = await bcrypt.hash (password, 10);
    const newUser = await User.create ({
      email,
      password: hashedPassword,
      companyId,
      isAdmin,
      isActive,
    });
    res.status (201).json ({
      message: 'Потребителят е създаден успешно',
      user: {
        id: newUser.id,
        email: newUser.email,
        company: newUser.company,
        isAdmin: newUser.isAdmin,
      },
    });
  } catch (error) {
    console.error ('User creation error:', error);
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
        'isAdmin',
        'createdAt',
        'updatedAt',
      ],
    });
    res.status (200).json (users);
  } catch (error) {
    console.error ('User fetch error:', error);
    res.status (500).json ({message: 'Internal Server Error'});
  }
};

module.exports = {
  getAllUsers,
  createUser,
};
