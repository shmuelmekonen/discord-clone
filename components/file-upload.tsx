"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";

export const FileUpload = ({ onChange, value, endpoint }: any) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Upload"
          className="rounded-full object-cover"
        />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        // וודא שה-URL נשלח בצורה נקייה
        console.log("Upload finished! URL:", res?.[0].url); // בדוק אם זה מודפס בדפדפן
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        alert(`ERROR! ${error.message}`); // זה יקפיץ חלונית אם יש שגיאה סמויה
        console.error(error);
      }}
      appearance={{
        container:
          "border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition cursor-pointer",
        button:
          "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition ut-ready:bg-blue-600 ut-uploading:bg-blue-400 ut-uploading:cursor-not-allowed",
        label: "text-gray-600 font-medium",
        allowedContent: "text-gray-400 text-xs",
      }}
    />
  );
};
