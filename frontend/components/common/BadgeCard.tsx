"use client";

import { QRCodeCanvas } from "qrcode.react";
import Barcode from "react-barcode";
import BadgeBackground from "./BadgeBackground";

interface BadgeCardProps {
  name: string;
  position: string;
  phone: string;
  joinDate: string;
  id: string;
  codeType?: "qr" | "barcode";
  type?: "visitor" | "employee";
  qrCodeValue?: string;
  expiresAt?: string;
  // Theme colors
  primaryColor?: string; 
  backgroundColor?: string;
  cardBackgroundColor?: string;
  logo?: string;
}

const BadgeCard: React.FC<BadgeCardProps> = ({
  name,
  position,
  phone,
  joinDate,
  id,
  codeType,
  type = "visitor",
  qrCodeValue,
  expiresAt,
  primaryColor = "#001526",
  backgroundColor = "#054163",
  cardBackgroundColor = "#fff",
  logo,
}) => {
  // Check if qrCodeValue is a base64 image
  const isBase64Image = qrCodeValue?.startsWith("data:image");

  return (
    <div
      className={`w-[450px] ${
        codeType === "qr" ? "h-[600px]" : "h-[580px]"
      } flex flex-col gap-3 pb-7 items-center justify-start relative shadow-2xl rounded-lg overflow-hidden`}
      style={{
        backgroundColor: cardBackgroundColor,
        border: "none",
        outline: "none",
      }}
    >
      <BadgeBackground
        backgroundColor={backgroundColor}
        width={450}
        logo={logo}
      />
      <div className="text-center mt-10">
        <h1 className="text-2xl min-w-fit font-medium" style={{ color: primaryColor }}>
          {name}
        </h1>
        <p className="text-lg font-bold" style={{ color: primaryColor }}>
          {position}
        </p>
      </div>

      <div className="w-full px-[5%]">
        {/* content */}
        <div className="text-sm mb-4">
          <p className="mb-1">
            <strong style={{ color: primaryColor }}>
              ID: <span style={{ color: primaryColor }}>{id}</span>
            </strong>
          </p>
          <p className="mb-1">
            <strong style={{ color: primaryColor }}>
              Join Date: <span style={{ color: primaryColor }}>{joinDate}</span>
            </strong>
          </p>
          {type === "visitor" && expiresAt && (
            <p className="mb-1">
              <strong style={{ color: primaryColor }}>
                Expires:{" "}
                <span style={{ color: primaryColor }}>{expiresAt}</span>
              </strong>
            </p>
          )}
          <p className="mb-1">
            <strong style={{ color: primaryColor }}>
              Phone: <span style={{ color: primaryColor }}>{phone}</span>
            </strong>
          </p>
        </div>
        {/* content */}

        {/* code */}
        {codeType === "qr" && (
          <div className="flex items-center justify-center">
            {isBase64Image ? (
              <img
                src={qrCodeValue}
                alt="QR Code"
                width={180}
                height={180}
                style={{ objectFit: "contain" }}
              />
            ) : (
              <QRCodeCanvas
                value={qrCodeValue || `${type.toUpperCase()}-${id}`}
                size={180}
                fgColor={primaryColor}
                bgColor={cardBackgroundColor}
              />
            )}
          </div>
        )}
        {codeType === "barcode" && (
          <div className="mt-4 flex justify-center">
            <Barcode
              value={id}
              height={40}
              lineColor={primaryColor}
              background={cardBackgroundColor}
            />
          </div>
        )}
        {/* code */}
      </div>
    </div>
  );
};

export default BadgeCard;
