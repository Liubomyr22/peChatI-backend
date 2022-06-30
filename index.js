import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import users from './src/routes/userRouter.js'
import upload from './src/routes/upload.js'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(fileUpload({ useTempFiles: true }))


app.use('/user', users)
app.use('/api', upload)

app.use('/', (req, res, next) => {
  res.json({ msg: 'hello world!' })
})

const URI = process.env.MONGODB_URL

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, err => {
  if (err) {
    throw err
  }
  console.log('connected to mongoDB')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => { console.log('Server is running') })
