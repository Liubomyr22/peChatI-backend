import { Router } from 'express'
import userController from '../controllers/userController.js'
import { auth } from '../middelware/auth.js'
const router = Router()

router.post('/register', userController.register)
router.post('/activation', userController.activateEmail)
router.post('/login', userController.login)
router.post('/refresh_token', userController.getAccessToken)
router.post('/forgot', userController.forgotPassword)
router.post('/reset', auth, userController.resetPassword)
router.get('/info', auth, userController.getUserInfo)
router.get('/all_users', auth, userController.getAllUserInfo)
router.get('/logout', userController.logout)
router.patch('/update', auth, userController.updateUserInfo)


export default router