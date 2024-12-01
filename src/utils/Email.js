const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user) {
    this._to = user.email;
    this._firstName = user.name.split(' ')[0];
    this._from = `Taha Tohami <${process.env.EMAIL_USERNAME}>`;
  }

  newTransport() {
    // Sendgrid
    return nodemailer.createTransport({
      service: 'yahoo',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // return nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST || '',
    //   //type casting here is a must
    //   port: Number(process.env.EMAIL_PORT),
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });
  }

  // Send the actual email
  async send(subject, message) {
    // 1) Render HTML based on a pug template

    // 2) Define email options
    const mailOptions = {
      from: this._from,
      to: this._to,
      subject,
      text: message,
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendConfirmation() {
    await this.send('Confirm Email', this._message);
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
};
