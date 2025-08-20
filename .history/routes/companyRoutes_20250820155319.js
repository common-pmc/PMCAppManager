const express = require ('express');
const companyController = require ('../controllers/companyController');
const {verifyToken, isAdmin} = require ('../middlewares/authToken');

const router = express.Router ();

router.get ('/', verifyToken, companyController.listCompanies);
router.get (
  '/:id/departments',
  verifyToken,
  companyController.getCompanyDepartments
);
router.post ('/', verifyToken, isAdmin, companyController.createCompany);
router.post (
  '/:id/departments',
  verifyToken,
  isAdmin,
  companyController.createDepartment
);

module.exports = router;
