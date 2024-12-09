import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';



// Function used for register new Attendee
export const registerAttendee = async (req, res) => {
  const { username, email, password } = req.body;

  // Here we are checking if the user is exists or not 
  try {
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    //if user is not already registered , Create a new user account
    const user = new User({
      username,
      email,
      password,
    });

    // This function saves user in database
    await user.save();

    
    // Here the JWT token is genearted 
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h', 
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      Createdby: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





// Function used to login the attendee

export const loginAttendee = async (req, res) => {
  const { email, password } = req.body;

  try {
  
    // Finding  Attendee by its email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Finding  Attendee by its Password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generating JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h', 
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      Createdby: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// This is the Function to get user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            res.json({
                _id: user.id,
                name: user.username,
                email: user.email,
            });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

// Function for Updating user profile
const updateProfile = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;

            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser.id,
                name: updatedUser.username,
                email: updatedUser.email,
                
            });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

// Function for Deleting user profile
const deleteProfile = async (req, res) => {
  try {
      
      const user = await User.findByIdAndDelete(req.user.id);

      if (user) {
          res.json({
              message: 'User profile deleted successfully',
          });
      } else {
          res.status(404).json({ message: 'User not found.' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export { getProfile, updateProfile, deleteProfile };

