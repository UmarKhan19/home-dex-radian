const nextConfig = {
	webpack: config => {
		config.externals.push("pino-pretty", "lokijs", "encoding")
		return config
	}
}