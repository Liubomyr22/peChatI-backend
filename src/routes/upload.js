import { Router } from 'express'
import uploadImage from '../middelware/uploadImage.js'
import uploadController from '../controllers/uploadController.js'

const router = Router()

router.post('/upload_avatar', uploadImage, uploadController.uploadAvatar)

export default router