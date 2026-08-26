interface ServerConfig {
  port: number;
  environment: "development" | "production" | "test";
}
const config: ServerConfig = {
  port: 5000,
  environment: "development",
};

function startServer(cfg: ServerConfig): void {
  console.log(`[Word Imposter Backend] Initialized on port ${cfg.port} in ${cfg.environment} mode.`);
}

startServer(config);