const mongoose = require('mongoose');

const Event = mongoose.model('events');
const User = mongoose.model('users');
const { parseEvent } = require('./helpers');

module.exports = {
	events: async () => {
		try {
			const events = await Event.find();

			return events.map(event => {
				return parseEvent(event);
			});
		} catch (err) {
			throw err;
		}
	},
	createEvent: async ({ eventInput }, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthorized');
		}

		const newEvent = new Event({
			title: eventInput.title,
			description: eventInput.description,
			price: +eventInput.price,
			date: new Date(eventInput.date),
			author: req.userId
		});

		try {
			const author = await User.findById(req.userId);

			if (!author) {
				throw new Error('User not found');
			}

			const result = await newEvent.save();

			author.createdEvents.push(result);
			await author.save();

			return parseEvent(result);
		} catch (err) {
			throw err;
		}
	}
};
