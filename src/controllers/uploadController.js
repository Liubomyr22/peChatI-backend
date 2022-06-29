import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})

const uploadController = {
  uploadAvatar: (req, res) => {
    try {
      const file = req.files.file
      console.log(file)
      cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'avatar', width: 150, height: 150, crop: 'fill'
      }, async (err, result) => {
        if (err) throw err
        removeTmp(file.tempFilePath)
        res.json({ url: result.secure_url })
      })

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  }
}


const removeTmp = (path) => {
  fs.unlink(path, err => {
    if (err) throw err
  })
}


export default uploadController