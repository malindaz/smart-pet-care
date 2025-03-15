const twilio = require('twilio');

// Create Twilio client
const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Format phone number to E.164
const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber.startsWith('+')) {
        // Add Sri Lanka country code if not present
        return phoneNumber.startsWith('0')
            ? '+94' + phoneNumber.substring(1)
            : '+94' + phoneNumber;
    }
    return phoneNumber;
};

// Send SMS function
const sendVerificationSMS = async (phoneNumber, code) => {
    try {
        const formattedNumber = formatPhoneNumber(phoneNumber);
        await client.messages.create({
            body: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: formattedNumber
        });
        return true;
    } catch (error) {
        console.error('SMS sending error:', error);
        return false;
    }
};

module.exports = {
    sendVerificationSMS
};