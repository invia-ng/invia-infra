export const invite_event_guest_email_html_content = (payload: {
	image: string,
	event: string,
	message: string,
	acceptLink: string,
	rejectLink: string,
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
        
        .default-cover-image {
					width: 200px;
        }

        .title {
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0 0 0;
        }

        .message {
            text-align: center;
            margin: 0 0 10px 0;
        }

        .buttons {
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          gap: 15px !important;
        }
        
        #attend-btn {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 30px;
          color: #fff;
          text-align: center;
          border-radius: 10px;
          text-decoration: none;
          background-color: #479FFD;
          font-weight: bold;
        }
        
        #reject-btn {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 30px;
          text-align: center;
          color: #575554;
          border-radius: 10px;
          text-decoration: none;
          border: 1px solid #E5E5E5;
          background-color: #fff;
          font-weight: bold;
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
                         class="logo"/>
                    <h1 class="title">You Are Invited!</h1>
                    ${payload.hasCoverImage ? `<img src="${payload.image}"  
                         alt="Event-Image" 
                         class="cover-image"/>` : `<img src="https://res.cloudinary.com/dt0epuz7w/image/upload/v1767585910/invite-mail_feajcp.png"  
                         alt="Event-Image" 
                         class="default-cover-image"/>`}
                </div>
                
                <div class="message">
                    <h1 class="title">${payload.event}</h1>
                    <p>${payload.message}</p>
								</div>
								
								<div class="buttons">
									<a href="${payload.acceptLink}" target="_blank" id="attend-btn">Accept Invitation</a>
									<a href="${payload.rejectLink}" target="_blank" id="reject-btn">Can't Attend</a>
								</div>
            </div>
        </div>
    </div>
</body>
</html>
`;
};
