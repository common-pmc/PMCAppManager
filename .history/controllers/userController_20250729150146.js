const bcrypt = require ('bcryptjs');
const {User} = require ('../database/models');

const createUser = async (req, res) => {};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll ({
      attributes: ['id', 'email', 'createdAt', 'updatedAt'],
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
