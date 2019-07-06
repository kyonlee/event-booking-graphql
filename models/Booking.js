const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema(
	{
		event: {
			type: Schema.Types.ObjectId,
			ref: 'events'
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'users'
		}
	},
	{ timestamps: true }
);

mongoose.model('bookings', bookingSchema);
