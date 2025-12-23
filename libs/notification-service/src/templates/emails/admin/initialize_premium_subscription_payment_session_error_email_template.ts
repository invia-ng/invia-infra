export const initialize_premium_subscription_payment_session_error_html_content = (
  error: any,
  errorMessage: string,
  userEmail: string,
  planId: string,
  paymentChannel: string,
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
    
    <style>
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
            padding: 20px;
            background-color: #fdfdfe;
        }

        .logo-container {
            text-align: center;
            padding: 20px 0;
        }

        .logo {
            width: 35px;
            height: 35px;
            display: inline-block;
        }

        h1 {
            font-family: 'Barlow', sans-serif;
            font-size: 26px;
            color: #dc3545;
            text-align: center;
            margin: 0;
        }
        
        .header {
            font-size: 22px;
            font-weight: bold;
        }

        p {
            font-family: 'Barlow', sans-serif;
            font-size: 18px;
            line-height: 27px;
            color: #1C3B4E;
            margin: 15px 0;
        }

        .info-box {
            background-color: #d1ecf1;
            border: 1px solid #bee5eb;
            color: #0c5460;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }

        .info-box strong {
            display: block;
            margin-bottom: 5px;
        }

        .error-box {
            background-color: #f8d7da;
            border: 1px solid #f5c2c7;
            color: #842029;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            word-wrap: break-word;
        }

        .error-details {
            background-color: #f8f9fa;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            font-family: monospace;
            font-size: 14px;
            overflow-x: auto;
        }

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
                    <img src="https://d3d4p0pie749ab.cloudfront.net/versions/small/0b4c8014-45af-4583-a201-371b64cc72ba.jpeg" 
                         alt="Logo" 
                         class="logo"
                         style="display: inline-block;">
                </div>
                
                <p><strong>Howdy Admin,</strong></p>
                <p>An error occurred while initializing a premium subscription payment session.</p>
                
                <div class="info-box">
                    <strong>User Email:</strong> ${userEmail}<br>
                    <strong>Plan ID:</strong> ${planId}<br>
                    <strong>Payment Channel:</strong> ${paymentChannel}<br>
                    <strong>Time:</strong> ${new Date().toLocaleString()}
                </div>

                <div class="error-box">
                    <strong>Error Message:</strong><br>
                    ${errorMessage}
                </div>

                <div class="error-details">
                    <strong>Full Error Details:</strong><br>
                    <pre>${JSON.stringify(error, null, 2)}</pre>
                </div>

                <p>Please investigate this issue as soon as possible.</p>
            </div>

            <div class="footer"> 
                <p>Livestocx Internal System Alert</p>
            </div>
        </div>
    </div>
</body>
</html>
`;
};
