import { colors } from "./constants.ts";
import { env, response } from "./helper.ts";
import { route, exportEnv } from "./lib.ts";
import { dataHandler, indexHandler, listUserHandler, registerHandler, resetHandler } from "./handler.ts";

exportEnv();
const port = parseInt(env("PORT") ?? "3000");
export const db = await Deno.openKv(Deno.env.get("DATABASE"));

Deno.serve({ port }, (_req) => {
  if (route(_req, "GET", "/")) return indexHandler();
  if (route(_req, "GET", "/data")) return dataHandler();
  if (route(_req, "POST", "/register")) return registerHandler(_req);
  if (route(_req, "POST", "/reset")) return resetHandler();
  if (route(_req, "GET", "/listuser")) return listUserHandler();

  if (env("DEBUG") != "false") {
    console.debug(
      `${colors.red}${new Date().toLocaleString().replace(" ", "")} | ${
        _req.method
      }: ${new URL(_req.url).pathname} Not Found`
    );
  }
  return response("path not found", { status: 400 });
});
