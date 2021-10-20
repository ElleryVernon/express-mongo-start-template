const { createServer } = require("./src/server")
const { config } = require("./config/config")

require("./db")

async function main(config = {}) {
	const server = await createServer(config)
	server.listen(config.port, () => {
		console.log(`Running at prot ${port}`)
	})
}

//* start server
main(config)
