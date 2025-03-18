const Event = require('../models/Event');

exports.updateEventStatus = async (req, res) => {
    try {
      const { status } = req.body;  // Get the new status from the request body
      const eventId = req.params.id; // Get the event ID from the route params
  

      const validStatuses = ['In Process', 'Approved', 'Reject', 'Complete']
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
  
      // Find the event by ID and update the status
      const event = await Event.findByIdAndUpdate(
        eventId,
        { status },
        { new: true }  // Return the updated document
      );
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      res.status(200).json({
        message: `Event status updated to ${status}`,
        event
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating event status', error });
    }
  }


  exports.getAllEvents = async (req, res) => {
    try {
      const events = await Event.find().populate('organizer_id', 'first_name last_name email');
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };