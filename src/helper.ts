import { createHeader } from "./lib.ts";

const headers = createHeader();
export const response = (body?: BodyInit | null, init?: ResponseInit) =>
  new Response(body, { headers, ...init });

export const responseJson = (data: unknown, init?: ResponseInit) =>
  Response.json(data, { headers, ...init });

export const env = (name: string, valueDefault: string = "") =>
  Deno.env.get(name) ?? valueDefault;

export const envNum = (name: string, valueDefault: string = "0") => {
  const res = parseInt(env(name, valueDefault));
  return isNaN(res) ? 0 : res;
};

export const getExpired = (duration: number = 3600 * 24 * 7) =>
  Math.floor(Date.now() / 1000 + duration);
