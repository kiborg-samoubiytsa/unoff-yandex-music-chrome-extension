import { IArtist } from "../types/types";

export const concatArtistNames = ([...others]: IArtist[]) => {
  const concatedNames = others.reduce(
    (acc, curr) => (acc == "" ? acc + curr.name : acc + ", " + curr.name),
    ""
  );
  if (others.length > 1) {
    return concatedNames;
  }
  if (others.length == 0) {
    return;
  } else return others[0].name;
};
