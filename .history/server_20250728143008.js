const express = require ('express');
const cors = require ('cors');
const colors = require ('colors');
const db = require ('./database/models');
const authRoutes = require ('./routes/authRoutes');
const userRoutes = require ('./routes/userRoutes');

require ('dotenv').config ();

const app = express ();
const PORT = process.env.PORT || 5000;

app.use (cors ());
app.use (express.json ());

app.use ('/api/auth', authRoutes);
app.use ('/api/users', userRoutes);

db.sequelize
  .authenticate ()
  .then (() => {
    console.log (
      '✅ DB connection has been established successfully.'.green.bold
    );

    app.listen (PORT, () => {
      console.log (
        `🚀 Server is running on http://localhost:${PORT}`.yellow.bold
      );
    });
  })
  .catch (err => {
    console.error ('❌ Unable to connect to the database:'.red.bold, err);
    process.exit (1); // Exit the process if DB connection fails
  });
