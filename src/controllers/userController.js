import Users from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import { isValidEmail, isValidName, isValidPassword } from '../validations.js';
import { sendMail } from './sendMail.js';
dotenv.config()

const CLIENT_URL = process.env.CLIENT_URL;

const userController = {
	register: async (req, res) => {
		try {

			const { name, email, password } = req.body;

			if (!name || !email || !password) {
				return res.status(400).json({ msg: 'Please fill in all fields!' });
			}

			if (!isValidEmail(email)) {
				return res.status(400).json({ msg: 'Invalid email!' });
			}

			if (isValidPassword(password)) {
				return res.status(400).json({ msg: 'Invalid password!' });
			}

			if (!isValidName(name)) {
				return res.status(400).json({ msg: 'Invalid name!' });
			}

			const user = await Users.findOne({ email });

			if (user) {
				return res.status(400).json({ msg: 'Email already exist!' });
			}

			const passwordHash = await bcrypt.hash(password, 12);

			const newUser = { name, email, password: passwordHash }

			const activation_token = createActivationToken(newUser);

			const url = `${CLIENT_URL}/user/activate/${activation_token}`;

			sendMail(email, url, 'Activate')

			res.json({ msg: 'Register Success!Please activate your email to start.' });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	activateEmail: async (req, res) => {
		try {
			const { activation_token } = req.body
			const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

			const { name, email, password } = user

			const check = await Users.findOne({ email })
			if (check) return res.status(400).json({ msg: 'This email already exists!' })

			const newUser = new Users({ name, email, password })
			await newUser.save()

			res.json({ msg: 'Account has been activated!' })

		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	login: async (req, res) => {
		try {
			const { email, password } = req.body
			const user = await Users.findOne({ email })
			if (!user) return res.status(400).json({ msg: 'This email does not exist!' })

			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) return res.status(400).json({ msg: 'Password is incorrect!' })

			const refresh_token = createRefreshToken({ id: user._id })
			res.cookie('refreshtoken', refresh_token, {
				httpOnly: true,
				path: 'users/refresh_token',
				maxAge: 7 * 24 * 60 * 60 * 1000
			})

			res.json({ msg: 'Login Success!' })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	getAccessToken: async (req, res) => {
		try {
			const rf_token = req.cookies.refreshtoken
			if (!rf_token) return res.status(400).json({ msg: 'Please Login now!' })

			jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
				if (err) return res.status(400).json({ msg: err.message })

				const access_token = createAccessToken({ id: user.id })
				res.json({ access_token })
			})

		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	forgotPassword: async (req, res) => {
		try {
			const { email } = req.body
			const user = await Users.findOne({ email })
			if (!user) return res.status(400).json({ msg: 'This email does not exist!' })

			const access_token = createAccessToken({ id: user._id })
			const url = `${CLIENT_URL}/user/reset/${access_token}`

			sendMail(email, url, 'Reset your password')

			res.json({ msg: 'Re-send the password,please check your email!' })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	resetPassword: async (req, res) => {
		try {
			const { password } = req.body

			const passwordHash = await bcrypt.hash(password, 12)

			await Users.findOneAndUpdate({ _id: req.user.id }, {
				password: passwordHash
			})

			res.json({ msg: 'Password succesfully changed!' })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	getUserInfo: async (req, res) => {
		try {
			const user = await Users.findById(req.user.id).select('-password')
			res.json(user)
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}

	},
	getAllUserInfo: async (req, res) => {
		try {
			const users = await Users.find().select('-password')

			res.json(users)
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	logout: async (req, res) => {
		try {
			res.clearCookie('refreshtoken', { path: 'users/refresh_token' })
			return res.json({ msg: 'Logged out!' })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	updateUserInfo: async (req, res) => {
		try {
			const { name, avatar } = req.body
			await Users.findOneAndUpdate({ _id: req.user.id }, {
				name, avatar
			})
			res.json({ msg: 'Update Success!' })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	}
};

const createActivationToken = payload => {
	return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
		expiresIn: '5m',
	});
};

const createAccessToken = payload => {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '15m',
	});
};

const createRefreshToken = payload => {
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: '7d',
	});
};

export default userController;
