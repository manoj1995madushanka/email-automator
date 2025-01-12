const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

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

    // Get current date and month
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US');
    const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
    const year = currentDate.getFullYear();

    // Load the template PDF
    const templatePdfBytes = fs.readFileSync('/template.pdf'); // Replace with the actual path
    const pdfDoc = await PDFDocument.load(templatePdfBytes);

    // Get the first page of the PDF
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Replace text (adjust according to template)
    // coordinate start at left bottom corner
    firstPage.drawText(formattedDate, { x: 100, y: 500, size: 12 });
    firstPage.drawText(`month of ${currentMonth}`, { x: 100, y: 480, size: 12 });

    // Save the modified PDF
    const fileName = `Invoice-${currentMonth}-2025-Manoj-Madushanka.pdf`;
    const modifiedPdfBytes = await pdfDoc.save();

    const bodyContent = `Hi,
      Please find the attached Invoice for the month of ${currentMonth} ${year}.
      Best Regards,
      Manoj Madushanka.`;

    // Email options
    const mailOptions = {
      from: 'fancycrazelk@gmail.com',
      to: 'madushankamanoj414@gmail.com',
      subject: 'Invoice-January-2025-Manoj-Madushanka',
      text: bodyContent,
      html:`<p>${bodyContent}</p>`,
      attachments: [
        {
          filename: fileName, // File name to display in the email
          content: modifiedPdfBytes, // File content as a buffer
        },
      ],
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
