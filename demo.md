# SendIT Demo Guide

This guide will walk you through testing the SendIT parcel delivery tracking application.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   - Frontend: http://localhost:3000
   - API Health: http://localhost:3000/health

## 🧪 Testing the Application

### 1. User Registration and Login

1. **Open the application** in your browser
2. **Click "Register"** to create a new account
3. **Fill in the registration form:**
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Phone: +1234567890
   - Password: password123
4. **Click "Register"** - you should see a success message
5. **You're now logged in!** Notice the navigation changes

### 2. Creating a Parcel

1. **Click "Create Order"** in the navigation
2. **Fill in the parcel details:**
   - Description: "Electronics - Laptop"
   - Weight: 2.5 kg
   - Value: $1200
   - Dimensions: Length: 40cm, Width: 30cm, Height: 5cm
   - Check "Fragile item"
3. **Add addresses:**
   - Pickup: "123 Main St, New York, NY 10001"
   - Destination: "456 Oak Ave, Los Angeles, CA 90210"
4. **Click "Create Order"** - you should see a success message

### 3. Tracking Orders

1. **Click "My Orders"** to see your orders
2. **Copy the tracking number** from your order
3. **Click "Track"** in the navigation
4. **Paste the tracking number** and click "Track Package"
5. **View the order details** and status

### 4. Admin Features (Simulated)

Since we don't have a real admin interface, you can test admin features using the API directly:

```bash
# Get all orders (requires admin token)
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     http://localhost:3000/api/admin/orders

# Update order status (requires admin token)
curl -X PUT \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"status": "in_transit"}' \
     http://localhost:3000/api/admin/orders/ORDER_ID/status
```

## 🔧 API Testing with Postman/curl

### Authentication
```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "Jane",
       "lastName": "Smith",
       "email": "jane@example.com",
       "phone": "+1234567890",
       "password": "password123"
     }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "jane@example.com",
       "password": "password123"
     }'
```

### Parcel Management
```bash
# Create a parcel (replace TOKEN with actual JWT token)
curl -X POST http://localhost:3000/api/parcels \
     -H "Authorization: Bearer TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "description": "Books",
       "weight": 1.5,
       "dimensions": {"length": 25, "width": 20, "height": 3},
       "value": 25.00,
       "fragile": false
     }'
```

### Order Management
```bash
# Create an order
curl -X POST http://localhost:3000/api/orders \
     -H "Authorization: Bearer TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "parcelId": "PARCEL_ID",
       "pickupLocation": {
         "address": "123 Main St, New York, NY",
         "latitude": 40.7128,
         "longitude": -74.0060,
         "city": "New York",
         "state": "NY",
         "country": "USA",
         "postalCode": "10001"
       },
       "destinationLocation": {
         "address": "456 Oak Ave, Los Angeles, CA",
         "latitude": 34.0522,
         "longitude": -118.2437,
         "city": "Los Angeles",
         "state": "CA",
         "country": "USA",
         "postalCode": "90210"
       }
     }'
```

## 🎯 Key Features to Test

### ✅ User Features
- [ ] User registration and login
- [ ] Create and manage parcels
- [ ] Create delivery orders
- [ ] Track orders by tracking number
- [ ] Update order destinations
- [ ] Cancel orders
- [ ] View order history

### ✅ Admin Features (API only)
- [ ] View all orders
- [ ] Update order status
- [ ] Update order location
- [ ] View order statistics
- [ ] Manage users

### ✅ Technical Features
- [ ] Responsive design (test on mobile)
- [ ] Form validation
- [ ] Error handling
- [ ] Loading states
- [ ] Toast notifications

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot find module" errors:**
   - Run `npm install` to install dependencies
   - Make sure you're in the project directory

2. **"Port 3000 already in use":**
   - Change the port in your `.env` file
   - Or kill the process using port 3000

3. **"Build failed":**
   - Check that TypeScript is installed: `npm install -g typescript`
   - Run `npm run clean && npm run build`

4. **"API requests failing":**
   - Make sure the server is running: `npm start`
   - Check the browser console for errors
   - Verify the API endpoint URLs

### Debug Mode

To enable debug logging, set in your `.env` file:
```env
NODE_ENV=development
DEBUG=true
```

## 📱 Mobile Testing

1. **Open the application on your phone**
2. **Test the responsive design:**
   - Navigation menu should collapse on mobile
   - Forms should be touch-friendly
   - Text should be readable without zooming

## 🔍 Code Exploration

### Key Files to Examine

1. **`src/types/index.ts`** - All TypeScript interfaces
2. **`src/models/User.ts`** - User management logic
3. **`src/models/Order.ts`** - Order management logic
4. **`src/controllers/AuthController.ts`** - Authentication endpoints
5. **`src/services/EmailService.ts`** - Email notification system
6. **`js/app.js`** - Frontend JavaScript logic
7. **`css/styles.css`** - Styling and responsive design

### Architecture Highlights

- **TypeScript**: Full type safety throughout the application
- **MVC Pattern**: Clear separation of concerns
- **RESTful API**: Standard HTTP methods and status codes
- **JWT Authentication**: Secure token-based authentication
- **Responsive Design**: Mobile-first CSS approach
- **Error Handling**: Comprehensive error handling and user feedback

## 🚀 Next Steps

After testing the basic functionality, consider:

1. **Adding a real database** (PostgreSQL, MongoDB)
2. **Implementing real email notifications**
3. **Adding Google Maps integration**
4. **Creating unit tests**
5. **Adding API documentation**
6. **Implementing real-time updates with WebSockets**

---

**Happy Testing! 🎉**
