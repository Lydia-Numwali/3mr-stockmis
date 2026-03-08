"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";

const NotFound = () => {
  const t = useTranslations("notFound");

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-blue-100 via-white to-blue-50 overflow-hidden">
      {/* Animated background bubbles/icons */}
      <Icon
        icon="tabler:search-off"
        className="absolute left-10 top-10 text-blue-300 text-[8rem] animate-float-slow z-0 opacity-20"
      />
      <Icon
        icon="fluent:question-circle-32-regular"
        className="absolute right-10 top-32 text-blue-400 text-[10rem] animate-float z-0 opacity-10"
      />
      <Icon
        icon="material-symbols:sentiment-dissatisfied-outline"
        className="absolute bottom-10 left-20 text-yellow-400 text-[7rem] animate-pulse-slow z-0 opacity-10"
      />
      <Icon
        icon="tabler:bug-off"
        className="absolute bottom-20 right-10 text-pink-300 text-[9rem] animate-float z-0 opacity-20"
      />

      {/* Main content */}
      <div className="z-10 text-center max-w-2xl">
        <h1 className="text-[6rem] font-extrabold text-mainBlue-700 leading-none drop-shadow-md">
          {t("title")}
        </h1>
        <p className="text-xl text-gray-600 mt-4">{t("message")}</p>

        <Link
          href="/"
          className="mt-8 inline-block px-6 py-3 text-lg font-semibold text-white bg-[#001526] hover:bg-[#001526]/80 transition-colors rounded-md shadow-xl"
        >
          {t("button")}
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
