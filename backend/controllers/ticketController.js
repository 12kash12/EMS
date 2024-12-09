import Ticket from '../models/Ticket.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Use your secret key



export const bookTicket = async (req, res) => {
  const { eventId, quantity } = req.body;
  const userId = req.user.id;
  
  try {

    // Here we fetch event data and calculate total price
    const event = await Event.findById(eventId); 
    const totalPrice = event.price * quantity;

    // Create a new Stripe payment session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: event.name,
            },
            unit_amount: totalPrice * 100, 
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
};

export const getTicketHistory = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }).populate('event', 'name date location');
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

