const db = require('../config/database');

const sendNotification = async (userId, message, type = 'general') => {
  try {
    // Store notification in database
    await db.query(
      'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
      [userId, message, type]
    );

    // Get user mobile for SMS
    const [users] = await db.query('SELECT mobile FROM users WHERE id = ?', [userId]);
    
    if (users.length > 0) {
      // Send SMS (integrate with Fast2SMS)
      console.log(`📱 SMS to ${users[0].mobile}: ${message}`);
      
      // Example Fast2SMS integration (uncomment when you have API key):
      /*
      await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'v3',
          sender_id: 'FUELRWD',
          message: message,
          language: 'english',
          flash: 0,
          numbers: users[0].mobile
        })
      });
      */
    }

    return true;
  } catch (error) {
    console.error('Send notification error:', error);
    return false;
  }
};

module.exports = {
  sendNotification
};