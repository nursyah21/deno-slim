import { colors } from "./constants.ts";
import { env, envNum, response } from "./helper.ts";
import { route, exportEnv } from "./lib.ts";
import * as handler from "./handler.ts";

exportEnv();
const port = envNum("PORT");

export const db = await Deno.openKv(env("DATABASE"));

Deno.serve({ port }, (_req) => {
  if (route(_req, "GET", "/")) {
    return handler.index();
  }
  if (route(_req, "GET", "/data")) {
    return handler.data();
  }
  if (route(_req, "POST", "/register")) {
    return handler.register(_req);
  }
  if (route(_req, "POST", "/reset")) {
    return handler.reset();
  }  
  if (route(_req, "GET", "/listuser")) {
    return handler.reset();
  }

  if (env("DEBUG") == "true") {
    console.debug(
      `${colors.red}${new Date().toLocaleString().replace(" ", "")} | ${_req.method
      }: ${new URL(_req.url).pathname} Not Found`
    );
  }
  return response("path not found", { status: 400 });
});
