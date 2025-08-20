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

exports.getCompanyDepartments = async (req, res) => {
  try {
    const {companyId} = req.params.id;
    const departments = await Department.findAll ({
      where: {companyId},
      attributes: ['id', 'departmentName', 'companyId'],
      order: [['departmentName', 'ASC']],
    });
    res.json (departments);
  } catch (error) {
    res.status (500).json ({
      error: 'Грешка при извличане на отделите на компанията',
      error: error.message,
    });
  }
};

exports.createCompany = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status (403).json ({
        error: 'Достъпът е отказан. Само администратори могат да добавят фирми.',
      });
    }

    const {companyName, departmnents} = req.body;
    if (!companyName) {
      return res
        .status (400)
        .json ({error: 'Името на компанията е задължително.'});
    }

    const company = await Company.create ({companyName});

    if (Array.isArray (departmnents) && departmnents.length > 0) {
      const departmentsToCreate = departmnents.map (dept => ({
        departmentName: dept,
        companyId: company.id,
      }));
      await Department.bulkCreate (departmentsToCreate);
    }
  } catch (error) {
    res.status (500).json ({
      error: 'Грешка при създаване на компанията',
      error: error.message,
    });
  }
};
