const dotenv = require("dotenv")
const path = require("path")

const env = process.env.NODE_ENV

const envPath =
	env === "prod"
		? path.resolve(__dirname, "../dotenv/.env.prod")
		: env === "dev"
		? path.resolve(__dirname, "../dotenv/.env.dev")
		: env === "test"
		? path.resolve(__dirname, "../dotenv/.env.test")
		: path.resolve(__dirname, "../dotenv/.env")

dotenv.config({ path: envPath })

const config = {
	port: +process.env.PORT || 8080,
	database: process.env.DATABASE,
	jwtSecret: process.env.JWT_SECRET,
	cookieSecret: process.env.COOKIE_SECRET,
}

module.exports = { config, env }
