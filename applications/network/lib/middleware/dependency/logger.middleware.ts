import Application from "koa";
import { use } from "@cheeket/koa";

import Context from "../context";
import State from "../state";
import LoggerDependencyInitializer from "./logger.dependency-initializer";
import LoggerToken from "./logger.token";

function logger(token: LoggerToken): Application.Middleware<State, Context> {
  return use(new LoggerDependencyInitializer(token), async (context, next) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const logger = await context.resolve(token.logger);

    try {
      await next();
    } catch (e) {
      const status = e.status ?? e.statusCode ?? 500;
      if (status >= 500 && status < 600) {
        logger.error(e);
      }
      throw e;
    }
  });
}

export default logger;
