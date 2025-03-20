import { seedUsers } from './user-seeds.js';
import sequelize from '../config/connection.js';

export const seedAll = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('\n----- DATABASE SYNCED -----\n');
    
    await seedUsers();
    console.log('\n----- USERS SEEDED -----\n');
    
    // Don't exit here—let the server keep running in production
    // process.exit(0); // Remove this
  } catch (error) {
    console.error('Error seeding database:', error);
    // Don't exit here either—log the error and let server continue
    // process.exit(1); // Remove this
  }
};

// Don't call seedAll() here—let server.js decide when to run it