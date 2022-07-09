const nodemailer = require('nodemailer')

const sendEmail = async options => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  // Define the email options
  const mailOptions = {
    from: 'Duc Duy <ducduy0209.work@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  }

  // Send email to client
  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
