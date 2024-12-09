import Feedback from '../models/Feedback.js';




// Function for Submiting feedback 
export const submitFeedback = async (req, res) => {
  const { eventId, rating, comment } = req.body;

  try {
   
    if (!eventId || !rating || !comment || !userId) {
      return res.status(400).json({ message: 'Missing required fields: eventId, rating, or comment' });
    }

    // Create a new feedback instance
    const feedback = new Feedback({
      eventId,
      userId: req.user.id,
      rating,
      comment,
    });

    // Saving feedback to database
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error('Error in submitFeedback:', error.message);
    res.status(500).json({ message: 'An error occurred while submitting feedback: ' + error.message });
  }
};





// Function to Update feedback (Editing)
export const updateFeedback = async (req, res) => {
  const { feedbackId, rating, comment } = req.body;

  try {
    // Find the feedback
    const feedback = await Feedback.findById(feedbackId);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Check if the feedback belongs to our account
    if (feedback.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own feedback' });
    }

    // Updating feedback fields
    feedback.rating = rating || feedback.rating;
    feedback.comment = comment || feedback.comment;

   
    await feedback.save();
    res.status(200).json({ message: 'Feedback updated successfully', feedback });
  } catch (error) {
    console.error('Error in updateFeedback:', error.message);
    res.status(500).json({ message: 'An error occurred while updating feedback: ' + error.message });
  }
};

// Function to delete feedback
export const deleteFeedback = async (req, res) => {
  const { feedbackId } = req.body;

  try {
    
    const feedback = await Feedback.findById(feedbackId);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Check if the feedback belongs to our account
    if (feedback.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own feedback' });
    }

    // Deleting feedback from the database
    await feedback.remove();
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error in deleteFeedback:', error.message);
    res.status(500).json({ message: 'An error occurred while deleting feedback: ' + error.message });
  }
};
