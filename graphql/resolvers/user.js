const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = mongoose.model('users');
const { parseUser } = require('./helpers');

module.exports = {
	createUser: async args => {
		try {
			const author = await User.findOne({
				email: args.userInput.email
			});
			if (author) {
				throw new Error('User exists already');
			}

			const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

			const newUser = new User({
				email: args.userInput.email,
				password: hashedPassword
			});

			const result = await newUser.save();

			return parseUser(result);
		} catch (err) {
			throw err;
		}
	}
};
