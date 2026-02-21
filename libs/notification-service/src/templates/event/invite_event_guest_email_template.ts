export const invite_event_guest_email_html_content = (payload: {
    image: string,
    event: string,
    message: string,
    acceptLink: string,
    rejectLink: string,
    webappUrl: string,
    businessName: string,
    hasCoverImage: boolean,
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
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            background-color: #f5f0eb;
            font-family: 'Barlow', sans-serif;
        }

        .wrapper {
            background-color: #f5f0eb;
            padding: 40px 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
        }

        /* === WITH COVER IMAGE layout === */
        .hero-image {
            width: 100%;
            max-height: 320px;
            object-fit: cover;
            display: block;
        }

        .body-content {
            padding: 24px 28px 32px;
        }

        .event-title-cover {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 26px;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0 0 20px 0;
            text-align: center;
        }

        .btn-accept {
            display: block;
            width: 100%;
            box-sizing: border-box;
            padding: 15px 0;
            background-color: #1a1a1a;
            color: #ffffff !important;
            text-align: center;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 700;
            font-size: 15px;
            margin-bottom: 12px;
        }

        .btn-reject {
            display: block;
            width: 100%;
            box-sizing: border-box;
            padding: 14px 0;
            background-color: #ffffff;
            color: #4a4a4a !important;
            text-align: center;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            font-size: 15px;
            border: 1px solid #e0e0e0;
            margin-bottom: 24px;
        }

        .message-text {
            font-size: 14px;
            color: #555555;
            line-height: 1.7;
            margin: 0 0 8px 0;
        }

        /* === WITHOUT COVER IMAGE layout === */
        .no-cover-content {
            padding: 28px 24px 32px;
            text-align: center;
        }

        .logo {
            width: 38px;
            height: 38px;
            border-radius: 8px;
        }

        .default-cover-image {
            width: 200px;
            margin: 12px auto;
        }

        .event-title-default {
            font-size: 18px;
            font-weight: 600;
            margin: 10px 0 6px 0;
            color: #1a1a1a;
        }

        .message-centered {
            font-size: 14px;
            color: #555;
            margin: 0 0 20px 0;
        }

        .no-cover-btn-accept {
            display: inline-block;
            padding: 12px 30px;
            background-color: #479FFD;
            color: #fff !important;
            border-radius: 10px;
            text-decoration: none;
            font-weight: bold;
            margin-bottom: 12px;
        }

        .no-cover-btn-reject {
            display: inline-block;
            padding: 12px 30px;
            background-color: #fff;
            color: #575554 !important;
            border-radius: 10px;
            text-decoration: none;
            font-weight: bold;
            border: 1px solid #E5E5E5;
        }

        /* === FOOTER === */
        .footer {
            margin-top: 30px;
            padding-top: 18px;
            text-align: center;
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
            .wrapper { padding: 0; }
            .container { border-radius: 0; }
            .body-content { padding: 16px 16px 24px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            ${payload.hasCoverImage ? `
            <!-- COVER IMAGE LAYOUT -->
            <img src="${payload.image}" alt="${payload.event}" class="hero-image"/>
            <div class="body-content">
                <h1 class="event-title-cover">${payload.event}</h1>

                <a href="${payload.acceptLink}" target="_blank" class="btn-accept">Accept Invitation</a>
                <a href="${payload.rejectLink}" target="_blank" class="btn-reject">Can't Attend</a>

                <p class="message-text">${payload.message}</p>

                <div class="footer">
                    <p class="footer-name">${payload.businessName}</p>
                    <a href="${payload.webappUrl}" target="_blank" class="footer-url">${payload.webappUrl.split("https://")[1]}</a>
                </div>
            </div>
            ` : `
            <!-- DEFAULT (NO COVER IMAGE) LAYOUT -->
            <div class="no-cover-content">
                <img src="https://res.cloudinary.com/dt0epuz7w/image/upload/v1766492310/versions/4df5bffe-0122-4dfa-a631-eef51574f623_invialogo.jpg"
                     alt="Logo" class="logo"/>
                <h1 class="event-title-default">Event Invitation</h1>
                <img src="https://res.cloudinary.com/dt0epuz7w/image/upload/v1767585910/invite-mail_feajcp.png"
                     alt="Event Image" class="default-cover-image"/>

                <h2 class="event-title-default">${payload.event}</h2>
                <p class="message-centered">${payload.message}</p>

                <a href="${payload.acceptLink}" target="_blank" class="no-cover-btn-accept">Accept Invitation</a>
                <br/><br/>
                <a href="${payload.rejectLink}" target="_blank" class="no-cover-btn-reject">Can't Attend</a>

                <div class="footer">
                    <p class="footer-name">${payload.businessName}</p>
                    <a href="${payload.webappUrl}" target="_blank" class="footer-url">${payload.webappUrl.split("https://")[1]}</a>
                </div>
            </div>
            `}
        </div>
    </div>
</body>
</html>
`;
};
