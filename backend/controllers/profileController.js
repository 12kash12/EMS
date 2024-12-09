import User from '../models/User.js';

export const updateProfile = async (req, res) => {
  try {
    const { name, preferences } = req.body; 
    
    // Ensure at least one field is provided for updating
    if (!name && !preferences) {
      return res.status(400).json({ message: 'No updates provided' });
    }
    
    // Fetch user by ID
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update fields if provided
    if (name) user.username = name;
    if (preferences) user.preferences = preferences;

    const updatedUser = await user.save(); // Save the updated user
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ notifications: user.notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
