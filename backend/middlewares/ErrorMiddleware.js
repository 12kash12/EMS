const checkIfAttendee = (req, res, next) => {
    const userRole = req.user.role; // Assuming the user's role is available in the req.user object (set during authentication)
  
    if (userRole === 'attendee') {
      return res.status(403).json({
        message: 'You are not allowed to make any changes to the events. You have never been given access.'
      });
    }
  
    next(); 
  };
  
  export default checkIfAttendee;