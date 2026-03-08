import Image from "next/image";
import React from "react";

const BadgesTerms = () => {
  return (
    <div className="flex flex-col overflow-hidden justify-center items-center gap-4 bg-[#ffff] relative z-10">
      <Image
        src={"/svgs/lt.svg"}
        alt="svg"
        className="absolute -top-3 left-0 -z-20"
        width={200}
        height={90}
      />  
      <h1 className="text-3xl font-bold text-primary-blue py-4">STOCK MIS</h1>

      <div>
        <p className="font-bold text-primary-blue py-2">Terms And Conditions :</p>
        <ul className="space-y-1 max-md:px-7">
          <li className="flex items-start gap-2 text-[#081129] text-base">
            <span className="text-primary-blue text-4xl font-bold leading-none">•</span>
            <span className="max-w-[280px] max-md:max-w-[260px] line-clamp-3">
              All visitors must check in and out at the reception desk.
            </span>
          </li>
          <li className="flex items-start gap-2 text-[#081129] text-base">
            <span className="text-primary-blue text-4xl font-bold leading-none">•</span>
            <span className="max-w-[280px] max-md:max-w-[260px] line-clamp-3">
              The host institution is responsible for the visitor&apos;s conduct
              during their stay.
            </span>
          </li>
        </ul>
      </div>

      <hr className="border border-primary-blue w-[80%]" />

      <div className="font-bold">
        <p className="text-primary-blue py-2">Contact Us:</p>
        <p>
          <span className="text-primary-blue">Phone:</span>
          <span className="text-[#081129]">+000 0000 000 000</span>
        </p>
        <p>
          <span className="text-primary-blue">Email:</span>
          <span className="text-[#081129]">company@mail.com</span>
        </p>
        <p className="text-[#081129] font-normal">
          721 Broadway, NewYork, Ny 10003, USA
        </p>
      </div>

      <Image
        src={"/svgs/rb.svg"}
        alt="svg"
        className="absolute -bottom-8 right-0 -z-20"
        width={200}
        height={90}
      />
    </div>
  );
};

export default BadgesTerms;
