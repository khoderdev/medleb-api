// Import the Sequelize library
const { Sequelize } = require('sequelize');

// Create a new Sequelize instance and connect to the 'MedLebDrugs' database
// using the username 'sa' and the password 'Theroadof1'
const sequelize = new Sequelize('CRUD_DB', 'sa', '1234', {
  // The host of the database server
  host: 'localhost',

  // The dialect/engine of the database
  dialect: 'mssql',
  logging: console.log,
  // Additional options for the dialect
  dialectOptions: {
    // The name of the SQL Server instance
    instanceName: 'SQLEXPRESS',
  },

  // Global model options
  define: {
    // Disable automatic timestamp fields (createdAt and updatedAt)
    timestamps: false,
  },
});

// Test the connection to the database
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');

    // Sync models with the database
    return sequelize.sync({ force: false }); // Set force to true to drop existing tables and recreate them
  })
  .then(() => {
    console.log('Database synchronized.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Export the Sequelize instance to be used in other parts of the application
module.exports = sequelize;
