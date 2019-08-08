const mongoose = require('mongoose');

const Booking = mongoose.model('bookings');
const { parseBooking, parseEvent } = require('./helpers');

module.exports = {
	bookings: async (args, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthorized');
		}

		try {
			const bookings = await Booking.find({ user: req.userId });

			return bookings.map(booking => {
				return parseBooking(booking);
			});
		} catch (err) {
			throw err;
		}
	},
	bookEvent: async ({ eventId }, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthorized');
		}

		const newBooking = new Booking({
			user: req.userId,
			event: eventId
		});

		try {
			const result = await newBooking.save();

			return parseBooking(result);
		} catch (err) {
			throw err;
		}
	},
	cancelBooking: async ({ bookingId }, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthorized');
		}

		try {
			// this is where you .populate('event')
			const result = await Booking.findByIdAndDelete(bookingId).populate(
				'event'
			);

			// need to populate('event') if using this method
			const event = parseEvent(result.event);

			// remove populate('event') if using this method
			// const bookingEvent = await event.bind(this, result._doc.event)();

			return event;
		} catch (err) {
			throw err;
		}
	}
};
