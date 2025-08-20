const {Company, Department} = require ('../database/models');

exports.listCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll ({
      attributes: ['id', 'companyName'],
      order: [['companyName', 'ASC']],
    });
    res.json (companies);
  } catch (error) {
    res.status (500).json ({
      error: 'Грешка при извличане на компаниите',
      error: error.message,
    });
  }
};

exports.getCompanyDepartments = async (req, res) => {};
