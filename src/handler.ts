import { env, getExpired, response, responseJson } from "./helper.ts";
import { fetchApi, bodyParser, findDb } from "./lib.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import jwt from "npm:@tsndr/cloudflare-worker-jwt";
import { db } from "./main.ts";

export const indexHandler = () => {
  return response("hi mom");
};

export const resetHandler = async () => {
  const listUser = db.list({ prefix: ["users"] });
  for await (const user of listUser) {
    await db.delete(user.key);
  }
  return response("delete success");
};

export const listUserHandler = async (_req?: Request) => {
  const listUser = db.list({ prefix: ["users"] });
  const data = [];
  for await (const { key, value } of listUser) {
    data.push({ key, value });
  }
  return responseJson(data);
};

export const registerHandler = async (_req: Request) => {
  const body: UserProps = await bodyParser(_req);
  if (!body) {
    return response("json body is required", { status: 400 });
  }
  const { username, password } = body;
  if (!username || !password) {
    return response("username and password is required", { status: 400 });
  }

  const exist = await findDb(db, ["users"], "username", username);
  if (exist) {
    return response("user already exist", { status: 400 });
  }

  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const key = ["users", crypto.randomUUID()];
  const value = {
    username,
    password: hashPassword,
    created_at: Date.now(),
    updated_at: Date.now(),
  };

  await db.set(key, value);

  const token = await jwt.sign(
    { username, exp: getExpired(3600 * 24 * 7) },
    env("JWT_SECRET"),
    {
      algorithm: "HS256",
    }
  );

  return responseJson({ token });
};

export const dataHandler = async () => {
  const { data, error } = await fetchApi(
    "https://raw.githubusercontent.com/mayankchoubey/deno-vs-nodejs/master/getData.json"
  );

  if (error) return response("file not found", { status: 400 });

  return responseJson({ data });
};
