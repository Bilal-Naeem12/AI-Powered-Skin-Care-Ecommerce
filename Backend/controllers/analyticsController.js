
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
// Controller function to update analytics data
exports.updateAnalytics = async (req, res) => {
  try {
    const analytics = await Analytics.calculateAndUpdate();
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to get the latest analytics data
exports.getAnalytics = async (req, res) => {
  try {
    const analytics = await Analytics.findOne().sort({ created_at: -1 });
    if (!analytics) {
      return res.status(404).json({ message: 'Analytics data not found' });
    }
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
 
};


exports.getOrganizerAnalytics = async (req, res) => {
  try {
    const organizerId = req.params.id; 

    // 1. Total events organized by the current organizer
    const totalEvents = await Event.countDocuments({ organizer_id: organizerId });

    // 2. Total paid sales (sum of ticket_price * sold tickets for all paid events)
    const totalPaidSales = await Event.aggregate([
      { $match: { organizer_id: organizerId, entry_type: 'Paid' } },
      {
        $lookup: {
          from: "tickets",
          localField: "_id",
          foreignField: "event_id",
          as: "sold_tickets"
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          ticket_price: 1,
          sold_tickets_count: { $size: "$sold_tickets" } // Count how many tickets were sold
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: { $multiply: ["$ticket_price", "$sold_tickets_count"] } }
        }
      }
    ]).then(result => result[0]?.totalSales || 0);
    // 3. Total free registrations (attendees for free events)
    const freeRegistrations = await Ticket.countDocuments({
      event_id: { $in: await Event.find({ organizer_id: organizerId, entry_type: 'Free' }).distinct('_id') }
    });

    // 4. Sold tickets for all events by the organizer
    const soldTickets = await Ticket.countDocuments({
      event_id: { $in: await Event.find({ organizer_id: organizerId }).distinct('_id') }
    });

    // 5. Ticket availability (total tickets vs. sold tickets)
    const totalTickets = await Event.aggregate([
      { $match: { organizer_id: organizerId } },
      { $group: { _id: null, totalAvailable: { $sum: "$ticket_quantity" } } }
    ]).then(res => res[0]?.totalAvailable || 0);

   
    // 6. Top 3 best-selling events by ticket sales
    const topSellingEvents = await Ticket.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "event_id",
          foreignField: "_id",
          as: "event"
        }
      },
      { $unwind: "$event" },
      { $match: { "event.organizer_id": organizerId } },
      {
        $group: {
          _id: "$event_id",
          event_name: { $first: "$event.name" },
          tickets_sold: { $sum: 1 }
        }
      },
      { $sort: { tickets_sold: -1 } },
      { $limit: 3 }
    ]);


    // Return the complete analytics
    return res.status(200).json({
      total_events: totalEvents,
      total_paid_sales: totalPaidSales,
      free_registrations: freeRegistrations,
      sold_tickets: soldTickets,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// Controller for Admin Dashboard Analytics
exports.getAdminAnalytics = async (req, res) => {
  try {
    
    // Total Users by Role
    const totalUsers = await User.countDocuments();
    const totalOrganizers = await User.countDocuments({ role: 'Organizer' });
    const totalAttendees = await User.countDocuments({ role: 'Attendee' });
    const totalAdmins = await User.countDocuments({ role: 'Admin' });

    // Total Events
    const totalEvents = await Event.countDocuments();
    const dailyRevenue = await Ticket.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: 'event_id',
          foreignField: '_id',
          as: 'event'
        }
      },
      {
        $match: {
          'event.entry_type': 'Paid'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$purchased_at' },
            month: { $month: '$purchased_at' },
            day: { $dayOfMonth: '$purchased_at' }
          },
          revenue: { $sum: '$price' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1
        }
      },
      {
        $project: {
          _id: 0,
          date: {
            $concat: [
              { $toString: '$_id.year' }, '-',
              { $toString: { $cond: { if: { $lt: ['$_id.month', 10] }, then: { $concat: ['0', { $toString: '$_id.month' }] }, else: { $toString: '$_id.month' } } } }, '-',
              { $toString: { $cond: { if: { $lt: ['$_id.day', 10] }, then: { $concat: ['0', { $toString: '$_id.day' }] }, else: { $toString: '$_id.day' } } } }
            ]
          },
          revenue: 1
        }
      }
    ]);
    // Upcoming Events (events that are in the future)
    const upcomingEvents = await Event.countDocuments({ date_from: { $gte: new Date() } });

    // Total Revenue (sum of ticket prices for paid events)
    const totalRevenue = await Ticket.aggregate([
      { 
        $lookup: { 
          from: 'events', 
          localField: 'event_id', 
          foreignField: '_id', 
          as: 'event' 
        } 
      },
      { $match: { 'event.entry_type': 'Paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$price' } } }
    ]).then(res => res[0]?.totalRevenue || 0);

    // Free Registrations (count of tickets for free events)
    const freeRegistrations = await Ticket.countDocuments({
      event_id: { $in: await Event.find({ entry_type: 'Free' }).distinct('_id') }
    });

    // Ticket Availability
    const totalTickets = await Event.aggregate([
      { $group: { _id: null, totalAvailable: { $sum: "$ticket_quantity" } } }
    ]).then(res => res[0]?.totalAvailable || 0);

    const soldTickets = await Ticket.countDocuments();
    const ticketAvailability = totalTickets > 0 ? (soldTickets / totalTickets) * 100 : 0;

    // Top 5 Best-Selling Events
    const topEvents = await Ticket.aggregate([
      {
        $group: {
          _id: "$event_id",
          soldTickets: { $sum: 1 }
        }
      },
      { $sort: { soldTickets: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'event'
        }
      },
      { $unwind: "$event" }
    ]);

    // Recent Activities (get recent tickets sold or users registered)
    const recentActivities = await Ticket.find()
      .sort({ purchased_at: -1 })
      .limit(5)
      .populate('user_id', 'first_name last_name')
      .populate('event_id', 'name banner');

    // Return analytics data to frontend
    res.status(200).json({
      totalUsers,
      totalOrganizers,
      totalAttendees,
      totalAdmins,
      totalEvents,
      upcomingEvents,
      totalRevenue,
      freeRegistrations,
      ticketAvailability: ticketAvailability.toFixed(2), // Format ticket availability
      topEvents,
      recentActivities,
      revenueOverTime: dailyRevenue,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

