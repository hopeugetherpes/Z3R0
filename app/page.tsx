"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileUpload } from "@/components/file-upload"
import { EncryptionEngine } from "@/lib/encryption"
import {
  Shield,
  Lock,
  Unlock,
  Download,
  AlertCircle,
  CheckCircle,
  FileText,
  Infinity,
  Code,
  Cpu,
  Github,
  Eye,
  EyeOff,
  UserX,
  Database,
  Clock,
} from "lucide-react"
import Image from "next/image"

export default function EncryptionTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [password, setPassword] = useState("")
  const [pgpKey, setPgpKey] = useState("")
  const [encryptionMethod, setEncryptionMethod] = useState<"password" | "pgp">("password")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [processedFile, setProcessedFile] = useState<{ blob: Blob; filename: string } | null>(null)
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt")
  const [showPassword, setShowPassword] = useState(false)

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 14
    const hasNumber = /\d/.test(password)
    const hasUpperCase = /[A-Z]/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return {
      isValid: hasMinLength && hasNumber && hasUpperCase && hasSpecialChar,
      hasMinLength,
      hasNumber,
      hasUpperCase,
      hasSpecialChar,
    }
  }

  const calculateBruteForceTime = (password: string) => {
    if (!passwordValidation.isValid) return null

    // Character set sizes
    const lowercase = 26
    const uppercase = 26
    const numbers = 10
    const specialChars = 32

    const charsetSize = lowercase + uppercase + numbers + specialChars // 94 characters
    const combinations = Math.pow(charsetSize, password.length)

    // Assume 1 billion attempts per second (modern hardware)
    const attemptsPerSecond = 1e9
    const secondsToBreak = combinations / (2 * attemptsPerSecond) // Average case

    const years = secondsToBreak / (365.25 * 24 * 3600)

    if (years > 1e12) return "Quintillions of years"
    if (years > 1e9) return `${Math.round(years / 1e9)} billion years`
    if (years > 1e6) return `${Math.round(years / 1e6)} million years`
    if (years > 1000) return `${Math.round(years / 1000)} thousand years`
    if (years > 1) return `${Math.round(years)} years`

    return "Less than a year"
  }

  const passwordValidation = validatePassword(password)
  const bruteForceTime = calculateBruteForceTime(password)

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file)
    setResult(null)
    setProcessedFile(null)
  }, [])

  const handleEncrypt = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setProgress(0)
    setResult(null)

    try {
      const engine = new EncryptionEngine()

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      let encryptedBlob: Blob

      if (encryptionMethod === "password") {
        if (!password) {
          throw new Error("Password is required")
        }
        encryptedBlob = await engine.encryptWithPassword(selectedFile, password)
      } else {
        if (!pgpKey) {
          throw new Error("PGP key is required")
        }
        encryptedBlob = await engine.encryptWithPGP(selectedFile, pgpKey)
      }

      clearInterval(progressInterval)
      setProgress(100)

      const encryptedFilename = `${selectedFile.name}.encrypted`
      setProcessedFile({ blob: encryptedBlob, filename: encryptedFilename })
      setResult({ type: "success", message: "File encrypted successfully!" })
    } catch (error) {
      setResult({
        type: "error",
        message: error instanceof Error ? error.message : "Encryption failed",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDecrypt = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setProgress(0)
    setResult(null)

    try {
      const engine = new EncryptionEngine()

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      let decryptedBlob: Blob

      if (encryptionMethod === "password") {
        if (!password) {
          throw new Error("Password is required")
        }
        decryptedBlob = await engine.decryptWithPassword(selectedFile, password)
      } else {
        if (!pgpKey) {
          throw new Error("PGP key is required")
        }
        decryptedBlob = await engine.decryptWithPGP(selectedFile, pgpKey)
      }

      clearInterval(progressInterval)
      setProgress(100)

      const decryptedFilename = selectedFile.name.replace(".encrypted", "")
      setProcessedFile({ blob: decryptedBlob, filename: decryptedFilename })
      setResult({ type: "success", message: "File decrypted successfully!" })
    } catch (error) {
      setResult({
        type: "error",
        message: error instanceof Error ? error.message : "Decryption failed",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!processedFile) return

    const url = URL.createObjectURL(processedFile.blob)
    const a = document.createElement("a")
    a.href = url
    a.download = processedFile.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/logo-z3r0.png" alt="Z3R0 Logo" width={32} height={32} className="invert" />
              <h1 className="text-2xl font-bold text-white">Z3R0</h1>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/hopeugetherpes/Z3R0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-[#32709c] hover:text-[#2a5f87] transition-colors"
              >
                <Github className="h-5 w-5 fill-current" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 bg-black/30 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex justify-center mb-6">
              <Image src="/logo-z3r0-main.png" alt="Z3R0 Main Logo" width={80} height={80} className="invert" />
            </div>
            <h2 className="text-3xl font-bold text-gray-100 mb-4 drop-shadow-2xl">Secure File Encryption</h2>
            <p className="text-gray-100 text-lg drop-shadow-xl mb-6">
              Encrypt and decrypt any file locally in your browser. No size or format limitation. No data ever leaves
              your device.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant={mode === "encrypt" ? "default" : "outline"}
                onClick={() => setMode("encrypt")}
                className={
                  mode === "encrypt"
                    ? "bg-[#32709c] hover:bg-[#2a5f87] text-white"
                    : "border-[#32709c] text-[#32709c] hover:bg-[#32709c] hover:text-white"
                }
              >
                <Lock className="h-4 w-4 mr-2" />
                Encrypt
              </Button>
              <Button
                variant={mode === "decrypt" ? "default" : "outline"}
                onClick={() => setMode("decrypt")}
                className={
                  mode === "decrypt"
                    ? "bg-[#32709c] hover:bg-[#2a5f87] text-white"
                    : "border-[#32709c] text-[#32709c] hover:bg-[#32709c] hover:text-white"
                }
              >
                <Unlock className="h-4 w-4 mr-2" />
                Decrypt
              </Button>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* File Upload Section */}
            <Card className="bg-gray-900/70 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Lock className="h-5 w-5 text-[#32709c]" />
                  Select File
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Choose any file to {mode}. All processing happens locally.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload onFileSelect={handleFileSelect} selectedFile={selectedFile} />
              </CardContent>
            </Card>

            {/* Encryption Method Section */}
            <Card className="bg-gray-900/70 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5 text-[#32709c]" />
                  {mode === "encrypt" ? "Encryption" : "Decryption"} Method
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Choose between password-based or PGP key {mode}ion.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={encryptionMethod}
                  onValueChange={(value) => setEncryptionMethod(value as "password" | "pgp")}
                >
                  <TabsList className="grid w-full grid-cols-2 bg-gray-800/80 border-gray-600">
                    <TabsTrigger
                      value="password"
                      className="data-[state=active]:bg-[#32709c] data-[state=active]:text-white text-gray-200 hover:text-white"
                    >
                      Password
                    </TabsTrigger>
                    <TabsTrigger
                      value="pgp"
                      className="data-[state=active]:bg-[#32709c] data-[state=active]:text-white text-gray-200 hover:text-white"
                    >
                      PGP Key
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="password" className="space-y-4">
                    <div>
                      <Label htmlFor="password" className="text-gray-200">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter a strong password (min 14 chars)"
                          className={`mt-1 bg-gray-800/80 text-white placeholder:text-gray-400 pr-10 ${
                            !password
                              ? "border-[#32709c] focus:border-[#32709c]"
                              : passwordValidation.isValid
                                ? "border-green-500 focus:border-green-500"
                                : "border-red-500 focus:border-red-500"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {password && (
                        <div className="mt-2 space-y-1">
                          <div className="text-xs space-y-1">
                            <div
                              className={`flex items-center gap-2 ${passwordValidation.hasMinLength ? "text-green-400" : "text-red-400"}`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${passwordValidation.hasMinLength ? "bg-green-400" : "bg-red-400"}`}
                              />
                              At least 14 characters
                            </div>
                            <div
                              className={`flex items-center gap-2 ${passwordValidation.hasNumber ? "text-green-400" : "text-red-400"}`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${passwordValidation.hasNumber ? "bg-green-400" : "bg-red-400"}`}
                              />
                              At least one number
                            </div>
                            <div
                              className={`flex items-center gap-2 ${passwordValidation.hasUpperCase ? "text-green-400" : "text-red-400"}`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${passwordValidation.hasUpperCase ? "bg-green-400" : "bg-red-400"}`}
                              />
                              At least one uppercase letter
                            </div>
                            <div
                              className={`flex items-center gap-2 ${passwordValidation.hasSpecialChar ? "text-green-400" : "text-red-400"}`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${passwordValidation.hasSpecialChar ? "bg-green-400" : "bg-red-400"}`}
                              />
                              At least one special character
                            </div>
                            {passwordValidation.isValid && bruteForceTime && (
                              <div className="flex items-center gap-2 text-green-400 mt-2 pt-2 border-t border-gray-600">
                                <Clock className="w-3 h-3" />
                                <span className="font-medium">Estimated brute force time: {bruteForceTime}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="pgp" className="space-y-4">
                    <div>
                      <Label htmlFor="pgp-key" className="text-gray-200">
                        PGP {mode === "encrypt" ? "Public" : "Private"} Key
                      </Label>
                      <textarea
                        id="pgp-key"
                        value={pgpKey}
                        onChange={(e) => setPgpKey(e.target.value)}
                        placeholder={`-----BEGIN PGP ${mode === "encrypt" ? "PUBLIC" : "PRIVATE"} KEY BLOCK-----`}
                        className="mt-1 w-full h-32 px-3 py-2 border border-gray-600 bg-gray-800/80 text-white placeholder:text-gray-400 rounded-md text-sm resize-none focus:border-[#32709c] focus:outline-none"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Action Button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={mode === "encrypt" ? handleEncrypt : handleDecrypt}
              disabled={
                !selectedFile ||
                isProcessing ||
                (encryptionMethod === "password" && !passwordValidation.isValid) ||
                (encryptionMethod === "pgp" && !pgpKey)
              }
              className="flex items-center gap-2 bg-[#32709c] hover:bg-[#2a5f87] text-white px-8 py-3 text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {mode === "encrypt" ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
              {mode === "encrypt" ? "Encrypt File" : "Decrypt File"}
            </Button>
          </div>

          {/* Features Panel */}
          <div className="mt-8">
            <Card className="bg-gray-900/70 border-gray-700 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs text-gray-300">All File Extensions</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <Infinity className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs text-gray-300">No Size Limitation</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <a href="https://github.com/hopeugetherpes/Z3R0" target="_blank" rel="noopener noreferrer">
                      <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                        <Code className="h-4 w-4 text-white" />
                      </div>
                    </a>
                    <a
                      href="https://github.com/hopeugetherpes/Z3R0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-300 underline hover:text-white transition-colors"
                    >
                      Open Source
                    </a>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                      <Cpu className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs text-gray-300">AES-256 Encryption</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                      <UserX className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs text-gray-300">Zero Data Collection</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                      <Database className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs text-gray-300">No Server Storage</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress */}
          {isProcessing && (
            <Card className="mt-8 bg-gray-900/70 border-gray-700 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-200">
                    <span>Processing...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full bg-gray-700 [&>div]:bg-[#32709c]" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {result && (
            <Alert
              className={`mt-8 ${result.type === "error" ? "border-red-400 bg-red-900/30" : "border-[#32709c] bg-[#32709c]/20"} backdrop-blur-sm`}
            >
              {result.type === "error" ? (
                <AlertCircle className="h-4 w-4 text-red-300" />
              ) : (
                <CheckCircle className="h-4 w-4 text-[#32709c]" />
              )}
              <AlertDescription className={result.type === "error" ? "text-red-200" : "text-white"}>
                {result.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Download */}
          {processedFile && (
            <Card className="mt-8 bg-gray-900/70 border-gray-700 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">File Ready</h3>
                    <p className="text-sm text-gray-300">{processedFile.filename}</p>
                  </div>
                  <Button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-[#32709c] hover:bg-[#2a5f87] text-white"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-300">
            <div className="text-center">
              <p className="text-gray-300 mb-2">
                Free and Open Source - By{" "}
                <a
                  href="https://anatole.co"
                  className="font-bold text-[#32709c] hover:text-[#2a5f87] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anatole.co
                </a>
              </p>
              <p className="text-gray-300">
                <a
                  href="https://creativecommons.org/public-domain/cc0/"
                  className="text-[#32709c] hover:text-[#2a5f87] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CC0
                </a>{" "}
                Public Domain - No Copyright Required
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
