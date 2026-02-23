export const event_admin_guest_accept_reject_invitation_email_html_content = (payload: {
    guestName: string,
    event: string,
    isAccept: boolean,
    webappUrl: string,
    eventDashboardUrl: string,
    businessName: string,
}) => {
    const isAccepted = payload.isAccept;
    const statusLabel = isAccepted ? 'Accepted' : 'Declined';
    const statusColor = isAccepted ? '#27a96b' : '#e05252';
    const statusBg = isAccepted ? '#f0fdf6' : '#fff5f5';
    const statusBorder = isAccepted ? '#27a96b' : '#e05252';
    const statusIcon = isAccepted ? '&#10003;' : '&#10005;';
    const statusMessage = isAccepted
        ? `<strong>${payload.guestName}</strong> has accepted their invitation to <strong>${payload.event}</strong>. They will be attending your event!`
        : `<strong>${payload.guestName}</strong> has declined their invitation to <strong>${payload.event}</strong>. They won't be able to attend.`;

    return `
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            background-color: #f4f6f8;
            font-family: 'Barlow', Arial, sans-serif;
        }

        .wrapper {
            background-color: #f4f6f8;
            padding: 40px 0;
        }

        .container {
            max-width: 580px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        /* Header bar */
        .header-bar {
            background-color: #1a1a1a;
            padding: 20px 32px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .header-logo {
            width: 30px;
            height: 30px;
            border-radius: 6px;
        }

        .header-brand {
            color: #ffffff;
            font-size: 16px;
            font-weight: 700;
            margin: 0;
        }

        /* Body */
        .body {
            padding: 32px 36px 36px;
        }

        .label {
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #999999;
            margin: 0 0 8px 0;
        }

        .heading {
            font-size: 22px;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0 0 20px 0;
            line-height: 1.3;
        }

        /* Guest RSVP card */
        .rsvp-card {
            border: 1px solid #e8e8e8;
            border-radius: 12px;
            padding: 20px 24px;
            margin-bottom: 24px;
            display: flex;
            align-items: flex-start;
            gap: 16px;
        }

        .rsvp-icon {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: bold;
            background-color: ${statusBg};
            color: ${statusColor};
            border: 1.5px solid ${statusBorder};
            flex-shrink: 0;
            text-align: center;
            line-height: 44px;
        }

        .rsvp-info {
            flex: 1;
        }

        .rsvp-guest-name {
            font-size: 16px;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0 0 4px 0;
        }

        .rsvp-status-pill {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            color: ${statusColor};
            background-color: ${statusBg};
            border: 1px solid ${statusBorder};
        }

        .summary-text {
            font-size: 14px;
            color: #555555;
            line-height: 1.7;
            margin: 0 0 28px 0;
        }

        /* CTA Button */
        .cta-btn {
            display: block;
            width: 100%;
            box-sizing: border-box;
            padding: 14px 0;
            background-color: #1a1a1a;
            color: #ffffff !important;
            text-align: center;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 700;
            font-size: 15px;
            margin-bottom: 10px;
        }

        /* Footer */
        .footer {
            margin-top: 32px;
            padding-top: 18px;
            text-align: center;
            border-top: 1px solid #e8e8e8;
        }

        .footer-name {
            margin: 0 0 4px 0;
            font-weight: 700;
            font-size: 13px;
            color: #1a1a1a;
        }

        .footer-url {
            font-size: 12px;
            color: #888888;
            text-decoration: none;
        }

        .footer-notice {
            font-size: 11px;
            color: #bbbbbb;
            margin-top: 8px;
        }

        @media only screen and (max-width: 600px) {
            .wrapper { padding: 0; }
            .container { border-radius: 0; box-shadow: none; }
            .body { padding: 24px 20px 28px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">

            <!-- Header -->
            <div class="header-bar">
                <img src="https://res.cloudinary.com/dt0epuz7w/image/upload/v1766492310/versions/4df5bffe-0122-4dfa-a631-eef51574f623_invialogo.jpg"
                     alt="Invia" class="header-logo"/>
                <p class="header-brand">Invia</p>
            </div>

            <!-- Body -->
            <div class="body">
                <p class="label">Guest RSVP Update</p>
                <h1 class="heading">A guest has ${isAccepted ? 'accepted' : 'declined'} your invitation</h1>

                <!-- RSVP Card -->
                <div class="rsvp-card">
                    <div class="rsvp-icon">${statusIcon}</div>
                    <div class="rsvp-info">
                        <p class="rsvp-guest-name">${payload.guestName}</p>
                        <span class="rsvp-status-pill">${statusLabel}</span>
                    </div>
                </div>

                <p class="summary-text">${statusMessage}</p>

                <a href="${payload.eventDashboardUrl}" target="_blank" class="cta-btn">View Guest List &rarr;</a>

                <div class="footer">
                    <p class="footer-name">${payload.businessName}</p>
                    <a href="${payload.webappUrl}" target="_blank" class="footer-url">${payload.webappUrl.split("https://")[1]}</a>
                    <p class="footer-notice">You received this notification because you are an event organiser on Invia.</p>
                </div>
            </div>

        </div>
    </div>
</body>
</html>
`;
};
