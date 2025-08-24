# Pixeloria Backend API

Node.js/Express backend server providing REST API endpoints for the Pixeloria digital solutions platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Real-Time Chat System**: Admin-user messaging with polling synchronization
- **AI Configuration Management**: Secure API key storage for multiple AI models
- **Calculator Management**: Dynamic cost estimation with submission tracking
- **Admin Dashboard**: Complete administrative interface with analytics
- **User Management**: User roles and permissions system
- **Content Management**: Blog posts, testimonials, and portfolio management
- **Contact System**: Contact form submissions and newsletter management
- **File Upload**: Image and document upload with processing
- **Email Integration**: Automated email notifications and SMTP support
- **API Documentation**: Swagger/OpenAPI interactive documentation

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer with file validation
- **Email**: Nodemailer with Gmail SMTP
- **Validation**: Custom middleware validation
- **Documentation**: Swagger UI
- **Logging**: Winston logger
- **Security**: Helmet, CORS, Rate Limiting

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account or local MongoDB
- Gmail account for SMTP email service

### Installation

1. **Clone and setup**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Server
   PORT=5000
   
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pixeloria
   MONGODB_URI_LOCAL=mongodb://localhost:27017/pixeloria
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   
   # Email
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_gmail_app_password
   EMAIL_FROM=your_email@gmail.com
   
   # Admin
   ADMIN_EMAIL=chetanagarwal1302@gmail.com
   ADMIN_PASSWORD=admin123
   
   # Frontend
   FRONTEND_URL=http://localhost:5173
   ```

3. **Database Setup**:
   ```bash
   # MongoDB will auto-create database and collections
   # Admin user and sample data created automatically on first run
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000` (or `http://localhost:50001` if port 5000 is in use)

## API Documentation

Once the server is running, visit `http://localhost:5000/api-docs` for interactive API documentation.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user

### Chat System
- `POST /api/chat/initialize` - Initialize new chat session
- `POST /api/chat/message` - Send message in chat
- `GET /api/chat/:sessionId/history` - Get chat history
- `POST /api/chat/admin/reply` - Admin reply to user message
- `GET /api/admin/dashboard/chats` - Get all admin chats
- `PATCH /api/admin/dashboard/chats/:sessionId/status` - Update chat status

### AI Configuration (Admin)
- `GET /api/admin/dashboard/ai-config` - Get AI configuration
- `POST /api/admin/dashboard/ai-config` - Update AI configuration
- `POST /api/admin/dashboard/ai-config/test` - Test AI model connection
- `GET /api/admin/dashboard/ai-config/enabled` - Get enabled AI models

### Calculator
- `POST /api/calculator/submit` - Submit calculator form
- `GET /api/calculator/config` - Get calculator configuration

### Admin Dashboard
- `GET /api/admin/dashboard/overview` - Dashboard statistics
- `GET /api/admin/dashboard/analytics` - Analytics data

### Calculator Management (Admin)
- `GET /api/admin/dashboard/calculator/submissions` - Get all submissions
- `GET /api/admin/dashboard/calculator/submissions/:id/view` - View submission details
- `PATCH /api/admin/dashboard/calculator/submissions/:id/status` - Update submission status
- `GET /api/admin/dashboard/calculator/config` - Get calculator config
- `GET /api/admin/dashboard/calculator/project-types` - Get project types
- `GET /api/admin/dashboard/calculator/features` - Get features
- `GET /api/admin/dashboard/calculator/design-options` - Get design options
- `GET /api/admin/dashboard/calculator/timeline-options` - Get timeline options

### Contact Management (Admin)
- `GET /api/admin/dashboard/contacts` - Get all contacts
- `PATCH /api/admin/dashboard/contacts/:id/status` - Update contact status

### User Management (Admin)
- `GET /api/admin/dashboard/users` - Get all users
- `PATCH /api/admin/dashboard/users/:id` - Update user
- `DELETE /api/admin/dashboard/users/:id` - Delete user

