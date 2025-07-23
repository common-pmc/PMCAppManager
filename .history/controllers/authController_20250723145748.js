const {User} = require ('../database/models');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');

exports.login = async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await User.findOne ({where: {email}});
    if (!user) {
      return res.status (404).json ({message: 'Invalid email or password'});
    }

    const isMatched = await bcrypt.compare (password, user.password);
    if (!isMatched) {
      return res.status (401).json ({message: 'Invalid email or password'});
    }

    const token = jwt.sign (
      {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        company: user.company,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      }
    );

    res.json ({
      message: 'Login successful',
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
  const {email, password, company, isAdmin = false} = req.body;

  if (!req.user || !req.user.isAdmin) {
    return res
      .status (403)
      .json ({message: 'Access denied! Only admin can register users.'});
  }

  try {
    const existingUser = await User.findOne ({where: {email}});
    if (existingUser) {
      return res.status (400).json ({message: 'User already exists'});
    }
  } catch (error) {
    res.status (500).json ({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
