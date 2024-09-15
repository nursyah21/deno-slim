export const colors = {
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

export type ErrorProps = {
  message: string;
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
    // deno-lint-ignore no-empty
  } catch (_) {}
};

export const route = (
  _req: Request,
  method: "GET" | "POST" | "PUT" | "DELETE",
  pathname: string
) => {
  const _pathname = new URL(_req.url).pathname;
  const _method = _req.method;
  if (Deno.env.get("DEBUG") != "false") {
    console.debug(
      `${colors.yellow}${new Date().toLocaleString().replace(" ", "")} | ${
        colors.green
      }${_method}: ${colors.blue}${_pathname}${colors.reset}`
    );
  }

  if (_pathname === pathname && _method === method) {
    return true;
  }
  return false;
};

export const _fetch = async (link: string, json: boolean = true) => {
  let error = false;
  const data = await fetch(link)
    .then((e) => (json ? e.json() : e.text()))
    .catch((e: ErrorProps) => {
      console.log(e.message);
      error = true;
    });

  // if (error) return new Response("file not found", { status: 400 });
  return { error, data };
};
