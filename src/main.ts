import * as xport from "https://deno.land/x/port@1.0.0/mod.ts";
import { env, envNum } from "./helper.ts";
import { exportEnv, Route } from "./lib.ts";
import * as handler from "./handler.ts";

exportEnv();
let port = envNum("PORT");
let change = await xport.isPortAvailable({ port });
export const db = await Deno.openKv(env("DATABASE"));

while (!change) {
  change = await xport.isPortAvailable({ port });
  port += 1;
}

Deno.serve({ port }, (_req) => {
  const router = new Route(_req);

  if (router.get("/")) {
    return handler.index();
  }
  if (router.get("/data")) {
    return handler.data();
  }
  if (router.post("/register")) {
    return handler.register(_req);
  }
  if (router.post("/reset")) {
    return handler.reset();
  }
  if (router.get("/listuser")) {
    return handler.listUser();
  }

  return router.notfound();
});
