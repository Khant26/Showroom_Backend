const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carshowroom_new');
    console.log('MongoDB Connected for admin creation...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Create permanent admin account
const createAdmin = async () => {
  try {
    console.log('🔧 Creating permanent admin account...');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@carshowroom.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'YourSecurePassword@2024#Change';
    
    // Delete existing admin if exists
    await User.findOneAndDelete({ email: adminEmail, role: 'admin' });
    console.log('🗑️ Deleted existing admin account if it existed');

    // Create new admin user
    const adminUser = new User({
      name: 'Admin User',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    
    console.log('✅ Permanent admin account created successfully!');
    console.log('\n🔑 Admin Login Credentials:');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\n⚠️  Please use these exact credentials to login to the admin panel');
    
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await createAdmin();
  await mongoose.connection.close();
  console.log('\n📡 Database connection closed');
  process.exit(0);
};

// Run the script
main().catch(console.error);