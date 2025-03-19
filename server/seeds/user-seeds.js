import { User } from '../models/index.js';
import bcrypt from 'bcrypt';

export const seedUsers = async () => {
  await User.bulkCreate([
    { 
      username: 'JollyGuru', 
      email: 'jolly@guru.com', 
      password: await bcrypt.hash('password', 10)
    },
    { 
      username: 'SunnyScribe', 
      email: 'sunny@scribe.com', 
      password: await bcrypt.hash('password', 10)
    },
    { 
      username: 'RadiantComet', 
      email: 'radiant@comet.com', 
      password: await bcrypt.hash('password', 10)
    },
  ], { individualHooks: true }); // Keep hooks if your User model needs them
};