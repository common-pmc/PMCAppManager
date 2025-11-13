const {Op} = require ('sequelize');

async function paginate (model, options = {}) {
  const {
    page = 1,
    limit = 10,
    searchField = null,
    searchValue = '',
    where = {},
    include = [],
    order = [['createdAt', 'DESC']],
    attributes = null,
    maxLimit = 100,
    buildWhere = null,
  } = options;

  const pageInt = Math.max (1, parseInt (page, 10) || 1);
  const limitInt = Math.min (parseInt (limit, 10) || 10, maxLimit);
  const offset = (pageInt - 1) * limitInt;

  let finalWhere = {...where};
  if (searchField && searchValue) {
    finalWhere = {
      ...finalWhere,
      [searchField]: {
        [Op.iLike || Op.like]: `%${searchValue}%`,
      },
    };
  }

  if (typeof buildWhere === 'function') {
    finalWhere = {
      ...finalWhere,
      ...buildWhere (searchField, searchValue),
    };
  }

  const findOptions = {
    where: finalWhere,
    include,
    order,
    limit: limitInt,
    offset,
  };
  if (attributes) {
    findOptions.attributes = attributes;
  }

  const {count, rows} = await model.findAndCountAll (findOptions);
}
