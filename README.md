# SendIT - Parcel Delivery Tracking System

A comprehensive TypeScript web application for tracking parcel deliveries with real-time updates, Google Maps integration, and email notifications.

## 🚀 Features

### User Features
- **User Authentication**: Secure login and registration system
- **Parcel Management**: Create and manage parcel information
- **Order Creation**: Create delivery orders with pickup and destination locations
- **Order Tracking**: Track orders using tracking numbers
- **Order Management**: Update destinations and cancel orders
- **Real-time Updates**: Email notifications for status and location changes

### Admin Features
- **Order Management**: Update order status and current location
- **User Management**: View and manage all users
- **Analytics**: Order statistics and revenue tracking
- **Bulk Operations**: Manage multiple orders efficiently

### Technical Features
- **Google Maps Integration**: Distance calculation and geocoding
- **Email Notifications**: Automated status and location updates
- **Responsive Design**: Mobile-first approach
- **TypeScript**: Full type safety and better development experience
- **Modern UI**: Clean, professional interface with smooth animations

## 🛠️ Technology Stack

### Backend
- **Node.js** with **Express.js** - Web server framework
- **TypeScript** - Type-safe JavaScript
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **nodemailer** - Email sending
- **Google Maps API** - Distance calculation and geocoding

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Font Awesome** - Icons
- **Google Fonts** - Typography

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Maps API key (optional, for full functionality)
- SMTP email service (optional, for email notifications)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SendIT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key
   GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   SMTP_HOST=smtp.gmail.com
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

4. **Build the application**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api
   - Health Check: http://localhost:3000/health

## 🚀 Development

### Development Mode
```bash
# Watch mode for TypeScript compilation
npm run dev

# In another terminal, serve the frontend
npm run serve
```

### Project Structure
```
SendIT/
├── src/
│   ├── controllers/     # API route handlers
│   ├── middleware/      # Authentication and validation
│   ├── models/         # Data models and business logic
│   ├── routes/         # API route definitions
│   ├── services/       # External service integrations
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── app.ts          # Express app configuration
│   └── index.ts        # Server entry point
├── css/                # Stylesheets
├── js/                 # Frontend JavaScript
├── public/             # Static assets
├── dist/              # Compiled JavaScript
└── package.json       # Dependencies and scripts
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh` - Refresh JWT token

### Parcel Endpoints
- `POST /api/parcels` - Create parcel
- `GET /api/parcels` - Get user's parcels
- `GET /api/parcels/:id` - Get specific parcel
- `PUT /api/parcels/:id` - Update parcel
- `DELETE /api/parcels/:id` - Delete parcel

### Order Endpoints
- `POST /api/orders` - Create delivery order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get specific order
- `GET /api/orders/track/:trackingNumber` - Track order (public)
- `PUT /api/orders/:id/destination` - Update order destination
- `PUT /api/orders/:id/cancel` - Cancel order

### Admin Endpoints
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `PUT /api/admin/orders/:id/location` - Update order location
- `GET /api/admin/stats` - Get order statistics
- `GET /api/admin/users` - Get all users

## 🔧 Configuration

### Google Maps Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
   - Distance Matrix API
4. Create credentials (API Key)
5. Add the API key to your `.env` file

### Email Configuration
For Gmail:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use your Gmail address and app password in `.env`

For other providers, update the SMTP settings accordingly.

## 🎨 Customization

### Styling
- Modify `css/styles.css` for custom styling
- CSS variables are defined at the top for easy theming
- Responsive design with mobile-first approach

### Business Logic
- Update pricing in `src/models/Order.ts`
- Modify weight categories in `src/types/index.ts`
- Customize email templates in `src/services/EmailService.ts`

## 🚀 Deployment

### Production Considerations
1. **Environment Variables**: Set all required environment variables
2. **Database**: Replace in-memory storage with a real database (PostgreSQL, MongoDB)
3. **Security**: Use strong JWT secrets and HTTPS
4. **Monitoring**: Add logging and error tracking
5. **Scaling**: Consider using Redis for session storage

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed description
3. Include steps to reproduce the problem

## 🔮 Future Enhancements

- [ ] Real-time tracking with WebSockets
- [ ] Mobile app (React Native/Flutter)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Payment integration
- [ ] Driver mobile app
- [ ] Route optimization
- [ ] Push notifications
- [ ] API rate limiting
- [ ] Comprehensive testing suite

---

**Happy Coding! 🚀**