// OTP Generation and SMS utilities

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (mobile, otp) => {
  // Integrate with Fast2SMS or MSG91
  console.log(`📱 Sending OTP ${otp} to ${mobile}`);
  
  // Example Fast2SMS integration (uncomment when you have API key):
  /*
  const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
    method: 'POST',
    headers: {
      'authorization': process.env.FAST2SMS_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      route: 'v3',
      sender_id: 'FUELRWD',
      message: `Your FuelRewards OTP is ${otp}. Valid for 5 minutes.`,
      language: 'english',
      flash: 0,
      numbers: mobile
    })
  });
  
  const data = await response.json();
  return data.return === true;
  */
  
  return true;
};

module.exports = {
  generateOTP,
  sendOTP
};