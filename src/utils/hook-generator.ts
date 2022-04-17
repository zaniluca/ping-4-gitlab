import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";

const generateUniqueHook = () =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    length: 2,
    separator: "_",
  });

export default generateUniqueHook;
