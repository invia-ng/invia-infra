export const event_guest_accept_reject_invitation_email_html_content = (payload: {
    image: string,
    event: string,
    message: string,
    isAccept: boolean,
    webappUrl: string,
    businessName: string,
    hasCoverImage: boolean,
}) => {
    const statusBadge = payload.isAccept
        ? `<div class="rsvp-badge rsvp-accepted">&#10003;&nbsp; RSVP confirmed!</div>`
        : `<div class="rsvp-badge rsvp-declined">&#10005;&nbsp; Can't Attend</div>`;

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
            font-family: 'Barlow', sans-serif;
        }

        /* === SHARED === */
        .wrapper {
            background-color: #ffffff;
            padding: 40px 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }

        .event-title {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 24px;
            font-weight: 700;
            color: #1a1a1a;
            margin: 20px 0 16px 0;
            text-align: center;
        }

        /* RSVP status badge */
        .rsvp-badge {
            display: block;
            width: 100%;
            box-sizing: border-box;
            padding: 13px 0;
            text-align: center;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 24px;
        }

        .rsvp-accepted {
            color: #27a96b;
            border: 1.5px dashed #27a96b;
            background-color: #f0fdf6;
        }

        .rsvp-declined {
            color: #e05252;
            border: 1.5px dashed #e05252;
            background-color: #fff5f5;
        }

        .message-text {
            font-size: 14px;
            color: #555555;
            line-height: 1.75;
            margin: 0 0 10px 0;
        }

        /* === WITH COVER IMAGE === */
        .cover-wrapper {
            background-color: #f5f0eb;
            padding: 40px 0;
        }

        .cover-container {
            max-width: 600px;
            margin: 0 auto;
        }

        .cover-image {
            display: block;
            width: 320px;
            height: 240px;
            object-fit: cover;
            border-radius: 14px;
            margin: 0 auto 0 auto;
        }

        .cover-body {
            padding: 20px 40px 36px;
        }

        /* === WITHOUT COVER IMAGE === */
        .no-cover-body {
            padding: 36px 40px 36px;
            text-align: center;
        }

        .envelope-icon {
            width: 80px;
            height: auto;
            margin-bottom: 4px;
        }

        /* === FOOTER === */
        .footer {
            margin-top: 32px;
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
            .cover-body, .no-cover-body { padding: 16px 20px 28px; }
            .cover-image { width: 90%; height: 200px; }
        }
    </style>
</head>
<body>
    ${payload.hasCoverImage ? `
    <!-- COVER IMAGE LAYOUT -->
    <div class="cover-wrapper">
        <div class="cover-container">
            <img src="${payload.image}" alt="${payload.event}" class="cover-image"/>
            <div class="cover-body">
                <h1 class="event-title">${payload.event}</h1>
                ${statusBadge}
                <p class="message-text">${payload.message}</p>
                <div class="footer">
                    <p class="footer-name">${payload.businessName}</p>
                    <a href="${payload.webappUrl}" target="_blank" class="footer-url">${payload.webappUrl.split("https://")[1]}</a>
                </div>
            </div>
        </div>
    </div>
    ` : `
    <!-- NO COVER IMAGE LAYOUT -->
    <div class="wrapper">
        <div class="container">
            <div class="no-cover-body">
                <img src="https://res.cloudinary.com/dt0epuz7w/image/upload/v1767585910/invite-mail_feajcp.png"
                     alt="Invitation" class="envelope-icon"/>
                <h1 class="event-title">${payload.event}</h1>
                ${statusBadge}
                <p class="message-text" style="text-align:left;">${payload.message}</p>
                <div class="footer">
                    <p class="footer-name">${payload.businessName}</p>
                    <a href="${payload.webappUrl}" target="_blank" class="footer-url">${payload.webappUrl.split("https://")[1]}</a>
                </div>
            </div>
        </div>
    </div>
    `}
</body>
</html>
`;
};
