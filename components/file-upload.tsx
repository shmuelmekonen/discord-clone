"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";

import { toast } from "sonner";
import { ALLOWED_IMAGE_TYPES } from "@/lib/constants";

interface FileUploadProps {
  onChange: (url?: string, fileType?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
  fileType?: string;
}

export const FileUpload = ({
  onChange,
  value,
  endpoint,
  fileType,
}: FileUploadProps) => {
  const fileExtension = value?.split(".").pop()?.toLowerCase();

  const isPDF =
    (fileType === "application/pdf" || fileExtension === "pdf") && value;
  const isImage =
    (fileType?.startsWith("image/") ||
      (fileExtension && ALLOWED_IMAGE_TYPES.includes(fileExtension))) &&
    value;
  if (value && isImage) {
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

  if (value && isPDF) {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-input border border-indigo-200 dark:border-indigo-800">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline break-all"
        >
          PDF File
        </a>
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
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
        const file = res?.[0];
        onChange(file.url, file.type);
      }}
      onUploadError={(error: Error) => {
        toast.error(`Upload failed: ${error.message}`);
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
