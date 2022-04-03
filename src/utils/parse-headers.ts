import { Headers } from "./types";

export const parseHeaders = (headers: string): Headers => {
  let json: Record<string, string> = {};
  const sanitized = headers
    .trimEnd()
    .replace(/[']+/g, "")
    .split("\n")
    .filter((_e, i) => i % 2 !== 0);

  sanitized.map((e) => {
    let elements = e.split(": ");
    if (elements.length > 2) return;
    const key = elements[0].toLowerCase().trim();
    json[key] = elements[1];
  });

  return json as Headers;
};
