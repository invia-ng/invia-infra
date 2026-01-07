export const invite_business_member_email_html_content = (payload:{
  businessName: string,
  activationLink: string,
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

        .cta-button {
            display: inline-block;
            padding: 12px 24px;
            margin: 20px auto;
            background-color: #1C3B4E;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: bold;
        }

        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }

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
                    <img
                        src="https://res.cloudinary.com/dt0epuz7w/image/upload/v1766492310/versions/4df5bffe-0122-4dfa-a631-eef51574f623_invialogo.jpg"
                        alt="Invia Logo"
                        class="logo"
                    />
                    <h1 class="title">You’ve Been Invited</h1>
                </div>

                <div class="message">
                    Hello,<br><br>
                    You’ve been invited to manage a business(${payload.businessName}) on <strong>Invia</strong>.
                    This invitation gives you access to manage business operations, listings, and related activities.
                </div>

                <div style="text-align: center;">
                    <a href="${payload.activationLink}" class="cta-button">
                        Accept Invitation
                    </a>
                </div>

                <div class="message">
                    If you are not interested in this invitation, you can safely ignore this email.
                </div>
            </div>

            <div class="footer">
                © Invia. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>
`;
};
