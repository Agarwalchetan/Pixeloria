# Pixeloria Backend API

A comprehensive Node.js/Express backend for the Pixeloria web development agency platform.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Portfolio Management**: CRUD operations for project portfolios
- **Blog System**: Content management for blog posts
- **Contact Management**: Handle contact form submissions and inquiries
- **Services Management**: Manage service offerings and pricing
- **Labs Projects**: Experimental projects and demos
- **Cost Estimation**: Dynamic project cost calculator
- **Admin Dashboard**: Administrative interface with analytics
- **File Upload**: Image and document upload with processing
- **Email Integration**: Automated email notifications
- **API Documentation**: Swagger/OpenAPI documentation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Sharp (image processing)
- **Email**: Nodemailer
- **Validation**: Joi
- **Documentation**: Swagger
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- SMTP email service (Gmail, SendGrid, etc.)

### Installation

1. **Clone and setup**:
   ```bash
   cd backend
   npm install
   node src/server.js
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=pixeloria_db
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key
   
   # Email
   EMAIL_HOST=smtp.gmail.com
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   
   # Admin
   ADMIN_EMAIL=admin@pixeloria.com
   ADMIN_PASSWORD=admin123
   ```

3. **Database Setup**:
   ```bash
   # Create PostgreSQL database
   createdb pixeloria_db
   
   # Run migrations (creates tables and admin user)
   npm run migrate
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## API Documentation

Once the server is running, visit `http://localhost:5000/api-docs` for interactive API documentation.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Portfolio
- `GET /api/portfolio` - Get all projects
- `GET /api/portfolio/:id` - Get single project
- `POST /api/portfolio` - Create project (admin)
- `PATCH /api/portfolio/:id` - Update project (admin)
- `DELETE /api/portfolio/:id` - Delete project (admin)

### Blog
- `GET /api/blogs` - Get all blog posts
- `GET /api/blogs/:id` - Get single post
- `POST /api/blogs` - Create post (admin)
- `PATCH /api/blogs/:id` - Update post (admin)
- `DELETE /api/blogs/:id` - Delete post (admin)

### Contact
- `POST /api/contact` - Submit contact form
- `POST /api/contact/newsletter` - Subscribe to newsletter

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service (admin)
- `PATCH /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Labs
- `GET /api/labs` - Get all lab projects
- `GET /api/labs/:id` - Get single lab project
- `POST /api/labs` - Create lab project (admin)
- `PATCH /api/labs/:id` - Update lab project (admin)
- `DELETE /api/labs/:id` - Delete lab project (admin)

### Estimate
- `POST /api/estimate` - Calculate project cost
- `GET /api/estimate/features` - Get available features

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/contacts` - All contact submissions
- `PATCH /api/admin/contacts/:id/status` - Update contact status
- `GET /api/admin/users` - All users
- `PATCH /api/admin/users/:id` - Update user role
- `GET /api/admin/testimonials` - All testimonials
- `POST /api/admin/testimonials` - Create testimonial
- `GET /api/admin/newsletter` - Newsletter subscribers

## Database Schema

### Users
- Authentication and user management
- Role-based access (admin, client, guest)

### Portfolio
- Project showcase with images and details
- Categories, tags, tech stack, results

### Blogs
- Content management system
- Categories, tags, SEO fields

### Contacts
- Contact form submissions
- File attachments, status tracking

### Services
- Service offerings and pricing
- Features, duration, categories

### Labs
- Experimental projects
- Demo links, source code, images

### Newsletter Subscribers
- Email subscription management

### Testimonials
- Client testimonials and reviews
- Ratings, project details, results

## File Upload

The API supports file uploads for:
- Portfolio project images
- Blog post featured images
- Lab project screenshots
- Contact form attachments

Files are automatically processed and optimized using Sharp.

## Email Features

Automated emails for:
- Welcome messages for new users
- Contact form notifications
- Password reset links
- Project cost estimates
- Newsletter confirmations

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers
- File upload restrictions

## Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run migrate` - Run database migrations

### Project Structure
```
src/
├── database/          # Database connection and migrations
├── middleware/        # Authentication, validation, error handling
├── routes/           # API route handlers
├── utils/            # Utilities (email, file upload, logging)
└── server.js         # Main application entry point
```

## Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy to your preferred platform (Heroku, DigitalOcean, AWS, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details