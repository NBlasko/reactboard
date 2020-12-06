/*  sendgrid library to send emails  */
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.API_KEY_SENDGRID);

/**
 *
 * @param {String} to
 * @param {String} name
 * @param {Number} code
 */
const sendEmail = async (to, name, code) => {
  try {
    console.log("Sending mail is currently disabled, access code is", code);
    return;
    console.log("mail about to send, sendgrid");
    //Sendgrid Data Requirements
    const msg = {
      to,
      from: "Onlinereactboard@reactboard.com",
      subject: "Verification code",
      html: `<h2 style = "color: black;"> Dear ${name},  </h2>
        <p style = "color: black;"> Thank you for using React Board. If you haven't done so already,
         please verify your email by typing 5-digit verification code on
        <span>  https://localhost:3000/ <span> </p>
        <p style = "color: black;"> Once you verify you can begin writing stories on React Board. </p> 
        <p style = "color: black;"> Your verification code is <span style = "color: red; font-size:20px;"> ${code} <span> </p>
        <p style = "color: black;"> The code is valid for 10 minutes </p>    
        `
    };

    //Send Email
    const result = await sgMail.send(msg);
    // console.log("result sendgrid", result)
  } catch (err) {
    console.log("Greska u slanju, potrebno je hendlati");
  }
};

module.exports = sendEmail;
