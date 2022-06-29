import fs from 'fs'

const removeTmp = (path) => {
  fs.unlink(path, err => {
    if (err) throw err
  })
}

const uploadImage = async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ msg: 'No files were uploaded!' })
    }
    const file = req.files.file
    console.log(file)

    if (file.size > 1024 * 1024) {
      removeTmp(file.tempFilePath)
      return res.status(400).json({ msg: 'Size too large!' })
    }
    next()
  } catch (err) {
    return res.status(500).json({ msg: err.message })
  }
}


export default uploadImage

