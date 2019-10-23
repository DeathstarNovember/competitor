import { Entry } from "../types";

export const sortAscByNumberProp = (array: Entry[], property: keyof Entry) => {
  return array.sort((a, b) => Number(a[property]) - Number(b[property]));
};
export const sortDescByNumberProp = (array: Entry[], property: keyof Entry) => {
  return array.sort((a, b) => Number(b[property]) - Number(a[property]));
};
