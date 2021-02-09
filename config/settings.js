const env = require('env-var')

const settings = {
	NODE_ENV: env.get('NODE_ENV').required().asString(),
	API_URL: env.get('API_URL').required().asUrlString()
}

module.exports = settings