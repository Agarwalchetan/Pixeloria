import bcrypt from 'bcryptjs';
import { connectDB } from './connection.js';
import User from './models/User.js';
import { logger } from '../utils/logger.js';

export const initializeDatabase = async () => {
  try {
    logger.info('Starting database initialization...');

    // Connect to MongoDB
    await connectDB();

    // Create sample data if collections are empty
    await createSampleData();

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
      
      const adminUser = new User({
        name: 'Admin User',
        email: process.env.ADMIN_EMAIL,
        password_hash: hashedPassword,
        role: 'admin'
      });

      await adminUser.save();
      logger.info('Admin user created successfully');
    } else {
      logger.info('Admin user already exists');
    }

    logger.info('Database initialization completed successfully');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
};

const createSampleData = async () => {
  try {
    // Import models
    const Portfolio = (await import('./models/Portfolio.js')).default;
    const Blog = (await import('./models/Blog.js')).default;
    const Service = (await import('./models/Service.js')).default;
    const Lab = (await import('./models/Lab.js')).default;
    const Testimonial = (await import('./models/Testimonial.js')).default;
    const Contact = (await import('./models/Contact.js')).default;
    const NewsletterSubscriber = (await import('./models/NewsletterSubscriber.js')).default;
    const HomeSettings = (await import('./models/HomeSettings.js')).default;
    const AboutSettings = (await import('./models/AboutSettings.js')).default;

    // Create sample portfolio projects if none exist
    const portfolioCount = await Portfolio.countDocuments();
    if (portfolioCount === 0) {
      const sampleProjects = [
        {
          title: 'E-Commerce Platform',
          description: 'Modern online store with advanced features',
          category: 'E-Commerce',
          tags: ['React', 'Node.js', 'Stripe'],
          tech_stack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
          results: ['50% increase in sales', '99.9% uptime'],
          link: 'https://example.com',
          status: 'published'
        },
        {
          title: 'SaaS Dashboard',
          description: 'Analytics dashboard for business intelligence',
          category: 'Web Application',
          tags: ['Next.js', 'TypeScript', 'PostgreSQL'],
          tech_stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma'],
          results: ['Real-time analytics', 'Custom reporting'],
          link: 'https://example.com',
          status: 'published'
        }
      ];
      
      await Portfolio.insertMany(sampleProjects);
      logger.info('Sample portfolio projects created');
    }

    // Create sample blog posts if none exist
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      const sampleBlogs = [
        {
          title: 'The Future of Web Development',
          excerpt: 'Exploring upcoming trends in web technology',
          content: 'Web development is constantly evolving...',
          author: 'Admin User',
          category: 'Technology',
          tags: ['web development', 'trends', 'future'],
          read_time: 5,
          status: 'published'
        },
        {
          title: 'Building Scalable Applications',
          excerpt: 'Best practices for scalable web apps',
          content: 'Scalability is crucial for modern applications...',
          author: 'Admin User',
          category: 'Development',
          tags: ['scalability', 'architecture', 'best practices'],
          read_time: 8,
          status: 'published'
        }
      ];
      
      await Blog.insertMany(sampleBlogs);
      logger.info('Sample blog posts created');
    }

    // Create sample services if none exist
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      const sampleServices = [
        {
          title: 'Web Design',
          description: 'Beautiful, responsive website design',
          features: ['Custom Design', 'Mobile Responsive', 'SEO Optimized'],
          price_range: '$2,000 - $5,000',
          duration: '2-4 weeks',
          category: 'Design',
          status: 'active'
        },
        {
          title: 'E-Commerce Development',
          description: 'Full-featured online store development',
          features: ['Shopping Cart', 'Payment Integration', 'Inventory Management'],
          price_range: '$5,000 - $15,000',
          duration: '4-8 weeks',
          category: 'Development',
          status: 'active'
        }
      ];
      
      await Service.insertMany(sampleServices);
      logger.info('Sample services created');
    }

    // Create sample lab projects if none exist
    const labCount = await Lab.countDocuments();
    if (labCount === 0) {
      const sampleLabs = [
        {
          title: 'AI Color Generator',
          description: 'Generate beautiful color palettes with AI',
          category: 'AI Tools',
          tags: ['AI', 'Colors', 'Design'],
          demo_url: '/labs/color-generator',
          source_url: 'https://github.com/pixeloria/color-generator',
          status: 'published'
        },
        {
          title: 'Animation Tester',
          description: 'Test and perfect UI animations',
          category: 'Development Tools',
          tags: ['Animation', 'CSS', 'Testing'],
          demo_url: '/labs/animation-tester',
          source_url: 'https://github.com/pixeloria/animation-tester',
          status: 'published'
        }
      ];
      
      await Lab.insertMany(sampleLabs);
      logger.info('Sample lab projects created');
    }

    // Create sample testimonials if none exist
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      const sampleTestimonials = [
        {
          name: 'Sarah Johnson',
          role: 'CEO',
          company: 'TechFlow',
          industry: 'SaaS',
          image_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
          quote: 'Pixeloria transformed our vision into reality',
          full_quote: 'Working with Pixeloria was exceptional. They delivered beyond our expectations.',
          rating: 5,
          project_type: 'SaaS Platform',
          results: ['+150% user engagement', 'Faster load times'],
          status: 'published'
        },
        {
          name: 'Michael Chen',
          role: 'Founder',
          company: 'EcoStore',
          industry: 'E-Commerce',
          image_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
          quote: 'Outstanding e-commerce platform that boosted our sales',
          full_quote: 'The team built us a beautiful and functional e-commerce platform.',
          rating: 5,
          project_type: 'E-Commerce Store',
          results: ['+200% sales increase', 'Mobile optimization'],
          status: 'published'
        }
      ];
      
      await Testimonial.insertMany(sampleTestimonials);
      logger.info('Sample testimonials created');
    }

    // Create sample contacts if none exist
    const contactCount = await Contact.countDocuments();
    if (contactCount === 0) {
      const sampleContacts = [
        {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          company: 'Example Corp',
          phone: '+1234567890',
          project_type: 'Website',
          budget: '$5,000 - $10,000',
          message: 'Looking for a new website for our business',
          status: 'new'
        },
        {
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane.smith@example.com',
          company: 'Tech Startup',
          project_type: 'Web Application',
          budget: '$10,000 - $25,000',
          message: 'Need a custom web application for our startup',
          status: 'replied'
        }
      ];
      
      await Contact.insertMany(sampleContacts);
      logger.info('Sample contacts created');
    }

    // Create sample newsletter subscribers if none exist
    const newsletterCount = await NewsletterSubscriber.countDocuments();
    if (newsletterCount === 0) {
      const sampleSubscribers = [
        { 
          email: 'subscriber1@example.com',
          status: 'active',
          subscription_date: new Date()
        },
        { 
          email: 'subscriber2@example.com',
          status: 'active',
          subscription_date: new Date()
        },
        { 
          email: 'subscriber3@example.com',
          status: 'active',
          subscription_date: new Date()
        }
      ];
      
      await NewsletterSubscriber.insertMany(sampleSubscribers);
      logger.info('Sample newsletter subscribers created');
    }

    // Create default home settings if none exist
    const homeSettingsCount = await HomeSettings.countDocuments();
    if (homeSettingsCount === 0) {
      const defaultHomeSettings = new HomeSettings({
        edge_numbers: {
          projects_delivered: 50,
          client_satisfaction: 100,
          users_reached: "1M+",
          support_hours: "24/7"
        },
        featured_case_studies: []
      });
      
      await defaultHomeSettings.save();
      logger.info('Default home settings created');
    }

    // Create default about settings if none exist
    const aboutSettingsCount = await AboutSettings.countDocuments();
    if (aboutSettingsCount === 0) {
      const defaultAboutSettings = new AboutSettings({
        about_numbers: {
          projects_completed: "50+",
          client_satisfaction: "100%",
          support_availability: "24/7",
          team_members: "10+"
        },
        team_members: [
          {
            name: "Sarah Johnson",
            role: "Founder & Lead Developer",
            image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            bio: "Full-stack developer with 10+ years of experience in building scalable web applications.",
            fun_fact: "Can code faster with coffee than without ☕",
            skills: ["React", "Node.js", "AWS"],
            social: {
              github: "#",
              linkedin: "#",
              twitter: "#"
            },
            order: 1,
            status: 'active'
          },
          {
            name: "Michael Chen",
            role: "UI/UX Designer",
            image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            bio: "Passionate about creating beautiful and intuitive user experiences.",
            fun_fact: "Draws inspiration from nature walks 🌿",
            skills: ["Figma", "Adobe XD", "Prototyping"],
            social: {
              github: "#",
              linkedin: "#",
              twitter: "#"
            },
            order: 2,
            status: 'active'
          },
          {
            name: "Emily Rodriguez",
            role: "Technical Lead",
            image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            bio: "Architecture expert specializing in scalable solutions.",
            fun_fact: "Builds mechanical keyboards for fun ⌨️",
            skills: ["System Design", "Cloud Architecture", "DevOps"],
            social: {
              github: "#",
              linkedin: "#",
              twitter: "#"
            },
            order: 3,
            status: 'active'
          }
        ],
        journey_milestones: [
          {
            year: "2020",
            title: "Founded Pixeloria",
            description: "Started with a vision to create exceptional digital experiences.",
            icon: "Rocket",
            order: 1,
            status: 'active'
          },
          {
            year: "2021",
            title: "Team Growth",
            description: "Expanded to a team of 10 talented developers and designers.",
            icon: "Users",
            order: 2,
            status: 'active'
          },
          {
            year: "2022",
            title: "50+ Projects",
            description: "Successfully delivered over 50 projects for clients worldwide.",
            icon: "CheckCircle",
            order: 3,
            status: 'active'
          },
          {
            year: "2023",
            title: "Innovation Award",
            description: "Recognized for excellence in web development and design.",
            icon: "Star",
            order: 4,
            status: 'active'
          }
        ]
      });
      
      await defaultAboutSettings.save();
      logger.info('Default about settings created');
    }

    logger.info('Sample data creation completed successfully');
  } catch (error) {
    logger.error('Error creating sample data:', error);
  }
};