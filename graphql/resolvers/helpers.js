const mongoose = require('mongoose');

const Event = mongoose.model('events');
const User = mongoose.model('users');
const { dateToString } = require('../../helpers/date');

const parseEvent = event => {
	return {
		...event._doc,
		_id: event.id,
		date: dateToString(event._doc.date),
		author: user.bind(this, event._doc.author)
	};
};

const parseBooking = booking => {
	return {
		...booking._doc,
		_id: booking.id,
		user: user.bind(this, booking._doc.user),
		event: event.bind(this, booking._doc.event),
		createdAt: dateToString(booking._doc.createdAt),
		updatedAt: dateToString(booking._doc.updatedAt)
	};
};

const parseUser = user => {
	return {
		...user._doc,
		_id: user.id,
		password: null,
		createdEvents: events.bind(this, user._doc.createdEvents)
	};
};

const user = async userId => {
	try {
		const user = await User.findById(userId);
		return parseUser(user);
	} catch (err) {
		throw err;
	}
};

const event = async eventId => {
	try {
		const event = await Event.findById(eventId);
		return parseEvent(event);
	} catch (err) {
		throw err;
	}
};

const events = async eventIds => {
	try {
		const events = await Event.find({ _id: { $in: eventIds } });

		return events.map(event => {
			return parseEvent(event);
		});
	} catch (err) {
		throw err;
	}
};

exports.parseEvent = parseEvent;
exports.parseBooking = parseBooking;
exports.parseUser = parseUser;
exports.user = user;
exports.event = event;
exports.events = events;
