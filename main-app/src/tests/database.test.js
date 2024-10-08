// src/tests/database.test.js
if (typeof TextEncoder === 'undefined') {
    global.TextEncoder = require('util').TextEncoder;  // Using Node.js built-in TextEncoder
  }
  
  if (typeof TextDecoder === 'undefined') {
    global.TextDecoder = require('util').TextDecoder;  // Using Node.js built-in TextDecoder
  }
  
  const mongoose = require('mongoose');
  
  describe('Database Connection', () => {
    beforeAll(async () => {
      await mongoose.connect(process.env.MONGODB_URI);
    });
  
    afterAll(async () => {
      await mongoose.connection.close();
    });
  
    it('should connect to the database', () => {
      expect(mongoose.connection.readyState).toBe(1);
    });
  });
  