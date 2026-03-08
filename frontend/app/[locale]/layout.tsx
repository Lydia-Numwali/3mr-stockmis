import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import { Suspense } from "react";
import LoadingScreen from "@/components/common/loading-screen";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout(props: Props) {
  const awaitedParams = await props.params;
  const locale = awaitedParams.locale;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Suspense fallback={<LoadingScreen />}>
        {props.children}
      </Suspense>
    </NextIntlClientProvider>
  );
}
