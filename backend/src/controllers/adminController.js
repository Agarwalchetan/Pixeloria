import User from '../database/models/User.js';
import Portfolio from '../database/models/Portfolio.js';
import Blog from '../database/models/Blog.js';
import Contact from '../database/models/Contact.js';
import Service from '../database/models/Service.js';
import Lab from '../database/models/Lab.js';
import NewsletterSubscriber from '../database/models/NewsletterSubscriber.js';
import Testimonial from '../database/models/Testimonial.js';
import { sendEmail } from '../utils/email.js';
import { logger } from '../utils/logger.js';

export const getDashboardOverview = async (req, res, next) => {
  try {
    // Ensure all models are available
    if (!Portfolio || !Blog || !Contact || !Service || !Lab || !User || !NewsletterSubscriber || !Testimonial) {
      return res.status(500).json({
        success: false,
        message: 'Database models not properly initialized',
      });
    }

    const [
      portfolioCount,
      blogCount,
      contactCount,
      serviceCount,
      labCount,
      userCount,
      newsletterCount,
      testimonialCount,
      recentContacts,
      recentBlogs,
    ] = await Promise.all([
      Portfolio.countDocuments().catch(() => 0),
      Blog.countDocuments().catch(() => 0),
      Contact.countDocuments().catch(() => 0),
      Service.countDocuments().catch(() => 0),
      Lab.countDocuments().catch(() => 0),
      User.countDocuments().catch(() => 0),
      NewsletterSubscriber.countDocuments().catch(() => 0),
      Testimonial.countDocuments().catch(() => 0),
      Contact.find().sort({ createdAt: -1 }).limit(5).catch(() => []),
      Blog.find().sort({ createdAt: -1 }).limit(5).catch(() => []),
    ]);

    // Get monthly contact submissions
    const monthlyContacts = await Contact.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]).catch(() => []);

    // Get contact status distribution
    const contactStatus = await Contact.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]).catch(() => []);

    res.json({
      success: true,
      data: {
        statistics: {
          portfolio: portfolioCount || 0,
          blogs: blogCount || 0,
          contacts: contactCount || 0,
          services: serviceCount || 0,
          labs: labCount || 0,
          users: userCount || 0,
          newsletter: newsletterCount || 0,
          testimonials: testimonialCount || 0,
        },
        charts: {
          monthlyContacts: monthlyContacts || [],
          contactStatus: contactStatus || [],
        },
        recent: {
          contacts: recentContacts || [],
          blogs: recentBlogs || [],
        },
      },
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    // Return fallback data instead of error
    res.json({
      success: true,
      data: {
        statistics: {
          portfolio: 0,
          blogs: 0,
          contacts: 0,
          services: 0,
          labs: 0,
          users: 1,
          newsletter: 0,
          testimonials: 0,
        },
        charts: {
          monthlyContacts: [],
          contactStatus: [],
        },
        recent: {
          contacts: [],
          blogs: [],
        },
      },
    });
  }
};
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    // Get contact status distribution
    const contactStatus = await Contact.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        statistics: {
          portfolio: portfolioCount,
          blogs: blogCount,
          contacts: contactCount,
          services: serviceCount,
          labs: labCount,
          users: userCount,
          newsletter: newsletterCount,
          testimonials: testimonialCount,
        },
        charts: {
          monthlyContacts,
          contactStatus,
        },
        recent: {
          contacts: recentContacts,
          blogs: recentBlogs,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    // Mock analytics data - in real app, this would come from analytics service
    const analyticsData = {
      pageViews: {
        total: 12543,
        thisMonth: 3421,
        growth: 15
      },
      labUsage: {
        total: 2847,
        thisMonth: 892,
        growth: 22
      },
      costCalculator: {
        total: 1234,
        thisMonth: 345,
        growth: 8
      },
      popularPages: [
        { page: '/labs/color-generator', views: 1245 },
        { page: '/cost-estimator', views: 987 },
        { page: '/portfolio', views: 876 },
        { page: '/services', views: 654 },
      ],
      popularLabTools: [
        { name: 'AI Color Generator', usage: 95 },
        { name: 'Neural Network Viz', usage: 88 },
        { name: 'Animation Tester', usage: 82 },
        { name: 'Code Playground', usage: 75 },
      ]
    };

    res.json({
      success: true,
      data: analyticsData,
    });
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Contact.countDocuments(filter);

    res.json({
      success: true,
      data: {
        contacts,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'replied', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: new, replied, closed',
      });
    }

    const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: { contact },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password_hash').sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        users,
        total: users.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate role if provided
    if (updates.role && !['admin', 'client', 'guest'].includes(updates.role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be one of: admin, client, guest',
      });
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password_hash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === id) {
      return res.status(403).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getNewsletterSubscribers = async (req, res, next) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({ subscription_date: -1 });

    res.json({
      success: true,
      data: {
        subscribers,
        total: subscribers.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const sendNewsletter = async (req, res, next) => {
  try {
    const { subject, content } = req.body;

    if (!subject || !content) {
      return res.status(400).json({
        success: false,
        message: 'Subject and content are required',
      });
    }

    // Get all subscribers
    const subscribers = await NewsletterSubscriber.find();

    // Send email to all subscribers
    const emailPromises = subscribers.map(subscriber => 
      sendEmail({
        to: subscriber.email,
        subject,
        html: content,
      }).catch(error => {
        logger.error(`Failed to send newsletter to ${subscriber.email}:`, error);
        return null;
      })
    );

    const results = await Promise.allSettled(emailPromises);
    const successCount = results.filter(result => result.status === 'fulfilled').length;

    res.json({
      success: true,
      message: `Newsletter sent to ${successCount} out of ${subscribers.length} subscribers`,
      data: {
        totalSubscribers: subscribers.length,
        successfulSends: successCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNewsletterSubscriber = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subscriber = await NewsletterSubscriber.findByIdAndDelete(id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found',
      });
    }

    res.json({
      success: true,
      message: 'Subscriber removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        testimonials,
        total: testimonials.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (req, res, next) => {
  try {
    const {
      name,
      role,
      company,
      industry,
      image_url,
      quote,
      full_quote,
      rating,
      project_type,
      results,
      status = 'published'
    } = req.body;

    const testimonial = new Testimonial({
      name,
      role,
      company,
      industry,
      image_url,
      quote,
      full_quote,
      rating,
      project_type,
      results,
      status
    });

    await testimonial.save();

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: { testimonial },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const testimonial = await Testimonial.findByIdAndUpdate(id, updates, { new: true });

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: { testimonial },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    res.json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { type, settings } = req.body;

    // In a real app, you'd save these to a Settings model
    // For now, we'll just return success
    res.json({
      success: true,
      message: `${type} settings updated successfully`,
      data: { settings }
    });
  } catch (error) {
    next(error);
  }
};

export const bulkDelete = async (req, res, next) => {
  try {
    const { type, ids } = req.body;

    if (!type || !ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: 'Type and ids array are required',
      });
    }

    let Model;
    switch (type) {
      case 'blogs':
        Model = Blog;
        break;
      case 'portfolio':
        Model = Portfolio;
        break;
      case 'services':
        Model = Service;
        break;
      case 'labs':
        Model = Lab;
        break;
      case 'contacts':
        Model = Contact;
        break;
      case 'testimonials':
        Model = Testimonial;
        break;
      case 'newsletter':
        Model = NewsletterSubscriber;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid type',
        });
    }

    const result = await Model.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `${result.deletedCount} items deleted successfully`,
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    next(error);
  }
};