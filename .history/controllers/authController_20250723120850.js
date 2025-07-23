const {User} = require ('../database/models');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');

exports.login = async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await User.findOne ({where: {email}});
    if (!user) {
      return res.status (404).json ({message: 'Invalid email or password'});

      const isMatched = await bcrypt.compare (password, user.password);
    }
  } catch (error) {}
};
