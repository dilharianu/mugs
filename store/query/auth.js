const _ = require('lodash');
const passwordHash = require('../util/passwordHash');

module.exports = async function(email, password) {
	const body = await this.find({ email });
	const hash = passwordHash(password + body[0].salt);

	const users = await this.find({ email, password: hash });
	if (users.length === 0) throw new Error('Wrong e-mail or password');

	const user = users[0];
	return user.toJSON();
};
