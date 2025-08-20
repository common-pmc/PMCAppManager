const {Company, Department} = require ('../database/models');

exports.listCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll ({
      attributes: ['id', 'companyName'],
    });
  } catch (error) {
    console.error ('Error listing companies:', error);
    res.status (500).json ({message: 'Server error'});
  }
};