### Newsletter (Admin)
- `GET /api/admin/dashboard/newsletter/subscribers` - Get subscribers
- `POST /api/admin/dashboard/newsletter/send` - Send newsletter
- `DELETE /api/admin/dashboard/newsletter/subscribers/:id` - Delete subscriber

### Blog Management (Admin)
- `GET /api/admin/dashboard/blog/posts` - Get all blog posts
- `POST /api/admin/dashboard/blog/posts` - Create blog post
- `PUT /api/admin/dashboard/blog/posts/:id` - Update blog post
- `DELETE /api/admin/dashboard/blog/posts/:id` - Delete blog post

### Portfolio Management (Admin)
- `GET /api/admin/dashboard/portfolio/projects` - Get all projects
- `POST /api/admin/dashboard/portfolio/projects` - Create project
- `PUT /api/admin/dashboard/portfolio/projects/:id` - Update project
- `DELETE /api/admin/dashboard/portfolio/projects/:id` - Delete project

## 📊 Database Schema

### Users
- Authentication and user management
- Role-based access (admin, editor, viewer)
- JWT token management

### Calculator Submissions
- Project cost estimation data
- Contact information and project details
- Selected features and pricing breakdown
- Submission status tracking

### Calculator Configuration
- Project types with base costs
- Available features and pricing
- Design complexity options
- Timeline options and multipliers

### Contacts
- Contact form submissions
- Status tracking and admin notes
- Email and phone information

### Blog Posts
- Content management system
- Categories, tags, SEO fields
- Publication status and dates

### Portfolio Projects
- Project showcase with images
- Technology stack and results
- Categories and featured status

### Newsletter Subscribers
- Email subscription management
- Subscription date and status

### Testimonials
- Client testimonials and reviews
- Ratings and project associations

## 📁 File Upload

The API supports file uploads for:
- Portfolio project images
- Blog post featured images
- User profile pictures
- Contact form attachments

Files are validated for type and size, with automatic organization into appropriate directories.

## 📧 Email Features

Automated emails for:
- Calculator submission confirmations
- Contact form notifications to admin
- Newsletter subscription confirmations
- Admin notifications for new submissions
- Cost estimate delivery to clients

## 🔒 Security Features

- JWT authentication with role-based access
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection for frontend integration
- Helmet security headers
- File upload type and size restrictions
- MongoDB injection protection

## Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (if available)

### Project Structure
```
backend/
├── src/
│   ├── config/           # Database and app configuration
│   ├── controllers/      # Route controllers and business logic
│   ├── database/         # Database models and connection
│   │   └── models/       # Mongoose schemas
│   ├── middleware/       # Authentication, validation, error handling
│   ├── routes/           # API route definitions
│   ├── utils/            # Utilities (email, file upload, logging)
│   └── server.js         # Main application entry point
├── uploads/              # File upload storage
│   ├── documents/        # Document uploads
│   ├── images/           # Image uploads
│   └── pdfs/             # PDF files
├── .env                  # Environment variables
├── .env.example          # Environment template
└── package.json          # Dependencies and scripts
```

## 🚀 Deployment

### Environment Setup
1. Set up MongoDB Atlas database
2. Configure environment variables in production
3. Set up Gmail SMTP for email services
4. Deploy to your preferred platform:
   - **Railway**: Connect GitHub repo, set environment variables
   - **Heroku**: Use Heroku CLI or GitHub integration
   - **DigitalOcean**: Use App Platform or Droplets
   - **Vercel**: For serverless deployment

### Production Considerations
- Use MongoDB Atlas for production database
- Set strong JWT_SECRET in production
- Configure proper CORS origins
- Set up SSL/HTTPS
- Monitor logs and performance
- Set up automated backups

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Add proper error handling
- Include input validation
- Test API endpoints thoroughly
- Update documentation as needed

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For technical support:
- Create an issue on GitHub
- Email: dev@pixeloria.com
- Check API documentation at `/api-docs`

---

**Built with ❤️ for the Pixeloria Platform**