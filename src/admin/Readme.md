# Pixeloria Admin Dashboard

Comprehensive administrative interface for managing the Pixeloria digital solutions platform.

## 🎛️ Overview

The admin dashboard provides a centralized interface for managing all aspects of the Pixeloria platform, including calculator submissions, user management, content administration, and system analytics.

## 🚀 Features

### **Calculator Management**
- View all cost estimation submissions
- Detailed submission reports with formatted HTML views
- Status tracking and management
- Export capabilities for submissions
- Configuration management for calculator options

### **User Management**
- User account administration
- Role-based access control (Admin, Editor, Viewer)
- User activity monitoring
- Account status management

### **Content Management**
- Blog post creation and editing
- Portfolio project management
- Testimonial administration
- Service page content updates

### **Analytics & Reporting**
- Dashboard overview with key metrics
- Submission analytics and trends
- User engagement statistics
- Performance monitoring

### **Communication Management**
- Contact form submission handling
- Newsletter subscriber management
- Email campaign tools
- Customer inquiry tracking

## 🔐 Access Control

### Roles & Permissions

| Role | Description | Access Level |
|------|-------------|--------------|
| **Admin** 👑 | Full system access | Create/Read/Update/Delete all resources |
| **Editor** ✍️ | Content management | Create/Read/Update content, limited system access |
| **Viewer** 👁️ | Read-only access | View-only permissions for most features |

### Feature Access Matrix

| Feature | Admin | Editor | Viewer |
|---------|-------|--------|--------|
| **Dashboard Overview** | ✅ Full | ✅ Full | ✅ View |
| **Calculator Submissions** | ✅ Full | ✅ View/Update | 👁️ View |
| **Calculator Config** | ✅ Full | ✅ Full | ❌ None |
| **User Management** | ✅ Full | ✅ Limited | ❌ None |
| **Blog Management** | ✅ Full | ✅ Full | 👁️ View |
| **Portfolio Management** | ✅ Full | ✅ Full | 👁️ View |
| **Contact Management** | ✅ Full | ✅ View/Update | 👁️ View |
| **Newsletter Management** | ✅ Full | ✅ Full | 👁️ View |
| **Analytics** | ✅ Full | ✅ View | ✅ View |
| **System Settings** | ✅ Full | ❌ None | ❌ None |

## 🧭 Navigation Structure

### Main Dashboard (`/admin/dashboard`)
- Overview metrics and quick stats
- Recent submissions and activities
- System health indicators
- Quick action buttons

### Calculator Module (`/admin/calculator`)
- **Submissions List**: Paginated table of all submissions
- **Submission Details**: Formatted view with export options
- **Configuration**: Manage project types, features, pricing
- **Analytics**: Submission trends and statistics

### User Management (`/admin/users`)
- **User List**: All registered users with roles
- **User Details**: Individual user management
- **Role Assignment**: Permission management
- **Activity Logs**: User action tracking

### Content Management
- **Blog** (`/admin/blog`): Post creation and editing
- **Portfolio** (`/admin/portfolio`): Project showcase management
- **Testimonials** (`/admin/testimonials`): Client review management
- **Services** (`/admin/services`): Service page content

### Communication (`/admin/communication`)
- **Contacts**: Inquiry management and responses
- **Newsletter**: Subscriber management and campaigns
- **Email Templates**: Automated email customization

## 💡 Key Components

### Calculator Submissions Table
```typescript
// Features:
- Sortable columns (date, status, cost, etc.)
- Filterable by status, date range, project type
- Bulk actions for status updates
- Export to CSV/PDF
- Detailed view modal with formatted report
```

### Dashboard Analytics
```typescript
// Metrics displayed:
- Total submissions (daily/weekly/monthly)
- Conversion rates and trends
- Average project values
- Popular project types and features
- User engagement statistics
```

### User Management Interface
```typescript
// Capabilities:
- Create/edit user accounts
- Assign roles and permissions
- Monitor user activity
- Bulk user operations
- Security audit logs
```

