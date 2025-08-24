# Pixeloria

A comprehensive web application for digital services with an interactive cost estimator, admin dashboard, and client management system.

## 🚀 Features

### **Cost Estimator**
- Interactive multi-step calculator for project cost estimation
- Dynamic pricing based on project type, features, and timeline
- Real-time cost breakdown with visual charts
- Email submission and PDF export capabilities

### **Admin Dashboard**
- Complete calculator submission management
- View detailed submission reports in formatted HTML
- User management and authentication
- Analytics and reporting tools
- Content management for calculator configurations

### **Client Features**
- Modern responsive design with smooth animations
- Interactive chat widget for customer support
- Portfolio showcase and service pages
- Contact forms and newsletter subscription

## 🛠 Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for development and building
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons
- React Router for navigation

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Swagger API documentation
- Winston logging
- Nodemailer for email services

## 📁 Project Structure

```
Pixeloria/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── admin/             # Admin dashboard components
│   ├── hooks/             # Custom React hooks
│   ├── layouts/           # Layout components
│   └── utils/             # Utility functions and API
├── backend/               # Backend Node.js application
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Authentication & validation
│   │   ├── database/      # Database models and config
│   │   ├── routes/        # API routes
│   │   └── utils/         # Backend utilities
│   └── uploads/           # File upload storage
└── docs/                  # Documentation files
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account or local MongoDB
- Gmail account for email services

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Pixeloria
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Environment Setup**
```bash
# Copy backend environment file
cp backend/.env.example backend/.env
# Configure your MongoDB URI, JWT secret, and email credentials
```

5. **Start Development Servers**

Backend (runs on port 5000 or 50001 if port conflict):
```bash
cd backend
npm run dev
```

Frontend (runs on port 5173):
```bash
npm run dev
```

## 🔧 Configuration

### Backend Environment Variables
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
ADMIN_EMAIL=admin@pixeloria.com
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:5000/api
```

## 📖 API Documentation

Once the backend is running, visit:
- **Swagger Docs**: `http://localhost:5000/api-docs`
- **API Base URL**: `http://localhost:5000/api`

## 🔐 Admin Access

**Default Admin Credentials:**
- Email: `chetanagarwal1302@gmail.com`
- Password: `admin123`

**Admin Features:**
- Calculator submission management
- User management
- Content management
- Analytics dashboard
- System configuration

## 🧪 Testing

### Cost Estimator Flow
1. Visit `/cost-estimator`
2. Click "Start Calculator"
3. Select project type
4. Configure pages and features
5. Choose design complexity and timeline
6. Enter contact information
7. Submit and receive estimate

### Admin Dashboard
1. Login at `/admin/login`
2. View calculator submissions
3. Click "View Details" to see formatted reports
4. Manage users and system settings

## 🚀 Deployment

The application is configured for deployment on:
- **Frontend**: Netlify, Vercel
- **Backend**: Railway, Heroku, DigitalOcean
- **Database**: MongoDB Atlas

See `netlify.toml` and `vercel.json` for deployment configurations.

## 📝 Development Notes

### Port Management
- Backend automatically finds available port (5000 or 50001+)
- Frontend API calls adapt to backend port
- Check console logs for actual running ports

### Authentication
- JWT tokens stored in localStorage/sessionStorage
- Admin routes protected with middleware
- Token expiration handled gracefully

### Database
- MongoDB with Mongoose ODM
- Automatic sample data creation
- User roles: admin, editor, viewer

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Email: hello@pixeloria.com
- Phone: (415) 555-0123

---

**Built with ❤️ by the Pixeloria Team**

## ✅ Recently Completed Features

### **Calculator Management System**
- ✅ Complete calculator admin portal with submission management
- ✅ PDF export functionality for client quotes
- ✅ Dynamic calculator configuration (project types, features, design options)
- ✅ Real-time cost calculation with admin-defined pricing
- ✅ Analytics dashboard for calculator usage tracking

### **Comprehensive Chat System**
- ✅ Dual-mode chat widget (AI + Live Admin support)
- ✅ 4 AI model integrations: Groq, OpenAI, DeepSeek, Gemini
- ✅ User data collection (name, email, country) within chat flow
- ✅ Real-time admin chat with online/offline status detection
- ✅ Message persistence and chat history
- ✅ PDF export for chat conversations
- ✅ Admin dashboard for chat management
- ✅ WebSocket-ready architecture for real-time messaging

### **Content Management**
- ✅ Home page content management (Pixeloria Edge numbers, featured case studies)
- ✅ About page content management (team members, journey milestones)
- ✅ Dynamic content loading from admin portal to main website

## 🔧 Remaining Development Tasks

1. WebSocket implementation for real-time chat updates
2. Advanced chat features (file sharing, emoji reactions)
3. Chat analytics and reporting
4. Mobile app integration
5. Advanced AI model configurations and fine-tuning