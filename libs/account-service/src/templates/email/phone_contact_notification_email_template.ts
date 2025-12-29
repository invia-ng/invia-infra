export const phone_contact_notification_email_html_content = (
  downloadLink: string,
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
            font-size: 22px;
            color: #1C3B4E;
            font-weight: bold;
            margin: 10px 0;
        }

        .message {
            font-size: 18px;
            line-height: 27px;
            color: #1C3B4E;
            margin: 15px 0;
        }

        .verification-code {
            background-color: #036666;
            padding: 14px;
            display: flex;
            width: fit-content;
            justify-content: center;
            margin: 15px auto;
            border-radius: 10px;
        }
        
        .verification-code a {
          color: #ffffff;
          text-decoration: none;
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
                    <img src="https://d3d4p0pie749ab.cloudfront.net/versions/small/0b4c8014-45af-4583-a201-371b64cc72ba.jpeg"  
                         alt="Logo" 
                         class="logo">
                    <h1 class="title">Updated Bulk Phone Contacts</h1>
                </div>
                
                <div class="message">
                    Hello,<br><br>
                    Refer to the link below for the updated bulk phone contacts from the Livestocx platform using the link below.
                </div>
                
                <div class="verification-code">
                    <a href="${downloadLink}" target="_blank">Download here!</a>
                </div>
                
                </br>
                </br>
                </br>
            </div>
        </div>
    </div>
</body>
</html>
`;
};
