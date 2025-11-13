const {Op} = require ('sequelize');

async function paginate (model, options = {}) {
  const {
    page = 1,
    limit = 10,
    searchField = null,
    searchValue = '',
    where = {},
    order = [['createdAt', 'DESC']],
  } = options;
}
