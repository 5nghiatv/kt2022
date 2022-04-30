const ftp = require('basic-ftp')
const dotenv = require('dotenv')
dotenv.config()

uploadDistDir('ktacn.nghiajs.com')

// #`````````````FTP_of_HAWK in env
// FTP_HOST=ftp.nghiajs.com
// FTP_USERNAME=nghiajsc
// FTP_PASSWORD=Tranmeji@1234
// #`````````````HAWK

async function uploadDistDir(mainDir) {
  const client = new ftp.Client()
  client.ftp.verbose = false // Thông báo dòng lệnh
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USERNAME,
      password: process.env.FTP_PASSWORD,
      secure: false, // Tắt bảo mật
    })
    //console.log(await client.list())
    const curtime = new Date().getTime()
    client.trackProgress((info) =>
      console.log('File', info.name, info.bytesOverall),
    )
    //====== test
    // await client.uploadFrom('README.md', mainDir + '/README_FTP.md')
    // await client.downloadTo('README_COPY.md', mainDir + '/README_FTP.md')
    //====== test
    await client.uploadFrom('dist/index.html', mainDir + '/dist/index.html')
    await client.ensureDir(mainDir + '/dist')
    await client.clearWorkingDir()
    await client.uploadFromDir('dist')
    // Stop logging
    client.trackProgress()
    console.log(
      'Ftp process successfully in...',
      (new Date().getTime() - curtime) / 60000,
      'Minutes',
    )
  } catch (err) {
    console.log(err)
  }
  client.close()
}
