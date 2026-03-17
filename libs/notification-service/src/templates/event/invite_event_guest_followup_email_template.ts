export const invite_event_guest_followup_email_html_content = (payload: {
    event: string,
    message: string,
    openLink: string,
    webappUrl: string,
    businessName: string,
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
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            background-color: #ffffff;
            font-family: 'Barlow', sans-serif;
        }

        .wrapper {
            background-color: #ffffff;
            padding: 40px 24px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            text-align: center;
        }

        /* === EVENT TITLE === */
        .event-title {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 32px;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0 0 20px 0;
            line-height: 1.25;
        }

        /* === MESSAGE === */
        .message-text {
            font-size: 16px;
            color: #555555;
            line-height: 1.75;
            margin: 0 0 36px 0;
            text-align: center;
        }

        /* === CTA BUTTON === */
        .btn-open {
            display: block;
            width: 100%;
            box-sizing: border-box;
            padding: 18px 0;
            background-color: #1a1a1a;
            color: #ffffff !important;
            text-align: center;
            border-radius: 14px;
            text-decoration: none;
            font-weight: 600;
            font-size: 17px;
            margin-bottom: 40px;
            letter-spacing: 0.01em;
        }

        /* === FOOTER === */
        .footer {
            padding-top: 24px;
            border-top: 1px solid #e8e8e8;
        }

        .footer-name {
            margin: 0 0 4px 0;
            font-weight: 700;
            font-size: 14px;
            color: #1a1a1a;
        }

        .footer-url {
            font-size: 13px;
            color: #888888;
            text-decoration: none;
        }

        @media only screen and (max-width: 600px) {
            .wrapper { padding: 24px 16px; }
            .event-title { font-size: 26px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">

            <h1 class="event-title">${payload.event}</h1>

            <p class="message-text">${payload.message}</p>

            <a href="${payload.openLink}" target="_blank" class="btn-open">Open message</a>

            <div class="footer">
                <p class="footer-name">${payload.businessName}</p>
                <a href="${payload.webappUrl}" target="_blank" class="footer-url">${payload.webappUrl.split("https://")[1]}</a>
            </div>
        </div>
    </div>
</body>
</html>
`;
};
