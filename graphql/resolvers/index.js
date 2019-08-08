const bookingResolver = require('./booking');
const eventResolver = require('./event');
const authResolver = require('./auth');

const rootResolvers = {
	...bookingResolver,
	...eventResolver,
	...authResolver
};

module.exports = rootResolvers;

// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const Event = mongoose.model('events');
// const User = mongoose.model('users');
// const Booking = mongoose.model('bookings');
// const { dateToString } = require('../../helpers/date');

// const parseEvent = event => {
// 	return {
// 		...event._doc,
// 		_id: event.id,
// 		date: dateToString(event._doc.date),
// 		author: user.bind(this, event._doc.author)
// 	};
// };

// const parseBooking = booking => {
// 	return {
// 		...booking._doc,
// 		_id: booking.id,
// 		user: user.bind(this, booking._doc.user),
// 		event: event.bind(this, booking._doc.event),
// 		createdAt: dateToString(booking._doc.createdAt),
// 		updatedAt: dateToString(booking._doc.updatedAt)
// 	};
// };

// const parseUser = user => {
// 	return {
// 		...user._doc,
// 		_id: user.id,
// 		password: null,
// 		createdEvents: events.bind(this, user._doc.createdEvents)
// 	};
// };

// const user = async userId => {
// 	try {
// 		const user = await User.findById(userId);
// 		return parseUser(user);
// 	} catch (err) {
// 		throw err;
// 	}
// };

// const event = async eventId => {
// 	try {
// 		const event = await Event.findById(eventId);
// 		return parseEvent(event);
// 	} catch (err) {
// 		throw err;
// 	}
// };

// const events = async eventIds => {
// 	try {
// 		const events = await Event.find({ _id: { $in: eventIds } });

// 		return events.map(event => {
// 			return parseEvent(event);
// 		});
// 	} catch (err) {
// 		throw err;
// 	}
// };

// module.exports = {
// 	events: async () => {
// 		try {
// 			const events = await Event.find();

// 			return events.map(event => {
// 				return parseEvent(event);
// 			});
// 		} catch (err) {
// 			throw err;
// 		}
// 	},
// 	bookings: async () => {
// 		try {
// 			const bookings = await Booking.find();

// 			return bookings.map(booking => {
// 				return parseBooking(booking);
// 			});
// 		} catch (err) {
// 			throw err;
// 		}
// 	},
// 	createEvent: async args => {
// 		const newEvent = new Event({
// 			title: args.eventInput.title,
// 			description: args.eventInput.description,
// 			price: +args.eventInput.price,
// 			date: new Date(args.eventInput.date),
// 			author: '5d132796955d0487929f505c'
// 		});

// 		try {
// 			const author = await User.findById('5d132796955d0487929f505c');

// 			if (!author) {
// 				throw new Error('User not found');
// 			}

// 			const result = await newEvent.save();

// 			author.createdEvents.push(result);
// 			await author.save();

// 			return parseEvent(result);
// 		} catch (err) {
// 			throw err;
// 		}
// 	},
// 	createUser: async args => {
// 		try {
// 			const author = await User.findOne({
// 				email: args.userInput.email
// 			});
// 			if (author) {
// 				throw new Error('User exists already');
// 			}

// 			const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

// 			const newUser = new User({
// 				email: args.userInput.email,
// 				password: hashedPassword
// 			});

// 			const result = await newUser.save();

// 			return parseUser(result);
// 		} catch (err) {
// 			throw err;
// 		}
// 	},
// 	bookEvent: async args => {
// 		const newBooking = new Booking({
// 			user: '5d132796955d0487929f505c',
// 			event: args.eventId
// 		});

// 		try {
// 			const result = await newBooking.save();

// 			return parseBooking(result);
// 		} catch (err) {
// 			throw err;
// 		}
// 	},
// 	cancelBooking: async args => {
// 		try {
// 			// this is where you .populate('event')
// 			const result = await Booking.findByIdAndDelete(args.bookingId).populate(
// 				'event'
// 			);

// 			// need to populate('event') if using this method

// 			const event = parseEvent(result.event);

// 			// remove populate('event') if using this method
// 			// const bookingEvent = await event.bind(this, result._doc.event)();

// 			return event;
// 		} catch (err) {
// 			throw err;
// 		}
// 	}
// };
