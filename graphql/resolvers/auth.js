const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const keys = require('../../config/keys');
const User = mongoose.model('users');
const { parseUser } = require('./helpers');

module.exports = {
	createUser: async ({ userInput }) => {
		try {
			const author = await User.findOne({
				email: userInput.email
			});
			if (author) {
				throw new Error('User exists already');
			}

			const hashedPassword = await bcrypt.hash(userInput.password, 12);

			const newUser = new User({
				email: userInput.email,
				password: hashedPassword
			});

			const result = await newUser.save();

			return parseUser(result);
		} catch (err) {
			throw err;
		}
	},
	login: async ({ email, password }) => {
		try {
			const user = await User.findOne({ email });
			if (!user) {
				throw new Error('User does not exist');
			}
			const isEqual = await bcrypt.compare(password, user.password);
			if (!isEqual) {
				throw new Error('Invalid credentials');
			}
			const token = jwt.sign(
				{ userId: user.id, email: user._doc.email },
				keys.jwtPrivateKey,
				{ expiresIn: '1h' }
			);

			return { userId: user.id, token, tokenExpiration: 1 };
		} catch (err) {
			throw err;
		}
	}
};
