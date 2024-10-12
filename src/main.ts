import { env, envNum } from "./helper.ts";
import { exportEnv, Route } from "./lib.ts";
import * as handler from "./handler.ts";

exportEnv();
const port = envNum("PORT");

export const db = await Deno.openKv(env("DATABASE"));


Deno.serve({ port }, (_req) => {
  const router = new Route(_req)

  if (router.get("/")) {
    return handler.index()
  }
  if (router.get("/data")) {
    return handler.data()
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



  return router.notfound()
});