export const welcome_customer_email_html_content = (name: string) => {
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
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: 100%;
      height: 100%;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      background-color: #FFFFFF;
      font-family: 'Barlow', sans-serif;
      color: #1C3B4E;
    }

    .wrapper {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }

    .content {
      padding: 20px;
      background-color: #fdfdfe;
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
    }

    .logo {
      width: 35px;
      height: 35px;
      margin: 0 auto;
      display: block;
    }

    .welcome-title {
      font-size: 22px;
      line-height: 55.2px;
      font-weight: bold;
      margin: 10px 0;
    }

    .message {
      font-size: 18px;
      line-height: 27px;
      margin: 15px 0;
    }

    .benefits-list {
      padding-left: 40px;
      margin: 15px 0;
    }

    .benefits-list li {
      margin-bottom: 15px;
      font-size: 18px;
      line-height: 27px;
    }

    .footer {
      background-color: #ffffff;
      padding-bottom: 20px;
      text-align: center;
      border-bottom-left-radius: 15px;
      border-bottom-right-radius: 15px;
    }

    .social-links {
      margin: 20px 0;
    }

    .social-links a {
      margin: 0 10px;
      display: inline-block;
    }

    .social-links img {
      width: 24px;
      height: 24px;
    }

    .contact-info {
      font-size: 14px;
      line-height: 21px;
      margin: 10px 0;
    }

    .contact-info a {
      color: #4895ef;
      text-decoration: none;
    }

    .privacy-link {
      color: #1C3B4E;
      text-decoration: none;
      font-weight: bold;
    }

    @media only screen and (max-width: 600px) {
      .wrapper {
        width: 100%;
      }
      
      .content {
        padding: 15px;
      }
      
      .welcome-title {
        font-size: 22px;
        line-height: 40px;
      }
      
      .message {
        font-size: 16px;
        line-height: 24px;
      }
      
      .benefits-list li {
        font-size: 16px;
        line-height: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="content">
      <div class="header">
        <img src="https://i.ibb.co/TDqM25qn/invia.jpg" alt="Logo" class="logo">
        <h1 class="welcome-title">Welcome</h1>
      </div>
      
      <div class="message">
        Hello ${name},
        <br><br>
        Welcome to Invia! We're thrilled to have you join our community where we make event planning simple. <strong>With Invia, you can:</strong>
      </div>
      
      <ul class="benefits-list">
        <li>Connect with verified vendors tailored to your event needs.</li>
        <li>Plan, schedule, and coordinate event services seamlessly.</li>
        <li>Manage all event bookings, vendors, and timelines in one place.</li>
      </ul>
      
      <div class="message">
        We’re here to make your event planning process seamless and rewarding. Together, let’s build a stronger future.
        <br><br>
        Warm regards,
        <br>
        Team Invia.
      </div>
    </div>
    
  </div>
</body>
</html>
`;
};