## 🔧 Configuration Management

### Calculator Settings
- **Project Types**: Manage available project categories
- **Features**: Configure feature options and pricing
- **Design Options**: Set complexity levels and costs
- **Timeline Options**: Define delivery timeframes
- **Pricing Rules**: Set base costs and multipliers

### System Configuration
- **Email Settings**: SMTP configuration and templates
- **API Settings**: Rate limiting and security options
- **UI Customization**: Branding and theme settings
- **Backup Settings**: Automated backup configuration

## 📊 Analytics Dashboard

### Key Metrics
- **Submission Volume**: Daily, weekly, monthly trends
- **Conversion Rates**: Lead to customer conversion
- **Revenue Tracking**: Estimated vs actual project values
- **User Engagement**: Session duration, page views
- **Popular Services**: Most requested project types

### Reporting Features
- **Custom Date Ranges**: Flexible time period selection
- **Export Options**: PDF, CSV, Excel formats
- **Automated Reports**: Scheduled email reports
- **Comparative Analysis**: Period-over-period comparisons

## 🛠️ Development

### Component Structure
```
src/admin/
├── Calculator/           # Calculator management
│   ├── index.tsx        # Main calculator dashboard
│   ├── SubmissionView.tsx # Individual submission details
│   └── ConfigManager.tsx # Calculator configuration
├── Analytics/           # Analytics dashboard
├── Blog/               # Blog management
├── Portfolio/          # Portfolio management
├── Users/              # User management
└── shared/             # Shared admin components
    ├── Layout.tsx      # Admin layout wrapper
    ├── Sidebar.tsx     # Navigation sidebar
    └── Header.tsx      # Admin header
```

### State Management
- React Context for admin-wide state
- Local component state for UI interactions
- API state management with custom hooks
- Authentication state persistence

### API Integration
```typescript
// Admin API endpoints
const adminApi = {
  dashboard: '/api/admin/dashboard',
  calculator: '/api/admin/dashboard/calculator',
  users: '/api/admin/dashboard/users',
  analytics: '/api/admin/dashboard/analytics'
};
```

## 🔒 Security Features

### Authentication
- JWT token-based authentication
- Role-based route protection
- Session timeout handling
- Secure token storage

### Authorization
- Middleware-based permission checking
- Component-level access control
- API endpoint protection
- Audit logging for admin actions

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF token implementation

## 📱 Responsive Design

### Mobile Optimization
- Responsive admin interface
- Touch-friendly controls
- Collapsible navigation
- Optimized table views

### Desktop Features
- Multi-column layouts
- Keyboard shortcuts
- Drag-and-drop functionality
- Advanced filtering options

## 🚀 Deployment

### Build Configuration
```bash
# Build admin dashboard
npm run build:admin

# Environment variables
VITE_ADMIN_API_URL=https://api.pixeloria.com/admin
VITE_ADMIN_AUTH_TIMEOUT=3600000
```

### Production Considerations
- Separate admin subdomain (admin.pixeloria.com)
- Enhanced security headers
- Rate limiting for admin endpoints
- Monitoring and alerting

## 🧪 Testing

### Component Testing
- Unit tests for admin components
- Integration tests for workflows
- E2E tests for critical paths
- Accessibility testing

### Security Testing
- Authentication flow testing
- Authorization boundary testing
- Input validation testing
- Session management testing

## 📄 Usage Guidelines

### Getting Started
1. Login with admin credentials
2. Navigate to desired module
3. Use filters and search for data management
4. Export reports as needed
5. Configure system settings as required

### Best Practices
- Regular data backups
- Monitor system performance
- Review user permissions periodically
- Keep audit logs for compliance
- Update configurations as business needs change

## 📞 Support

For admin dashboard issues:
- Check user permissions first
- Verify API connectivity
- Review browser console for errors
- Contact: admin-support@pixeloria.com

---

**Legend:**
- ✅ Full Access
- 👁️ View Only  
- ❌ No Access
