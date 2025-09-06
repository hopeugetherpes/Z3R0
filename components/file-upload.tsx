"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, File, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
}

export function FileUpload({ onFileSelect, selectedFile }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0])
      }
    },
    [onFileSelect],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: undefined, // Accept all file types
  })

  const clearFile = () => {
    onFileSelect(null as any)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (selectedFile) {
    return (
      <div className="border border-gray-600 rounded-lg p-4 bg-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <File className="h-8 w-8 text-[#32709c]" />
            <div>
              <p className="font-medium text-white">{selectedFile.name}</p>
              <p className="text-sm text-gray-300">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={clearFile} className="text-gray-300 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? "border-[#32709c] bg-[#32709c]/10" : "border-gray-600 hover:border-[#32709c]/50 hover:bg-gray-800/30"}
      `}
    >
      <input {...getInputProps()} />
      <Upload className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      {isDragActive ? (
        <p className="text-[#32709c] font-medium">Drop the file here...</p>
      ) : (
        <div>
          <p className="text-white font-medium mb-2">Drag & drop a file here, or click to select</p>
          <p className="text-gray-300 text-sm">Any file type supported • No size limit</p>
        </div>
      )}
    </div>
  )
}
