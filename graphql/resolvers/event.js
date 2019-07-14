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
	createEvent: async args => {
		const newEvent = new Event({
			title: args.eventInput.title,
			description: args.eventInput.description,
			price: +args.eventInput.price,
			date: new Date(args.eventInput.date),
			author: '5d132796955d0487929f505c'
		});

		try {
			const author = await User.findById('5d132796955d0487929f505c');

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
