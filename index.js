const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');

// Initialize Secrets Manager
const secretsManager = new AWS.SecretsManager();

async function getSecret(secretName) {
  try {
    const secretValue = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    if ('SecretString' in secretValue) {
      return JSON.parse(secretValue.SecretString);
    }
    throw new Error('Secret not found in SecretString');
  } catch (error) {
    console.error('Error fetching secret:', error);
    throw error;
  }
}

exports.handler = async (event) => {
  try {
    // Create transporter
    // To Outlook
    /*const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'manoj@example.com',
        pass: 'password',
      },
    });*/

    // Get Gmail App Password from Secrets Manager
    const secretName = '/my-app/gmail-secrets';
    const secrets = await getSecret(secretName);
    const gmailAppPassword = secrets.gmailAppPassword;

    // To Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Gmail's SMTP service
      auth: {
        user: 'fancycrazelk@gmail.com', // Sender
        pass: gmailAppPassword,
      },
    });

    // Email options
    const mailOptions = {
      from: 'fancycrazelk@gmail.com',
      to: 'madushankamanoj414@gmail.com',
      subject: 'Monthly Reminder',
      text: 'This is your monthly email reminder!',
      html: '<p>This is your <strong>monthly email reminder</strong>!</p>',
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully!' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send email', error }),
    };
  }
};
