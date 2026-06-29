const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const { firstNames, lastNames, specializations, cities, hospitals, universities } = require('./doctorData');

dotenv.config({ path: '../.env' });

// Setup DB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medica_ai')
  .then(() => console.log('MongoDB Connected for Seeder'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateDoctors = async (count = 30) => {
  try {
    console.log(`Starting to seed ${count} doctors...`);
    
    // Clear existing doctors to prevent duplicates on multiple runs
    await Doctor.deleteMany({});
    
    // We optionally delete doctor users, but to be safe we'll just delete users with role 'doctor'
    await User.deleteMany({ role: 'doctor' });
    console.log('Cleared existing doctors and doctor users.');

    const doctorsToInsert = [];

    for (let i = 0; i < count; i++) {
      const firstName = getRandom(firstNames);
      const lastName = getRandom(lastNames);
      const email = `doctor${i+1}_${firstName.toLowerCase()}@medica.ai`;
      
      // 1. Create User Account
      const user = await User.create({
        name: `Dr. ${firstName} ${lastName}`,
        email: email,
        password: 'password123', // Hardcoded default password for all seed doctors
        role: 'doctor',
        gender: getRandom(['Male', 'Female']),
        isEmailVerified: true
      });

      // 2. Prepare Doctor Profile Data
      const spec = getRandom(specializations);
      const city = getRandom(cities);
      
      const doctorProfile = {
        userId: user._id,
        pmdcNumber: `PMDC-${getRandomNum(10000, 99999)}-${i}-${getRandom(['P', 'S', 'B'])}`,
        specialization: spec,
        experience: getRandomNum(2, 30),
        consultationFee: getRandom([1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000]), // Round figures
        bio: `I am a highly experienced ${spec} practicing in ${city}. I specialize in diagnosing and treating complex cases and providing compassionate care.`,
        education: [{
          degree: 'MBBS',
          institution: getRandom(universities),
          year: `${getRandomNum(1990, 2020)}`
        }],
        hospitals: [{
          name: getRandom(hospitals),
          city: city
        }],
        languages: ['English', 'Urdu', getRandom(['Punjabi', 'Pashto', 'Sindhi'])],
        consultationType: getRandom(['Physical', 'Online', 'Both']),
        rating: (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1), // Random rating between 3.5 and 5.0
        reviewsCount: getRandomNum(5, 500),
        isVerified: true,
        profilePhoto: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random&size=256`, // Placeholder
        availability: [
          { day: 'Monday', startTime: '09:00', endTime: '17:00' },
          { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
          { day: 'Friday', startTime: '09:00', endTime: '13:00' }
        ]
      };

      doctorsToInsert.push(doctorProfile);
    }

    // 3. Bulk Insert Doctor Profiles
    await Doctor.insertMany(doctorsToInsert);

    console.log(`Successfully seeded ${count} doctors and their user accounts.`);
    console.log('Login Email Format: doctor1_name@medica.ai, Password: password123');
    process.exit(0);

  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

generateDoctors(30);
