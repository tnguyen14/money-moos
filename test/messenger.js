const tap = require('tap');
const sinon = require('sinon');
const messenger = require('../lib/messenger');

process.env.VERIFY_TOKEN = 'VERIFY_TOKEN';

const res = {
	status: () => {},
	send: () => {},
	sendStatus: () => {}
};

tap.test('Messenger', function(t) {
	t.beforeEach(function(done) {
		sinon.stub(res, 'status').returnsThis();
		sinon.spy(res, 'send');
		sinon.spy(res, 'sendStatus');
		done();
	});
	t.afterEach(function(done) {
		res.status.restore();
		res.send.restore();
		res.sendStatus.restore();
		done();
	});
	t.test('Token verification', function(t) {
		const req = {
			method: 'GET',
			query: {
				'hub.verify_token': 'VERIFY_TOKEN',
				'hub.challenge': 'abc123',
			}
		};
		messenger(req, res);
		t.ok(res.send.calledWith('abc123'));
		t.end();
	});
	t.test('Token verification fail', function(t) {
		const req = {
			method: 'GET',
			query: {
				'hub.verify_token': 'foo',
				'hub.challenge': 'abc123',
			}
		};
		messenger(req, res);
		t.ok(res.status.calledWith(400));
		t.ok(res.send.calledWith({ error: 'wrong validation token' }));
		t.end();
	});
	t.end();
});
