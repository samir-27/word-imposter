import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  clientUrl: string;
  isProduction: boolean;
}

function getEnvConfig(): Config {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const isProduction = process.env.NODE_ENV === "production";

  if (isNaN(port)) {
    throw new Error("Invalid configuration: PORT must be a valid number.");
  }

  return {
    port,
    clientUrl,
    isProduction,
  };
}

export const config = getEnvConfig();