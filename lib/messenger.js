const verifyToken = process.env.VERIFY_TOKEN;
const messagingEvent = require('./event');

module.exports = function(req, res) {
	switch (req.method) {
		case 'GET':
			console.log(process.env.VERIFY_TOKEN);
			console.log(process.env.PAGE_TOKEN);
			if (req.query['hub.verify_token'] === verifyToken) {
				return res.send(req.query['hub.challenge']);
			}
			res.status(400).send({ error: 'wrong validation token' });
			break;
		case 'POST':
			// make sure it is a page subscription
			if (req.body.object !== 'page') {
				debug('Error: Not a page subscription');
				return;
			}
			req.body.entry.forEach((pageEntry) => {
				// var pageID = pageEntry.id;
				// var timeOfEvent = pageEntry.time;

				// Handle messaging events
				pageEntry.messaging.forEach(messagingEvent);
			});

			// Assume all went well
			res.sendStatus(200);
			break;
		default:
			res.status(500).send({ error: 'Something blew up!' });
			break;
	}
}
