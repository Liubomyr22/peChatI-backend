import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import dotenv from 'dotenv'
dotenv.config()

const { OAuth2 } = google.auth

const OAUTH_PLAYGROUND = 'http://developers.google.com/oauthplayground'

const {
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  SENDER_EMAIL_ADDRESS
} = process.env

const oauth2Client = new OAuth2(
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  OAUTH_PLAYGROUND
)

const sendMail = (to, url, txt) => {
  oauth2Client.setCredentials({
    refresh_token: MAILING_SERVICE_REFRESH_TOKEN
  })

  const accessToken = oauth2Client.getAccessToken()
  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: SENDER_EMAIL_ADDRESS,
      clientId: MAILING_SERVICE_CLIENT_ID,
      clientSecret: MAILING_SERVICE_CLIENT_SECRET,
      refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
      accessToken
    }
  })
  const mailOptions = {
    from: SENDER_EMAIL_ADDRESS,
    to: to,
    subject: 'PeChatI',
    html: `

    <div
      style="
        background-color: #4dbfbf;
        margin: auto;
        padding: 16px;
      "
    >
      <h1 style="color: aliceblue; text-align: center; padding: 24px;">
        Welcome to PeChatI App
      </h1>
      <div style="display: block; margin: 16px auto 32px;">
      <a
        style="
          display: block;
          width: 250px;
          height: 50px;
          margin: 16px auto 32px;
          line-height: 50px;
          font-weight: bold;
          text-decoration: none;
          background: #333;
          text-align: center;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.1rem;
          border: 3px solid #333;
        "
        href=${url}
      >
        ${txt}
      </a>
      </div>
    </div>
    `
  }
  smtpTransport.sendMail(mailOptions, (err, infor) => {
    if (err) return err
    return infor
  })
}



export { sendMail }


