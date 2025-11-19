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

      if (pdfFiles.length > 0) {
        alert("Please drop only pdf files");
        return;
      }

      setIsUploading(true);

      try {
        const newUplodeFiles: string[] = [];

        for (const file of pdfFiles) {
          const formData = new FormData();
          formData.append("file", file);

          const result = await UploadPDF(formData);

          if (!result.success) {
            throw new Error(result.error);
          }

          newUplodeFiles.push(file.name);
        }
        setUplodedFiles((prev) => [...prev, newUplodeFiles]);

        //Clear uploded files list afetr 5 second

        setTimeout(() => {
          setUplodeFiles([]);
        }, 5000);
      } catch (error) {
        console.error("Upload failed", error);
        alert(
          `uplode failed: ${error instanceof Error ? error.message : "Unknown message"}`,
        );
      } finally {
        setIsUploading(true);
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

  const canUpload = true;
  return (
    <DndContext sensors={sensors}>
      <div className="w-full max-w-md mx-auto bg-red-500">
        <div
          onDragOver={canUpload ? handleDragOver : undefined}
          onDragLeave={canUpload ? handleDragLeave : undefined}
          onDrop={canUpload ? handleDrop : (e) => e.preventDefault()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDraggingOver ? "border-blu-500 bg-blue-50" : "border-gray-300"} ${!canUpload ? "opacity-70 cursor-not-allowed" : ""}`}
        ></div>
      </div>
    </DndContext>
  );
}

export default PDFDropZone;
