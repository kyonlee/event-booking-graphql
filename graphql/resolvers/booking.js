const mongoose = require('mongoose');

const Booking = mongoose.model('bookings');
const { parseBooking, parseEvent } = require('./helpers');

module.exports = {
	bookings: async () => {
		try {
			const bookings = await Booking.find();

			return bookings.map(booking => {
				return parseBooking(booking);
			});
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

			return parseBooking(result);
		} catch (err) {
			throw err;
		}
	},
	cancelBooking: async args => {
		try {
			// this is where you .populate('event')
			const result = await Booking.findByIdAndDelete(args.bookingId).populate(
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
