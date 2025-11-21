"use client";
import React, { useCallback, useRef, useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { uploadPDF } from "@/actions/uploadPDF";
import { CloudUpload } from "lucide-react";
import { Button } from "./ui/button";

function PDFDropZone() {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uplodedFiles, setUplodedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Setup sensors for drag detection
  const sensors = useSensors(useSensor(PointerSensor));

  const handleUplode = useCallback(
    async (files: FileList | File[]) => {
      if (!user) {
        alert("Please sign in to uplode");
        return;
      }

      const fileArray = Array.from(files);


      const pdfFiles = fileArray.filter(
        (file) =>
          file.type === "application/pdf" ||
          file.name.toLocaleLowerCase().endsWith(".pdf"),
      );

     if (pdfFiles.length !== fileArray.length) {
      alert("Please drop only PDF files");
      return;
    }

      setIsUploading(true);

      try {
        const newUplodeFiles: string[] = [];

        for (const file of pdfFiles) {
          const formData = new FormData();
          formData.append("file", file);

          const result = await uploadPDF(formData);

          if (!result.success) {
            throw new Error(result.error);
          }

          newUplodeFiles.push(file.name);
        }
        setUplodedFiles((prev) => [...prev, ...newUplodeFiles]);

        //Clear uploded files list afetr 5 second
        setTimeout(() => {
          setUplodedFiles([]);
        }, 5000);

        router.push("/receipts");
      } catch (error) {
        console.error("Upload failed", error);
        alert(
          `uplode failed: ${error instanceof Error ? error.message : "Unknown message"}`,
        );
      } finally {
        setIsUploading(false);
      }
    },
    [user, router],
  );

  //Handle file drop via native browser events for better PDF support
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDraggingOver(false);

      if (!user) {
        alert("Please sign in to uplode files");
        return;
      }

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleUplode(e.dataTransfer.files);
      }
    },
    [user, handleUplode],
  );

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        handleUplode(e.target.files);
      }
    },
    [handleUplode],
  );
  const isUserSignedIn = !!user;
  const canUpload = true;
  return (
    <DndContext sensors={sensors}>
      <div className="w-full max-w-md mx-auto">
        <div
          onDragOver={canUpload ? handleDragOver : undefined}
          onDragLeave={canUpload ? handleDragLeave : undefined}
          onDrop={canUpload ? handleDrop : (e) => e.preventDefault()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDraggingOver ? "border-blu-500 bg-blue-50" : "border-gray-300"} ${!canUpload ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 borde-t-2 border-b-2 border-blue-500 mb-2"></div>
              <p>Uploading</p>
            </div>
          ) : !isUserSignedIn ? (
            <>
              <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Please sign in to upload files
              </p>
            </>
          ) : (
            <>
              <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag and Drop PDF file here, or click to select files
              </p>

              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf, .pdf"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
              />

              <Button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                // disabled={}
                onClick={triggerFileInput}
              >Select Files</Button>
            </>
          )}
        </div>
      </div>
    </DndContext>
  );
}

export default PDFDropZone;
