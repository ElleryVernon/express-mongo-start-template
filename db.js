const mongoose = require("mongoose")

const { config, env } = require("./config/config")

//* init database connection
if (!config.database) {
	console.error("MongoDB connection string is missing!")
	process.exit(1)
}

if (env !== "test") {
	mongoose
		.connect(config.database, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(console.log("MongoDB Connected!!"))
		.catch((err) => console.error(err))
}

module.exports = {
	getByUserEmail: (email) => User.find({ email }),
}
