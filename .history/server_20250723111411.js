const express = require ('express');
const cors = require ('cors');
const colors = require ('colors');
const db = require ('./database/models');

require ('dotenv').config ();

const app = express ();
const PORT = process.env.PORT || 5000;

app.use (cors ());
app.use (express.json ());

app.listen (PORT, () => {
  console.log (
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}.`.yellow
      .bold
  );
});
