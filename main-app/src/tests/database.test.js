require('dotenv').config();  // Make sure this is at the top
console.log(process.env.MONGODB_URI);

if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;  // Using Node.js built-in TextEncoder
}

if (typeof TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;  // Using Node.js built-in TextDecoder
}

const mongoose = require('mongoose');

describe('Database Connection', () => {
  beforeAll(async () => {
    console.log('Connecting to MongoDB URI:', process.env.MONGODB_URI);  // Log to check URI
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (error) {
      console.error('Error connecting to the database', error);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should connect to the database', () => {
    expect(mongoose.connection.readyState).toBe(1);  // 1 means connected
  });
});
