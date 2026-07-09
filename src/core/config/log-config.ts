import { pino } from "pino";

export const logConfig = {
  level: process.env.LOG_LEVEL || "info",
};

export const log = pino({
  level: logConfig.level,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});
