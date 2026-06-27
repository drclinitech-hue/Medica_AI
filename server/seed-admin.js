const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medica-ai');
    console.log('Connected to MongoDB');

    // Check if admin exists
    let admin = await User.findOne({ email: 'admin@medica.ai' });
    
    if (admin) {
      console.log('Admin user already exists!');
      process.exit();
    }

    // Create admin
    admin = await User.create({
      name: 'Super Admin',
      email: 'admin@medica.ai',
      password: 'password123',
      role: 'superadmin',
      isActive: true,
      isEmailVerified: true
    });

    console.log('Successfully created admin user:');
    console.log('Email: admin@medica.ai');
    console.log('Password: password123');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
