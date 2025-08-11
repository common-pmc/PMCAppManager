const express = require ('express');
const fs = require ('fs');
const path = require ('path');
const cors = require ('cors');
const colors = require ('colors');
const db = require ('./database/models');
const authRoutes = require ('./routes/authRoutes');
const userRoutes = require ('./routes/userRoutes');
const fileRoutes = require ('./routes/fileRoutes');
const logRoutes = require ('./routes/logRoutes');

require ('dotenv').config ();

const app = express ();
const PORT = process.env.PORT || 5000;

// Генерира автоматично .env файл във фронтенда
const frontendEnvPath = path.join (__dirname, '../client/.env');
fs.writeFileSync (
  frontendEnvPath,
  `VITE_API_BASE_URL=${process.env.API_BASE_URL}\n`
);
console.log (`✅ Frontend env file generated at ${frontendEnvPath}`);

// Production mode: Сървърът ще обслужва билднатото React приложение
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join (__dirname, '../client/dist');
  app.use (express.static (buildPath));
}

if (process.env.NODE_ENV === 'production') {
  app.use (express.static (path.join (__dirname, 'client', 'dist')));

  app.get ('*', (req, res) => {
    res.sendFile (path.join (__dirname, 'client', 'dist', 'index.html'));
  });
} else {
  // В development можеш да върнеш просто съобщение
  app.get ('/', (req, res) => {
    res.send ('API е активно в development режим');
  });
}

app.use (cors ());
app.use (express.json ());
app.use ('/uploads', express.static (path.join (__dirname, 'uploads'))); // Статични файлове за качени файлове

app.use ('/api/auth', authRoutes);
app.use ('/api/users', userRoutes);
app.use ('/api/files', fileRoutes);
app.use ('/api/logs', logRoutes);

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
