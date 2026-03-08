import {COUNTRIES} from "./countries";

export type SelectMenuOption = typeof COUNTRIES[number]
export type CountryCode = SelectMenuOption['value'];