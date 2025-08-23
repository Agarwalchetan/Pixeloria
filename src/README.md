# Pixeloria Frontend

React/TypeScript frontend application for the Pixeloria digital solutions platform.

## 🚀 Features

### **Interactive Cost Estimator**
- Multi-step wizard interface with smooth animations
- Real-time cost calculations and breakdowns
- Dynamic project type and feature selection
- Visual progress indicators and form validation
- PDF export and email submission capabilities

### **Admin Dashboard**
- Comprehensive calculator submission management
- User-friendly data tables with filtering and sorting
- Detailed submission view with formatted reports
- Real-time analytics and dashboard widgets
- Role-based access control and authentication

### **Modern UI/UX**
- Responsive design with Tailwind CSS
- Smooth animations using Framer Motion
- Interactive components with hover effects
- Clean, professional design system
- Mobile-first responsive layout

### **Client Features**
- Interactive chat widget for customer support
- Portfolio showcase with project galleries
- Service pages with detailed information
- Contact forms with validation
- Newsletter subscription functionality

## 🛠 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for utility-first styling
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React for consistent iconography
- **Routing**: React Router for client-side navigation
- **State Management**: React hooks and context
- **Form Handling**: Custom form validation
- **HTTP Client**: Fetch API with custom utilities

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── home/            # Homepage specific components
│   ├── ChatWidget.tsx   # Customer chat interface
│   ├── CursorTrail.tsx  # Interactive cursor effects
│   └── ...              # Other shared components
├── pages/               # Page components
│   ├── CostEstimator.tsx # Multi-step calculator
│   ├── Home.tsx         # Homepage
│   ├── About.tsx        # About page
│   └── Contact.tsx      # Contact page
├── admin/               # Admin dashboard components
│   ├── Calculator/      # Calculator management
│   ├── Analytics/       # Analytics dashboard
│   ├── Blog/           # Blog management
│   └── ...             # Other admin modules
├── hooks/               # Custom React hooks
│   └── useHomeData.ts   # Homepage data fetching
├── layouts/             # Layout components
│   └── Layout.tsx       # Main layout wrapper
├── utils/               # Utility functions
│   └── api.ts          # API client and utilities
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Backend API running (see backend README)

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Environment Setup**:
```bash
# Create environment file (optional)
cp .env.example .env
```

Edit `.env` if needed:
```env
VITE_API_URL=http://localhost:5000/api
```

3. **Start Development Server**:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run type-check` - Run TypeScript type checking

## 🧭 Routing

### Public Routes
- `/` - Homepage with hero section and services
- `/about` - About page with team and company info
- `/contact` - Contact form and information
- `/cost-estimator` - Interactive project cost calculator
- `/portfolio` - Project showcase and case studies
- `/blog` - Blog posts and articles

### Admin Routes (Protected)
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Main admin dashboard
- `/admin/calculator` - Calculator submissions management
- `/admin/users` - User management
- `/admin/analytics` - Analytics and reporting
- `/admin/blog` - Blog post management
- `/admin/portfolio` - Portfolio management

## 💡 Key Components

### Cost Estimator (`/src/pages/CostEstimator.tsx`)
Multi-step calculator with:
- Project type selection
- Feature configuration
- Design complexity options
- Timeline selection
- Contact information collection
- Real-time cost calculation
- Visual progress tracking

### Admin Dashboard (`/src/admin/`)
Comprehensive admin interface with:
- Calculator submission management
- User administration
- Content management
- Analytics dashboard
- System configuration

### API Integration (`/src/utils/api.ts`)
Centralized API client with:
- Authentication token management
- Request/response interceptors
- Error handling
- Type-safe API calls

## 🎨 Styling System

### Tailwind CSS Configuration
- Custom color palette matching brand
- Responsive breakpoints for all devices
- Custom animations and transitions
- Component-specific utility classes

### Animation System
- Framer Motion for page transitions
- Hover effects and micro-interactions
- Loading states and progress indicators
- Smooth scroll and parallax effects

## 🔐 Authentication

### Admin Authentication
- JWT token-based authentication
- Automatic token refresh handling
- Protected route components
- Role-based access control

### Token Management
- Stored in localStorage/sessionStorage
- Automatic cleanup on logout
- Expiration handling
- Secure transmission

## 📱 Responsive Design

### Breakpoints
- `sm`: 640px+ (Mobile landscape)
- `md`: 768px+ (Tablet)
- `lg`: 1024px+ (Desktop)
- `xl`: 1280px+ (Large desktop)
- `2xl`: 1536px+ (Extra large)

### Mobile-First Approach
- Components designed for mobile first
- Progressive enhancement for larger screens
- Touch-friendly interface elements
- Optimized performance on mobile devices

## 🧪 Development Guidelines

### Component Structure
```typescript
// Component template
import React from 'react';
import { motion } from 'framer-motion';

interface ComponentProps {
  // Define props with TypeScript
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="component-styles"
    >
      {/* Component content */}
    </motion.div>
  );
};

export default Component;
```

### State Management
- Use React hooks for local state
- Context API for global state
- Custom hooks for reusable logic
- Proper cleanup in useEffect

### API Integration
```typescript
// API call example
import { api } from '../utils/api';

const fetchData = async () => {
  try {
    const response = await api.get('/endpoint');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

## 🚀 Deployment

### Build Process
```bash
# Create production build
npm run build

# Preview build locally
npm run preview
```

### Deployment Platforms
- **Netlify**: Automatic deployment from Git
- **Vercel**: Zero-config deployment
- **GitHub Pages**: Static site hosting
- **AWS S3**: Static website hosting

### Environment Variables
Set production environment variables:
```env
VITE_API_URL=https://your-api-domain.com/api
```

## 🔍 Performance Optimization

### Code Splitting
- Lazy loading for admin routes
- Dynamic imports for large components
- Bundle optimization with Vite

### Image Optimization
- WebP format support
- Lazy loading for images
- Responsive image sizes
- Optimized asset delivery

### Caching Strategy
- API response caching
- Static asset caching
- Service worker implementation
- Browser cache optimization

## 🧪 Testing

### Testing Setup (Future)
- Jest for unit testing
- React Testing Library for component testing
- Cypress for end-to-end testing
- MSW for API mocking

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Follow component and naming conventions
3. Add TypeScript types for all props
4. Test components thoroughly
5. Submit pull request with description

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Consistent naming conventions
- Proper component organization
- Clean, readable code structure

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For frontend issues:
- Create GitHub issue with reproduction steps
- Check browser console for errors
- Verify API connectivity
- Email: frontend@pixeloria.com

---

**Built with ⚛️ React and ❤️ for amazing user experiences**
