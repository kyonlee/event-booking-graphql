const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');

const keys = require('./config/keys');
require('./models/Event');
require('./models/User');
require('./models/Booking');

const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');
const requireLogin = require('./middlewares/requireLogin');

const app = express();

app.use(bodyParser.json());

app.use(requireLogin);

app.use(
	'/graphql',
	graphqlHTTP({
		schema: graphqlSchema,
		rootValue: graphqlResolvers,
		graphiql: true
	})
);

const PORT = process.env.PORT || 5000;

mongoose
	.connect(
		`mongodb+srv://${keys.mongoUser}:${
			keys.mongoPassword
		}@cluster0-wxsmq.mongodb.net/${keys.mongoDb}?retryWrites=true&w=majority`
	)
	.then(app.listen(PORT, () => console.log(`Listening on ${PORT}`)))
	.catch(err => console.log(err));
