import pino from "pino";
import { createHandler as debugLog } from "hono-pino/debug-log";
import { AppEnv } from "./types";

export type Logger = Pick<
  pino.Logger,
  "info" | "warn" | "error" | "bindings" | "debug" | "trace"
> & {
  assign: (obj: pino.Bindings) => void;
  setMsg: (msg: string) => void;
};

export const getLogger = (env: AppEnv["Bindings"]): Logger => {
  const pinoLogger = pino({
    browser: {
      asObject: true,
      write:
        env.ENVIRONMENT === "development"
          ? debugLog({
              normalLogFormat: "[{time}] {levelLabel} {msg} {bindings}",
            })
          : env.ENVIRONMENT === "test"
            ? () => {} // No-op in test mode
            : undefined,
    },
    level: env.ENVIRONMENT === "test" ? "silent" : "info",
  });

  let currentLogger = pinoLogger;
  let accumulatedBindings: pino.Bindings = {};

  const assignFn = (obj: pino.Bindings) => {
    accumulatedBindings = { ...accumulatedBindings, ...obj };
    currentLogger = currentLogger.child(obj);
    Object.assign(loggerWithAssign, currentLogger, {
      assign: assignFn,
      bindings: bindingsFn,
      setMsg: setMsgFn,
    });
  };

  const bindingsFn = () => accumulatedBindings;

  const setMsgFn = (msg: string) => {
    assignFn({ msg });
  };

  const loggerWithAssign: Logger = {
    ...pinoLogger,
    assign: assignFn,
    bindings: bindingsFn,
    setMsg: setMsgFn,
  } as Logger;

  return loggerWithAssign;
};
