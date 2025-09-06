export class EncryptionEngine {
  private async generateKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
      "deriveBits",
      "deriveKey",
    ])

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"],
    )
  }

  async encryptWithPassword(file: File, password: string): Promise<Blob> {
    try {
      // Generate random salt and IV
      const salt = crypto.getRandomValues(new Uint8Array(16))
      const iv = crypto.getRandomValues(new Uint8Array(12))

      // Derive key from password
      const key = await this.generateKey(password, salt)

      // Read file as array buffer
      const fileBuffer = await file.arrayBuffer()

      // Encrypt the file
      const encryptedData = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, fileBuffer)

      // Create metadata
      const metadata = {
        filename: file.name,
        size: file.size,
        type: file.type,
        encrypted: true,
        method: "password",
      }

      const metadataBytes = new TextEncoder().encode(JSON.stringify(metadata))
      const metadataLength = new Uint32Array([metadataBytes.length])

      // Combine salt + iv + metadata length + metadata + encrypted data
      const result = new Uint8Array(
        salt.length +
          iv.length +
          4 + // metadata length (4 bytes)
          metadataBytes.length +
          encryptedData.byteLength,
      )

      let offset = 0
      result.set(salt, offset)
      offset += salt.length
      result.set(iv, offset)
      offset += iv.length
      result.set(new Uint8Array(metadataLength.buffer), offset)
      offset += 4
      result.set(metadataBytes, offset)
      offset += metadataBytes.length
      result.set(new Uint8Array(encryptedData), offset)

      return new Blob([result], { type: "application/octet-stream" })
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async decryptWithPassword(file: File, password: string): Promise<Blob> {
    try {
      const fileBuffer = await file.arrayBuffer()
      const data = new Uint8Array(fileBuffer)

      // Extract salt (first 16 bytes)
      const salt = data.slice(0, 16)

      // Extract IV (next 12 bytes)
      const iv = data.slice(16, 28)

      // Extract metadata length (next 4 bytes)
      const metadataLengthBytes = data.slice(28, 32)
      const metadataLength = new Uint32Array(metadataLengthBytes.buffer)[0]

      // Extract metadata
      const metadataBytes = data.slice(32, 32 + metadataLength)
      const metadata = JSON.parse(new TextDecoder().decode(metadataBytes))

      // Verify this is an encrypted file
      if (!metadata.encrypted || metadata.method !== "password") {
        throw new Error("Invalid encrypted file format")
      }

      // Extract encrypted data
      const encryptedData = data.slice(32 + metadataLength)

      // Derive key from password
      const key = await this.generateKey(password, salt)

      // Decrypt the data
      const decryptedData = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, encryptedData)

      return new Blob([decryptedData], { type: metadata.type })
    } catch (error) {
      if (error instanceof Error && error.name === "OperationError") {
        throw new Error("Decryption failed: Invalid password or corrupted file")
      }
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async encryptWithPGP(file: File, pgpKey: string): Promise<Blob> {
    // For now, we'll implement a placeholder that uses the same AES encryption
    // In a real implementation, you would use a library like OpenPGP.js
    console.warn("PGP encryption not fully implemented - using password-based encryption as fallback")

    // Use a derived key from the PGP key content as a password
    const hashedKey = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pgpKey))
    const keyArray = new Uint8Array(hashedKey)
    const password = Array.from(keyArray)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    return this.encryptWithPassword(file, password)
  }

  async decryptWithPGP(file: File, pgpKey: string): Promise<Blob> {
    // For now, we'll implement a placeholder that uses the same AES decryption
    // In a real implementation, you would use a library like OpenPGP.js
    console.warn("PGP decryption not fully implemented - using password-based decryption as fallback")

    // Use a derived key from the PGP key content as a password
    const hashedKey = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pgpKey))
    const keyArray = new Uint8Array(hashedKey)
    const password = Array.from(keyArray)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    return this.decryptWithPassword(file, password)
  }
}
