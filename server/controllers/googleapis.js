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

const uploadFile = async function ({ pathfilename, mimetype, share }) {
  const resp = await new Promise(async (resolve, reject) => {
    try {
      let filename = pathfilename.split(/(\\|\/)/g).pop()
      const createFile = await drive.files.create({
        requestBody: {
          name: filename,
          mimeType: mimetype,
        },
        media: {
          mimeType: mimetype,
          body: fs.createReadStream(pathfilename),
          //body: fs.createReadStream(path.join(__dirname, filename)),
        },
      })

      const fileId = createFile.data.id
      //console.log(createFile.data)
      let getUrl = null
      if (share) {
        getUrl = await setFilePublic(fileId)
        getUrl = getUrl.data
        //console.log(getUrl)
      }
      resolve({
        fileId: fileId,
        getUrl: getUrl,
      })
    } catch (error) {
      //console.error(error)
      reject(error)
    }
  })
  console.log(resp)
  return resp
}

const deleteFile = async function (fileId) {
  try {
    const deleteFile = await drive.files.delete({
      fileId: fileId,
    })
    console.log(
      'Deleted File id : ' + fileId,
      'status Code: ' + deleteFile.status,
    )
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

exports.googleUpload = async function (req, res) {
  //console.log(req.body)
  const { pathfilename } = req.body
  mimetype = req.body.mimetype || 'application/zip'
  share = req.body.share || true
  if (!fs.existsSync(pathfilename)) {
    return res.status(500).json({
      success: false,
      message: 'File not exist: ' + pathfilename,
    })
  }
  let ret = await uploadFile({ pathfilename, mimetype, share })
  return res.status(200).json({
    success: true,
    message: 'Upload thành công.',
    data: ret,
  })
}

exports.googleDelete = function (req, res) {
  const { id } = req.body
  deleteFile(id)
}
//deleteFile('15-SvwsVyYRGfkGDtzSOEtp5g0nwaUyJp')

// - application/octet-stream, application/pdf, application/pkcs8, pplication/zip
// - audio/mpeg, audio/vorbis
// - font/woff, font/ttf, font/otf
// - image/jpeg, image/png, image/svg+xml
// - text/plain, text/csv, and text/html
// - video/mp4
