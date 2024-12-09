
import Event from '../models/Event.js';



// Function used to display or get all the approved Events by admin
const getApprovedEvents = async (req, res) => {
  try {
    
    const { category, location, date, sortBy } = req.query;


    // Here we are filtering the objects we are going to search for
    const filters = {};
    if (category) filters.category = category;
    if (location) filters.location = location;
    if (date) filters.date = { $gte: new Date(date) }; 




    
    // Sorting options
    let sortOptions = {};
    if (sortBy === 'popularity') {
      sortOptions.popularity = -1; 
    } else if (sortBy === 'ticketsAvailable') {
      sortOptions.ticketsAvailable = -1; 
    }



    // Fetch events with filters and sorting
    const events = await Event.find({ isApproved: true, ...filters }).sort(sortOptions);

    // Checking  if a category was provided and include a message in the response
    if (category) {
      if (events.length > 0) {
        res.status(200).json({
          message: `The events in the "${category}" category are listed below:`,
          events: events,
        });
      } else {
        res.status(200).json({
          message: `No events found in the "${category}" category.`,
        });
      }
    } else {
      res.status(200).json({
        message: 'Here are the events based on your search criteria:',
        events: events,
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching events' });
  }
};



// For Attendee this will not work. This function is created just for example
const addEvent = async (req, res) => {
  try {
    const { title, description, category, location, date, ticketsAvailable, organizerId } = req.body;

    
    if (!title || !description || !category || !location || !date || !ticketsAvailable || !organizerId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

  
    const event = new Event({ title,
      description,
      category,
      location,
      date: new Date(date),
      ticketsAvailable,
      organizerId,
      isApproved: false, 
    });

    
    await event.save();

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating event' });
  }
};

export { getApprovedEvents, addEvent };
