import { env } from "cloudflare:workers";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";

const generateUniqueHook = () => {
  return env.ENVIRONMENT === "test"
    ? "test"
    : uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        length: 2,
        separator: "_",
      });
};

export default generateUniqueHook;
