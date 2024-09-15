import { exportEnv, route, _fetch } from "./lib.ts";
exportEnv();

const port = parseInt(Deno.env.get("PORT") ?? "3000");

const index = () => {
  return new Response("hi mom");
};

const data = async () => {
  const { data, error } = await _fetch(
    "https://raw.githubusercontent.com/mayankchoubey/deno-vs-nodejs/master/getData.json"
  );

  if (error) return new Response("file not found", { status: 400 });
  return Response.json({ data });
};

Deno.serve({ port }, (_req) => {
  if (route(_req, "GET", "/")) return index();
  if (route(_req, "GET", "/data")) return data();

  return new Response("path not found", { status: 400 });
});
