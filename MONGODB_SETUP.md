# MongoDB Setup Guide for SendIT

This guide will help you set up MongoDB for your SendIT parcel delivery tracking application.

## 🍃 **MongoDB Atlas Setup (Recommended)**

### **Step 1: Create MongoDB Atlas Account**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" and create an account
3. Choose "Build a new app" when prompted

### **Step 2: Create a Cluster**
1. **Choose Cloud Provider**: AWS, Google Cloud, or Azure
2. **Select Region**: Choose closest to your location
3. **Cluster Tier**: Select M0 (Free) for development
4. **Cluster Name**: `SendIT-Damola-Learningtool` (or your choice)
5. Click "Create Cluster"

### **Step 3: Configure Database Access**
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. **Authentication Method**: Password
4. **Username**: `User_1` (or your choice)
5. **Password**: Generate a secure password (save it!)
6. **Database User Privileges**: Read and write to any database
7. Click "Add User"

### **Step 4: Configure Network Access**
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. **Access List Entry**: 
   - For development: Click "Add Current IP Address"
   - For production: Add your server's IP addresses
   - For testing: Add `0.0.0.0/0` (allows all IPs - use with caution)
4. Click "Confirm"

### **Step 5: Get Connection String**
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. Copy the connection string

### **Step 6: Update Environment Variables**
Edit your `.env` file:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://sendit-user:YOUR_PASSWORD@sendit-cluster.xxxxx.mongodb.net/sendit_db?retryWrites=true&w=majority
MONGODB_DATABASE=sendit_db
```


**Replace:**
- `sendit-user` with your database username
- `YOUR_PASSWORD` with your database password
- `sendit-cluster.xxxxx.mongodb.net` with your actual cluster URL
- `sendit_db` with your preferred database name

## 🔧 **Local MongoDB Setup (Alternative)**

If you prefer to run MongoDB locally:

### **Install MongoDB**
```bash
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community
```

### **Update Environment Variables**
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/sendit_db
MONGODB_DATABASE=sendit_db
```

## 📊 **Database Collections**

The application will automatically create these collections:

### **Users Collection**
- Stores user accounts and authentication data
- Indexes: email, role, createdAt

### **Parcels Collection**
- Stores parcel information
- Indexes: userId, weight, createdAt

### **Orders Collection**
- Stores delivery orders and tracking data
- Indexes: userId, status, trackingNumber, createdAt

## 🚀 **Testing the Connection**

1. **Start the application:**
   ```bash
   npm start
   ```

2. **Check the logs:**
   - ✅ `MongoDB connected successfully` - Connection working
   - ❌ `Failed to connect to MongoDB` - Check your connection string

3. **Test with API:**
   ```bash
   # Register a user (creates first document)
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "Test",
       "lastName": "User",
       "email": "test@example.com",
       "phone": "+1234567890",
       "password": "password123"
     }'
   ```

## 🔍 **MongoDB Atlas Dashboard**

Once connected, you can monitor your database:

1. **Collections**: View your data in real-time
2. **Performance**: Monitor query performance
3. **Logs**: View database logs
4. **Metrics**: Track usage and performance

## 🛠️ **Production Considerations**

### **Security**
- Use strong passwords
- Restrict IP access to your servers only
- Enable MongoDB Atlas security features
- Use connection string with SSL

### **Performance**
- Create appropriate indexes
- Monitor slow queries
- Use connection pooling
- Set up monitoring alerts

### **Backup**
- Enable automatic backups
- Test restore procedures
- Document backup schedules

## 🆘 **Troubleshooting**

### **Connection Issues**
- Check your connection string format
- Verify IP address is whitelisted
- Confirm username/password are correct
- Check network connectivity

### **Authentication Errors**
- Verify database user has correct permissions
- Check if user exists in Atlas
- Confirm password is correct

### **Performance Issues**
- Check query performance in Atlas
- Review index usage
- Monitor connection pool usage

## 📚 **Useful Commands**

### **Check Connection Status**
```bash
curl http://localhost:3000/health
```

### **View Database Logs**
```bash
# In MongoDB Atlas dashboard
# Go to Database > Logs
```

### **Test Database Operations**
```bash
# Create a test order
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"parcelId": "PARCEL_ID", "pickupLocation": {...}, "destinationLocation": {...}}'
```

---

**Your SendIT application is now ready with MongoDB! 🚀**
