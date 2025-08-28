const {User, Company, Department} = require ('../database/models');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');

exports.login = async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await User.findOne ({where: {email}});
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

    const hashedPassword = await bcrypt.hash (password, 10);
    const user = await User.create ({
      email,
      password: hashedPassword,
      companyId,
      isAdmin,
      isActive,
    });

    res.status (201).json ({
      message: 'Потребителят е регистриран успешно!',
      user: {
        id: user.id,
        email: user.email,
        company: user.company,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status (500).json ({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
