const express = require("express")
const csrf = require("csurf")
const fs = require("fs")
const hpp = require("hpp")
const cors = require("cors")
const { env } = require("../config/config")
const helmet = require("helmet")
const https = require("https")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")

//* set save csrf token secret to use cookie
const csrfProtect = csrf({ cookie: true })

class Server {
	constructor(config) {
		this.config = config
		this.app = express()
		this.setMiddleware()
		this.setRoute()
		this.setErrorHandler()
	}

	setMiddleware() {
		//* disable "x-powered-by" header
		this.app.disable("x-powered-by")

		if (env === "prod") {
			//* logger middleware
			this.app.use(morgan("combined"))

			//* security middleware
			this.app.use(hpp())
			this.app.use(helmet())
			this.app.use(cors({ origin: "site-url", credentials: true }))
		} else {
			this.app.use(morgan("dev"))
			this.app.use(cors({ origin: true, credentials: true }))
		}

		//* json middleware, urlencoded
		this.app.use(express.json())
		this.app.use(express.urlencoded({ extended: true }))

		//* cookie-parser
		this.app.use(cookieParser(this.config.cookieParser))
	}

	setRoute() {
		//* server landing page
		this.app.get("/", csrfProtect, (req, res) => {
			// 3시간 유효
			res.cookie("XSRF-TOKEN", req.csrfToken(), {
				expires: new Date(Date.now() + 3 * 3600000),
				httpOnly: true,
				sameSite: "None",
				secure: true,
			})
			res.status(200).json({ message: "hello world!!" })
		})
	}

	setErrorHandler() {
		//* 404 middleware
		this.app.use((req, res, next) => {
			res.status(404).json({ message: "404 not found error" })
		})

		//* 500 middleware
		this.app.use((err, req, res, next) => {
			res.status(500).json({ message: "500 server error" })
		})
	}
}

async function createServer(config) {
	const app = new Server(config).app
	if (fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")) {
		const privateKey = fs.readFileSync("./key.pem", "utf8")
		const certificate = fs.readFileSync("./cert.pem", "utf8")
		const credentials = { key: privateKey, cert: certificate }

		return https.createServer(credentials, app)
	}
	return app
}

module.exports = { createServer }
