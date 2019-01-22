
const sgMail = require('@sendgrid/mail'); //sendgrid library to send emails 
//sendgrid api key
sgMail.setApiKey(process.env.API_KEY_SENDGRID);



const sendEmail = async (to, name, code) => {

    //Get Variables from query string in the search bar
    // const { recipient, sender, topic, text } = req.query; 
    console.log("mail about to send, sendgrid")
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
        `,

    }

    //Send Email
    const result = await sgMail.send(msg);
    console.log("result sendgrid"/*, result*/)

}




module.exports = sendEmail;