// deno-lint-ignore-file no-empty ban-ts-comment
import { colors, allowOrigin } from "./constants.ts";
import { env, response } from "./helper.ts";

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

    envfile.split('\n').forEach(e => {
      if (e.startsWith('#') || !e) return
      const [key, ..._val] = e.replace("=", " ").split(" ");
      const val = _val.join(" ")

      Deno.env.set(key, val)
    })
  } catch (_) { }
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
  } catch (_) { }
  return null;
};

enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}
export class Route {
  private _req: Request

  constructor(_req: Request) {
    this._req = _req
  }

  private showdebug(showError: boolean = false) {    
    if (env("DEBUG") == "true") {
      const method = this._req.method
      const pathname = new URL(this._req.url).pathname
      const time = new Date().toLocaleString().split(" ")[1]

      if (showError) {
        return console.debug(
          `${colors.red}${time} | ${method}: ${pathname} not found`
        )
      }

      console.debug(
        `${colors.blue}${time} | ${method}: ${pathname}`
      )
    }
  }

  notfound() {
    this.showdebug(true)
    return response("path not found", { status: 400 });
  }

  private abstracroute(path: string, method: Method) {
    const res = (new URL(this._req.url).pathname == path && this._req.method == method)
      ? true
      : false
    if (res) {
      this.showdebug()
    }
    return res
  }

  get(path: string) {
    return this.abstracroute(path, Method.GET)
  }

  post(path: string) {
    return this.abstracroute(path, Method.POST)
  }

  put(path: string) {
    return this.abstracroute(path, Method.PUT)
  }

  delete(path: string) {
    return this.abstracroute(path, Method.DELETE)
  }
}
