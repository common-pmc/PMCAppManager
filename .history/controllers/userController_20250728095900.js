const {User} = require ('../models/userModel');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll ({
      attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']],
    });
    res.status (200).json (users);
  } catch (error) {
    res.status (500).json ({message: 'Internal Server Error'});
  }
};
