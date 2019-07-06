// key.js - figure out which sets on credentals to return

if (process.env.NODE_ENV === 'production') {
	module.exports = require('./prod');
} else {
	module.exports = require('./dev');
}
