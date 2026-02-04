export const update_business_email_html_content = (
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
            width: 100%;
            height: 100%;
            background-color: #FFFFFF;
            font-family: 'Barlow', sans-serif;
        }

        .wrapper {
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
        }

        .title {
            font-size: 16px;
            color: #1C3B4E;
            font-weight: bold;
            margin: 10px 0;
        }

        .message {
            font-size: 14px;
            line-height: 27px;
            color: #1C3B4E;
            margin: 15px 0;
        }

        .verification-code {
             background-color: #f8f9fa;
            padding: 10px;
            display: flex;
            width: fit-content;
            justify-content: center;
            margin: 15px auto;
        }

        .footer {
            padding: 20px;
            text-align: center;
        }

        .social-links {
            margin: 20px 0;
        }

        .social-links a {
            margin: 0 10px;
            text-decoration: none;
        }

        .social-links img {
            width: 24px;
            height: 24px;
        }

        /* Mobile responsiveness */
        @media only screen and (max-width: 600px) {
            .wrapper {
                padding: 0;
            }
            
            .container {
                border-radius: 0;
            }
            
            .content {
                padding: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="content">
                <div class="header">
                    <img src="https://res.cloudinary.com/dt0epuz7w/image/upload/v1766492310/versions/4df5bffe-0122-4dfa-a631-eef51574f623_invialogo.jpg"  
                         alt="Logo" 
                         class="logo">
                </div>
                
                <div class="message">
                    Hello ${name},<br><br>
                    We received a request to update your Invia business email. To proceed, verify your new email address with this activation code:
                </div>
                
                <div class="verification-code">
                    ${activationCode}
                </div>
                
                <div class="message">
                    This code is valid for the next 1 hour. Please enter it on the password verification page to authorize your request.
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;
};
