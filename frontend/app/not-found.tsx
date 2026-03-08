"use client";

import { usePathname, redirect } from "next/navigation";

const locales = ["en", "fr", "ki"];
const DEF_LOCALE = "en";

export default function NotFound() {
  const pathName = usePathname();
  const locale = pathName.split("/")[1];
  const finalLocale = locales.includes(locale) ? locale : DEF_LOCALE;
  redirect(`/${finalLocale}/not-found`);
}
