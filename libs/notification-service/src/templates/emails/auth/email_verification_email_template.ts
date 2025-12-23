export const email_verification_html_content = (
  name: string,
  activationCode: string,
) => {
  return `
    <!DOCTYPE html>
  <html dir="ltr" lang="en">
  <head>
      <meta charset="UTF-8">
      <meta content="width=device-width, initial-scale=1" name="viewport">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta content="telephone=no" name="format-detection">
      <link href="https://fonts.googleapis.com/css2?family=Barlow&display=swap" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
      
      <style>
          /* Base styles */
          body {
              margin: 0;
              padding: 0;
              background-color: #FFFFFF;
              font-family: 'Barlow', sans-serif;
          }
  
          .wrapper {
              width: 100%;
              background-color: #efefef;
              padding: 50px 0;
          }
  
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 15px;
          }
  
          .content {
              font-size: 14px;
              padding: 20px;
              background-color: #fdfdfe;
          }
  
          /* Header */
          .logo-container {
              text-align: center;
              padding: 20px 0;
          }
  
          .logo {
              width: 35px;
              height: 35px;
              display: inline-block;
          }
  
          /* Typography */
          h1 {
              font-family: 'Barlow', sans-serif;
              font-size: 26px;
              color: #1C3B4E;
              text-align: center;
              margin: 0;
          }
          
          .header {
              font-size: 18px;
              font-weight: bold;
          }
  
          p {
              font-family: 'Barlow', sans-serif;
              font-size: 18px;
              line-height: 27px;
              color: #1C3B4E;
              margin: 15px 0;
          }
  
          /* Verification code */
          .verification-code {
              background-color: #f8f9fa;
              padding: 10px;
              display: flex;
              width: fit-content;
              justify-content: center;
              margin: 15px auto;
          }

          .otp-code {
              background-color: #f8f9fa;
              padding: 10px 4px;
              margin: 15px auto;
              width: fit-content;
              font-weight: bold;
          }
  
          /* Footer */
          .footer {
              font-size: 12px;
              padding: 20px;
              text-align: center;
          }
  
          .social-links {
              text-align: center;
              padding: 20px 0;
          }
  
          .social-links a {
              display: inline-block;
              margin: 0 10px;
              text-decoration: none;
          }
  
          /* Media Queries */
          @media only screen and (max-width: 600px) {
              .container {
                  width: 100%;
                  border-radius: 0;
              }
              
              .wrapper {
                  padding: 0;
              }
          }
      </style>
  </head>
  <body>
      <div class="wrapper">
          <div class="container">
              <div class="content">
                  <div class="logo-container">
                      <img src="https://i.ibb.co/TDqM25qn/invia.jpg" 
                           alt="Logo" 
                           class="logo"
                           style="display: inline-block;">
                  </div>
                  
                  <h1 class="header">Email Verification</h1>
                  
                  <p>Hello ${name},</p>
                  <p>Thank you for signing up with Invia! To complete your registration, we need to verify your email address.</p>
                  
                  <p>Here is your verification code (OTP):</p>
                  <div class="otp-code">
                    ${activationCode}
                  </div>
                  
                  <p>This code is valid for the next 1 hour. Please enter it on the verification page to confirm your email address.</p>
              </div>
  
              
          </div>
      </div>
  </body>
</html>
`;
};
