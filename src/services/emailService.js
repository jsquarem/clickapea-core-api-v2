require('dotenv').config();
const sgMail = require('@sendgrid/mail');

const sendSignupEmail = async ({ firstName, email }) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email, // Change to your recipient
    from: 'clickapea@gmail.com', // Change to your verified sender
    templateId: 'd-94acc77d2cfb4f37a08edd94f12aac65',
    dynamicTemplateData: {
      first_name: firstName
    },
    asm: {
      group_id: 39975,
      groups_to_display: [39975]
    }
  };
  try {
    await sgMail.send(msg);
    console.log('Email sent');
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  sendSignupEmail
};
