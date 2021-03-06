const passwordHash = require('../util/passwordHash');

module.exports = async function(id, password, repeated, newPassword) {
	const user = await this.findById(id);
	if (passwordHash(password) === user.password) {
		if (password === repeated) {
			user.password = newPassword;
			const err = await user.validateSync();
			if (err) throw new Error(err);
			await user.save();
		} else {
			throw new Error('Repeated password was incorrect.');
		}
	} else {
		throw new Error('Entered password was incorrect.');
	}
};
