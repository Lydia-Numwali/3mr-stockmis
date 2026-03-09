import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import QRCode from "qrcode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const displayNumbers = (num: number): string => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const displayFileIcon = (fileType: string): string => {
  const fileTypeWithIcon = {
    docx: 'vscode-icons:file-type-word',
    pdf: 'vscode-icons:file-type-pdf2',
    xlsx: 'vscode-icons:file-type-excel',
    jpg: 'vscode-icons:file-type-image',
    png: 'vscode-icons:file-type-image',
    txt: 'vscode-icons:default-file',
  };
  return (
    fileTypeWithIcon[fileType as keyof typeof fileTypeWithIcon] ??
    'vscode-icons:default-file'
  );
};

export const getCurrentLocale = (): string => {
  const pathLocale =
    typeof window !== 'undefined'
      ? window.location.pathname.split('/')[1]
      : 'en';

  return pathLocale || 'en';
};

 export const formatValue = (value: number) => {
    // Format number with comma separators (e.g., 5500 instead of 5.5k)
    return value?.toLocaleString();
  };


export function formatUTCISOString(isoString:string) {
  const dateTimeParts = isoString.split("T");
  if (dateTimeParts.length !== 2) return "";

  const date = dateTimeParts[0]; // e.g. "2025-06-28"
  const time = dateTimeParts[1].substring(0, 5); // e.g. "09:00"

  const [year, month, day] = date.split("-");
  const [hourStr, minute] = time.split(":");

  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hour = hour % 12 || 12; // 0 → 12

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthStr = monthNames[parseInt(month, 10) - 1];

  return `${monthStr} ${day}, ${year} ${hour}:${minute} ${ampm}`;
}


export function extractLatLngFromGoogleMapsUrl(url: string): { lat: number; lng: number } | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  try {
    const patterns = [
      /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
      /@(-?\d+\.?\d*),(-?\d+\.?\d*),\d+/,
      /place\/[^@]*@(-?\d+\.?\d*),(-?\d+\.?\d*)/,
      /(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/,
      /[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
      /[?&]center=(-?\d+\.?\d*),(-?\d+\.?\d*)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return { lat, lng };
        }
      }
    }

  
    if (url.includes('goo.gl') || url.includes('maps.app.goo.gl')) {
      console.warn('Shortened Google Maps URLs require server-side processing to extract coordinates');
      return null;
    }

    return null;
  } catch (error) {
    console.error('Error parsing Google Maps URL:', error);
    return null;
  }
}





export function isGoogleMapsUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  const googleMapsPatterns = [
    /maps\.google\.com/,
    /www\.google\.com\/maps/,
    /maps\.app\.goo\.gl/,
    /goo\.gl\/maps/
  ];
  
  return googleMapsPatterns.some(pattern => pattern.test(url));
}


export async function generateBadgeQrCode(badgeId: string): Promise<string> {
  try {
    const qrData = `${badgeId}`; 
    return await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: "H",
      type: "image/png",
      margin: 2,
      width: 300,
    });
  } catch (err) {
    console.error("Error generating QR Code:", err);
    throw err;
  }
}




