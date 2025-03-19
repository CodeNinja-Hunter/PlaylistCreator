import { Router } from 'express';
import { User } from '../models/user.js'; // Import the User model
import jwt from 'jsonwebtoken'; // Import JSON Web Token library
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing

// Login function to authenticate a user
export const login = async (req, res) => {
  const { username, password } = req.body; // Extract username and password from request body

  try {
    // Find the user in the database by username
    const user = await User.findOne({
      where: { username },
    });

    // If user is not found, send an authentication failed response
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Get the secret key from environment variables
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      console.error('JWT_SECRET is not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

    // Send the token as a JSON response with success flag
    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('Login error:', error); // Log error for Render logs
    return res.status(500).json({ message: 'Server error' });
  }
};

// Create a new router instance
const router = Router();

// POST /auth/login - Login a user
router.post('/login', login); // Define the login route

export default router; // Export the router instance