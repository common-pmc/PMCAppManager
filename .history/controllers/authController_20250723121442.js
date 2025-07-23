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
      token,
    });
  } catch (error) {}
};
