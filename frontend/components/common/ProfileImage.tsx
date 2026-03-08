import { Camera, UserIcon } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

const ProfileImage = ({
  imageUrl,
  onImageChange,
}: {
  imageUrl?: string;
  onImageChange: (file: File) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
    }
  };

  return (
    <div className="relative w-[180px] h-[170px] group overflow-hidden">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="Profile"
          width={180}
          height={170}
          className="rounded-lg object-cover object-center border-2 border-gray-200 w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg border-2 border-gray-200">
          <UserIcon className="text-gray-400 w-12 h-12" />
        </div>
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg"
        onClick={() => fileInputRef.current?.click()}
      >
        <Camera className="w-8 h-8 text-white" />
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};


export default ProfileImage;