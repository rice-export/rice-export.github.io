const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/oriza';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✓ MongoDB Connected Successfully');
  } catch (error) {
    console.error('✗ MongoDB Connection Error:', error.message);
    
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

// Connection Event Listeners
mongoose.connection.on('disconnected', () => {
  console.warn('⚠ MongoDB Disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (error) => {
  console.error('✗ MongoDB Error:', error);
});

module.exports = { connectDB };
