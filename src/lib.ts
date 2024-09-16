// deno-lint-ignore-file no-empty ban-ts-comment
import { colors, allowOrigin } from "./constants.ts";

export const bodyParser = async (_req: Request) => {
  try {
    const body = _req.body?.getReader();
    let str = "";
    while (body && true) {
      const { value, done } = await body.read();
      if (done) {
        break;
      }
      str += new TextDecoder().decode(value);
    }
    return JSON.parse(str);
  } catch (_) {
    return null;
  }
};

export const createHeader = (name?: string, value?: string) => {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", allowOrigin);
  if (name && value) {
    headers.set(name, value);
  }
  return headers;
};

export const exportEnv = () => {
  try {
    const envfile = Deno.readTextFileSync(".env");
    envfile.split("\n").forEach((e) => {
      let [key, val] = e.split("=");
      const regex = [/^'(.+?)'$/, /^"(.+?)"$/];
      for (const r of regex) {
        if (r.test(val)) {
          val = val.slice(1, val.length - 1);
        }
      }
      Deno.env.set(key, val);
    });
  } catch (_) {}
};

export const fetchApi = async (link: string, json: boolean = true) => {
  let error = false;
  const data = await fetch(link)
    .then((e) => (json ? e.json() : e.text()))
    .catch((e: ErrorProps) => {
      console.log(e.message);
      error = true;
    });

  return { error, data };
};

export const findDb = async (
  db: Deno.Kv,
  prefix: [string],
  field: string,
  match: string
) => {
  const listUser = db.list({ prefix });
  try {
    for await (const { key, value } of listUser) {
      // @ts-ignore
      if (value[field] === match) {
        return { key, value };
      }
    }
  } catch (_) {}
  return null;
};

export const route = (
  _req: Request,
  method: "GET" | "POST" | "PUT" | "DELETE",
  pathname: string
) => {
  const _pathname = new URL(_req.url).pathname;
  const _method = _req.method;
  if (_pathname === pathname && _method === method) {
    if (Deno.env.get("DEBUG") != "false") {
      console.debug(
        `${colors.yellow}${new Date().toLocaleString().replace(" ", "")} | ${
          colors.green
        }${_method}: ${colors.blue}${_pathname}${colors.reset}`
      );
    }
    return true;
  }

  return false;
};
