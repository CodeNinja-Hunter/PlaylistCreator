import { User } from '../models/index.js';
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing

export const seedUsers = async () => {
  await User.bulkCreate([
    { 
      username: 'JollyGuru', 
      email: 'jolly@guru.com', 
      password: await bcrypt.hash('password', 10) // Hash the password
    },
    { 
      username: 'SunnyScribe', 
      email: 'sunny@scribe.com', 
      password: await bcrypt.hash('password', 10) // Hash the password
    },
    { 
      username: 'RadiantComet', 
      email: 'radiant@comet.com', 
      password: await bcrypt.hash('password', 10) // Hash the password
    },
  ], { individualHooks: true }); // Keep hooks for any model-level hashing (if applicable)
};

