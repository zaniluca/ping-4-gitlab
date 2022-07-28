import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";

const generateUniqueHook = () => {
  return process.env.NODE_ENV === "test"
    ? "test"
    : uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        length: 2,
        separator: "_",
      });
};

export default generateUniqueHook;
