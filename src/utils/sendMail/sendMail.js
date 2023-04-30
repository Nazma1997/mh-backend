const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mhpremierstaffingsolutions@gmail.com',
    pass: 'iljnjnufnbcfknkf'
  }
});
module.exports.sendMailWithNodeMailer = async (data) => {
    const mailOptions = {
        from: 'mhpremierstaffingsolutions@gmail.com',
        to: data.to,
        subject: data.subject,
        html: data.html
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
            // console.log('Email sent: ' + info.response);
            return info.response;
        }
      });
}