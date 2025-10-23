const {User, Company, Department} = require ('../database/models');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');

exports.login = async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await User.findOne ({where: {email}});
    if (user.isDeleted || !user.isActive) {
      return res
        .status (403)
        .json ({message: 'Потребителят е деактивиран или изтрит'});
    }

    if (!user) {
      return res.status (404).json ({message: 'Невалидни имейл или парола'});
    }

    const isMatched = await bcrypt.compare (password, user.password);
    if (!isMatched) {
      return res.status (401).json ({message: 'Невалидни имейл или парола'});
    }

    const token = jwt.sign (
      {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        companyId: user.companyId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      }
    );

    res.json ({
      message: 'Влизането успешно!',
      accessToken: token,
    });
  } catch (error) {
    res.status (500).json ({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.register = async (req, res) => {
  const {
    email,
    password,
    companyId,
    departmentId,
    isAdmin = false,
    isActive = true,
  } = req.body;

  if (!req.user || !req.user.isAdmin) {
    return res.status (403).json ({
      message: 'Достъпът забранен! Само администратор може да регистрира потребители.',
    });
  }

  try {
    const existingUser = await User.findOne ({where: {email}});
    if (existingUser) {
      return res.status (400).json ({message: 'Потребителят вече съществува!'});
    }

    if (companyId) {
      const company = await Company.findByPk (companyId);
      if (!company) {
        return res.status (400).json ({message: 'Фирмата не е намерена!'});
      }
    }

    if (departmentId) {
      const department = await Department.findByPk (departmentId);
      if (!department) {
        return res.status (400).json ({message: 'Отделът не е намерен!'});
      }
    }

    const hashedPassword = await bcrypt.hash (password, 10);
    const user = await User.create ({
      email,
      password: hashedPassword,
      companyId,
      departmentId,
      isAdmin,
      isActive,
    });

    res.status (201).json ({
      message: 'Потребителят е регистриран успешно!',
      user: {
        id: user.id,
        email: user.email,
        companyId: user.companyId,
        departmentId: user.departmentId,
        isAdmin: user.isAdmin,
        department: departmentId
          ? await Department.findByPk (departmentId, {
              attributes: ['id', 'departmentName'],
            })
          : null,
      },
    });
  } catch (error) {
    res.status (500).json ({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const {oldPassword, newPassword} = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status (400)
        .json ({message: 'Моля, попълнете всички полета.'});
    }

    const user = await User.findByPk (userId);
    if (!user) {
      return res.status (404).json ({message: 'Потребителят не е намерен.'});
    }

    const isMatch = await bcrypt.compare (oldPassword, user.password);
    if (!isMatch) {
      return res.status (401).json ({message: 'Грешна стара парола.'});
    }

    const hashedNewPassword = await bcrypt.hash (newPassword, 10);
    user.password = hashedNewPassword;
    await user.save ();

    res.json ({message: 'Паролата е променена успешно.'});
  } catch (error) {
    //
  }
};
