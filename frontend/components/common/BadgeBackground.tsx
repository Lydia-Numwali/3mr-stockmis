"use client";

import Image from "next/image";

interface BadgeBackgroundProps {
  backgroundColor: string;
  width?: number;
  logo?: string;
}

const BadgeBackground: React.FC<BadgeBackgroundProps> = ({
  backgroundColor,
  logo,
  width
}) => {
  // Calculate darker shade for gradient
  const getDarkerShade = (color: string) => {
    // Remove the # if present
    const hex = color.replace("#", "");

    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Make it 40% darker
    const darkerR = Math.floor(r * 0.6);
    const darkerG = Math.floor(g * 0.6);
    const darkerB = Math.floor(b * 0.6);

    // Convert back to hex
    return `#${darkerR.toString(16).padStart(2, "0")}${darkerG
      .toString(16)
      .padStart(2, "0")}${darkerB.toString(16).padStart(2, "0")}`;
  };

  const darkerColor = getDarkerShade(backgroundColor);

  return (
    <div className="relative mb-10">
      <svg
        height={130}
        width={width}
        viewBox="0 0 400 110"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0H400V80C400 80 350 110 200 110C50 110 0 80 0 80V0Z"
          fill="url(#paint0_linear)"
        />
        <defs>
          <linearGradient
            id="paint0_linear"
            x1="0"
            y1="0"
            x2="400"
            y2="110"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={backgroundColor} />
            <stop offset="1" stopColor={darkerColor} />
          </linearGradient>
        </defs>
      </svg>
      {logo && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-5">
          <div className="rounded-full border-2 border-white overflow-hidden">
          <Image
            src={`${logo}`}
            alt="Institution Logo"
            width={96}
            height={96}
            className="w-24 h-24 object-contain"
          />
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeBackground;
