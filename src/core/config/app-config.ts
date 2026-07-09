export const appConfig = {
  env: process.env.APP_ENV || "development",
  name: process.env.APP_NAME || "Maintena",
  version: process.env.APP_VERSION || "1.0.0",
  port: Number(process.env.APP_PORT || 8000),
  baseUrl: process.env.APP_BASE_URL || "http://localhost:8000",
};

export function baseUrl(path: string): string {
  path = path.startsWith("/") ? path : `/${path}`;
  return `${appConfig.baseUrl}${path}`;
}

export function isDevelopment(): boolean {
  return !appConfig.env.includes("prod");
}
