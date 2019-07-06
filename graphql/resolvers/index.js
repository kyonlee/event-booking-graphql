const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = mongoose.model('events');
const User = mongoose.model('users');
const Booking = mongoose.model('bookings');

const user = async userId => {
	try {
		const user = await User.findById(userId);
		return {
			...user._doc,
			_id: user.id,
			password: null,
			createdEvents: events.bind(this, user._doc.createdEvents)
		};
	} catch (err) {
		throw err;
	}
};

const event = async eventId => {
	try {
		const event = await Event.findById(eventId);
		return {
			...event._doc,
			_id: event.id,
			date: new Date(event._doc.date).toISOString(),
			author: user.bind(this, event._doc.author)
		};
	} catch (err) {
		throw err;
	}
};

const events = async eventIds => {
	try {
		const events = await Event.find({ _id: { $in: eventIds } });

		return events.map(event => {
			return {
				...event._doc,
				_id: event.id,
				date: new Date(event._doc.date).toISOString(),
				author: user.bind(this, event._doc.author)
			};
		});
	} catch (err) {
		throw err;
	}
};

module.exports = {
	events: async () => {
		try {
			const events = await Event.find();

			return events.map(event => {
				return {
					...event._doc,
					_id: event.id,
					date: new Date(event._doc.date).toISOString(),
					author: user.bind(this, event._doc.author)
				};
			});
		} catch (err) {
			throw err;
		}
	},
	// need to user and event functions to booking resolver
	bookings: async () => {
		try {
			const bookings = await Booking.find();

			return bookings.map(booking => {
				return {
					...booking._doc,
					_id: booking.id,
					createdAt: new Date(booking._doc.createdAt).toISOString(),
					updatedAt: new Date(booking._doc.updatedAt).toISOString()
				};
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
			const result = await newEvent.save();

			const author = await User.findById('5d132796955d0487929f505c');

			if (!author) {
				throw new Error('User not found');
			}

			author.createdEvents.push(result);
			await author.save();

			return {
				...result._doc,
				_id: result.id,
				date: new Date(result._doc.date).toISOString(),
				author: user.bind(this, result._doc.author)
			};
		} catch (err) {
			throw err;
		}
	},
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

			return { ...result._doc, _id: result.id, password: null };
		} catch (err) {
			throw err;
		}
	},
	bookEvent: async args => {
		const newBooking = new Booking({
			user: '5d132796955d0487929f505c',
			event: args.eventId
		});

		try {
			const result = await newBooking.save();

			return {
				...result._doc,
				_id: result.id,
				event: event.bind(this, result._doc.event),
				user: user.bind(this, result._doc.user),
				createdAt: new Date(result._doc.createdAt).toISOString(),
				updatedAt: new Date(result._doc.updatedAt).toISOString()
			};
		} catch (err) {
			throw err;
		}
	},
	cancelBooking: async args => {
		try {
			const result = await Booking.findByIdAndDelete(args.bookingId).populate(
				'event'
			);

			// need to populate('event') if using this method

			const event = {
				...result.event._doc,
				_id: result.event.id,
				author: user.bind(this, result.event._doc.author),
				date: new Date(result.event._doc.date).toISOString()
			};

			console.log(event);

			// remove populate('event') if using this method
			// const bookingEvent = await event.bind(this, result._doc.event)();

			return event;
		} catch (err) {
			throw err;
		}
	}
};
