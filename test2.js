//  Tips Javascript YOUTUBE

const dotenv = require('dotenv').config()
const fs = require('fs')
const { google } = require('googleapis')
const path = require('path')

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL,
)

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN_API,
})
//const { tokens } = await oauth2Client.getToken(code)
//oauth2Client.setCredentials(tokens)
const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
})

const uploadFile = async function ({ filename, mimetype, share }) {
  try {
    const createFile = await drive.files.create({
      requestBody: {
        name: filename,
        mimeType: mimetype,
      },
      media: {
        mimeType: mimetype,
        body: fs.createReadStream(path.join(__dirname, filename)),
      },
    })

    const fileId = createFile.data.id
    console.log(createFile.data)
    if (share) {
      const getUrl = await setFilePublic(fileId)
      console.log(getUrl.data)
    }
  } catch (error) {
    console.error(error)
  }
}

const deleteFile = async function (fileId) {
  try {
    const deleteFile = await drive.files.delete({
      fileId: fileId,
    })
    console.log(deleteFile.data, deleteFile.status)
  } catch (error) {
    console.error(error)
  }
}

const setFilePublic = async function (fileId) {
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    })
    const getUrl = await drive.files.get({
      fileId,
      fields: 'webViewLink, webContentLink',
    })
    return getUrl
  } catch (error) {
    console.error(error)
  }
}

uploadFile({
  filename: '1.zip',
  mimetype: 'application/zip',
  share: true,
})
//deleteFile('15-SvwsVyYRGfkGDtzSOEtp5g0nwaUyJp')

// - application/octet-stream, application/pdf, application/pkcs8, pplication/zip
// - audio/mpeg, audio/vorbis
// - font/woff, font/ttf, font/otf
// - image/jpeg, image/png, image/svg+xml
// - text/plain, text/csv, and text/html
// - video/mp4