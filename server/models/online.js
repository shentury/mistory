const mongoose = require('mongoose');
const schema = new mongoose.Schema(
	{
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			required: true,
		},
		closed: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);
schema.statics.recordOnlineTime = async function(userId) {
	const user = mongoose.Types.ObjectId(userId);
	const currentOnlineRecord = await this.findOne({
		user,
		closed: false,
	}).lean();
	//if this user is online
	if (currentOnlineRecord) {
		return false;
	} else {
		await this.create({
			user,
		});
		await mongoose.model('user').findByIdAndUpdate(user, { lastOnline: new Date() });
		return true;
	}
};
schema.statics.recordOfflineTime = function(userId) {
	const user = mongoose.Types.ObjectId(userId);
	return this.findOneAndUpdate({ user, closed: false }, { $set: { closed: true } }).exec();
};

module.exports = mongoose.model('online', schema);
