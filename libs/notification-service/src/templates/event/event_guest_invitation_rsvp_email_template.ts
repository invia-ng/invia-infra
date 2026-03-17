export const event_guest_invitation_rsvp_email_html_content = (payload: {
    image: string,
    event: string,
    date: string,
    time: string,
    location: string,
    webappUrl: string,
    businessName: string,
    hasCoverImage: boolean,
    hostEmail?: string,
    hostWhatsApp?: string,
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
            padding: 32px 16px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            text-align: center;
        }

        /* === COVER IMAGE === */
        .hero-image {
            width: 100%;
            max-width: 480px;
            height: 300px;
            object-fit: cover;
            display: block;
            margin: 0 auto 28px;
            border-radius: 16px;
        }

        /* === NO COVER IMAGE === */
        .envelope-image {
            width: 140px;
            height: auto;
            display: block;
            margin: 0 auto 28px;
        }

        /* === EVENT TITLE === */
        .event-title {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 26px;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0 0 24px 0;
            text-align: center;
        }

        /* === DETAILS TABLE === */
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 28px;
            text-align: left;
        }

        .details-table td {
            padding: 14px 16px;
            border: 1px solid #e8e8e8;
            font-size: 15px;
            vertical-align: middle;
        }

        .details-table .label {
            color: #999999;
            font-weight: 400;
            width: 30%;
            white-space: nowrap;
        }

        .details-table .value {
            color: #1a1a1a;
            font-weight: 400;
        }

        /* === CONTACT ORGANIZER === */
        .contact-section {
            margin-bottom: 28px;
            font-size: 15px;
            color: #1a1a1a;
        }

        .contact-section span {
            color: #999999;
        }

        .contact-links {
            margin-top: 8px;
            font-size: 15px;
        }

        .contact-links a {
            color: #4f6ef7;
            text-decoration: none;
        }

        .contact-links .dot {
            color: #999999;
            margin: 0 8px;
        }

        /* === FOOTER === */
        .footer {
            padding-top: 20px;
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
            .wrapper { padding: 16px; }
            .hero-image { border-radius: 0; max-width: 100%; }
            .details-table .label { width: 35%; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">

            ${payload.hasCoverImage ? `
            <!-- COVER IMAGE LAYOUT -->
            <img src="${payload.image}" alt="${payload.event}" class="hero-image"/>
            ` : `
            <!-- DEFAULT (NO COVER IMAGE) LAYOUT -->
            <img src="https://res.cloudinary.com/dt0epuz7w/image/upload/v1767585910/invite-mail_feajcp.png"
                 alt="Event Invitation" class="envelope-image"/>
            `}

            <h2 class="event-title">${payload.event}</h2>

            <!-- EVENT DETAILS TABLE -->
            <table class="details-table" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">Date</td>
                    <td class="value">${payload.date}</td>
                </tr>
                <tr>
                    <td class="label">Time</td>
                    <td class="value">${payload.time}</td>
                </tr>
                <tr>
                    <td class="label">Location</td>
                    <td class="value">${payload.location}</td>
                </tr>
            </table>

            <!-- CONTACT ORGANIZER -->
            ${(payload.hostEmail || payload.hostWhatsApp) ? `
            <div class="contact-section">
                <strong>Questions about this event?</strong> <span>contact the organizer</span>
                <div class="contact-links">
                    ${payload.hostEmail ? `<a href="mailto:${payload.hostEmail}">Email</a>` : ''}
                    ${payload.hostEmail && payload.hostWhatsApp ? `<span class="dot">•</span>` : ''}
                    ${payload.hostWhatsApp ? `<a href="https://wa.me/${payload.hostWhatsApp.replace(/\D/g, '')}">WhatsApp</a>` : ''}
                </div>
            </div>
            ` : ''}

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
