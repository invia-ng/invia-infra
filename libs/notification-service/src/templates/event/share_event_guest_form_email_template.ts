export const share_event_guest_form_email_html_content = (payload: {
    passcode: string,
    shareFormLink: string,
}) => {
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
              font-size: 24px;
              letter-spacing: 2px;
              text-align: center;
          }

          .action-button {
              display: block;
              width: fit-content;
              margin: 20px auto;
              padding: 12px 24px;
              background-color: #1C3B4E;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              text-align: center;
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
                      <img src="https://res.cloudinary.com/dt0epuz7w/image/upload/v1766492310/versions/4df5bffe-0122-4dfa-a631-eef51574f623_invialogo.jpg" 
                           alt="Logo" 
                           class="logo"
                           style="display: inline-block;">
                  </div>
                  
                  <!-- <h1 class="header">Event Access Granted</h1> -->
                  
                  <p>Hello,</p>
                  <p>You have been given access to update permissions for an event on Invia.</p>
                  
                  <p>Please use the following passcode to access the event management form:</p>
                  <div class="otp-code">
                    ${payload.passcode}
                  </div>
                  
                  <p>Click the button below to access the form:</p>
                  <a href="${payload.shareFormLink}" class="action-button" style="color: #ffffff;">Access Event Form</a>

                  <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                  <p style="word-break: break-all; font-size: 14px;"><a href="${payload.shareFormLink}">${payload.shareFormLink}</a></p>
              </div>
  
              
          </div>
      </div>
  </body>
</html>
`;
};
