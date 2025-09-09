# Z3R0 🔒

**A Secure local file encryption tool that works entirely in your browser**

Z3R0 is a modern, privacy-focused file encryption application that allows you to encrypt and decrypt any file type locally in your browser without any data ever leaving your device. Built with security and privacy as core principles.

## 🚀 Purpose

Z3R0 provides AES-256-GCM encryption for any file type, ensuring your sensitive data remains completely private.
Whether you're protecting personal documents, business files, or media content, Z3R0 offers enterprise-level security with consumer-friendly simplicity.

**Key Features:**
- 🔐 **AES-256-GCM Encryption** - Industry grade security using [Web Crypto API](https://www.w3.org/TR/webcrypto-2/)
- 📁 **Universal File Support** - Encrypt any file type (documents, images, videos, etc.)
- 🚫 **No Size Limits** - Handle files of any size without restrictions  
- 🌐 **100% Local Processing** - Zero server communication, complete privacy
- ⚡ **Ultra Fast** - Optimized performance using native browser APIs
- 🔓 **Dual Authentication** - Password-based and PGP key encryption support
- 🎯 **Zero Knowledge** - We never see your files or passwords
- 📱 **Cross-Platform** - Works on any device with a modern browser
- 🆓 **Open Source** - Fully auditable code under [CC0 license](https://creativecommons.org/public-domain/cc0/)

## 📖 Usage

### Getting Started
1. Visit the Z3R0 web application
2. Choose your encryption method (Password or PGP Key)
3. Drag and drop your file or click to select
4. Enter a strong password (minimum 14 characters with numbers, uppercase, and special characters)
5. Click "Encrypt File" to secure your data
6. Download the encrypted file with `.encrypted` extension

### Decryption
1. Select "Decrypt" mode
2. Upload your encrypted `.encrypted` file
3. Enter the same password used for encryption
4. Click "Decrypt File" to restore your original file
5. Download the decrypted file

### Password Requirements
For maximum security, passwords must include:
- ✅ At least 14 characters
- ✅ At least one number
- ✅ At least one uppercase letter  
- ✅ At least one special character

The application provides real-time password strength feedback and brute-force time estimates.

**This estimate is provided for informational purposes.** The most robust protection will always be to choose a long, complex password.

## ⚠️ Limitations

- **Password Recovery**: If you forget your password, your files cannot be recovered. There is no "forgot password" option by design.
- **Browser Compatibility**: Requires a modern browser with Web Crypto API support: [Chromium 37+](https://www.chromium.org/blink/webcrypto/), [Firefox 34+](https://developer.mozilla.org/en-US/docs/Web/API/Crypto), [Safari 7+](https://webkit.org/blog/7790/update-on-web-cryptography/), [Edge 12+](https://learn.microsoft.com/en-us/openspecs/ie_standards/ms-webcrypto/148711f4-0fae-49c4-96a1-9765495e44e3)
- **Memory Usage**: Very large files may consume significant browser memory during processing, [we recommend avoiding Safari.](https://chatgpt.com/share/68c00c1e-8488-800c-9e11-d3862beaf749)
- **PGP Implementation**: Current PGP support uses a fallback implementation; We are currently considering full [OpenPGP.js integration](https://github.com/openpgpjs/openpgpjs) for future releases
- **File Associations**: Encrypted files lose their original file associations and must be manually renamed after decryption

## 🛡️ Security Architecture

Z3R0 implements industry-standard cryptographic practices:

- **Encryption Algorithm**: AES-256 [Galois/Counter Mode](https://en.wikipedia.org/wiki/Galois/Counter_Mode)
- **Key Derivation**: [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) with 100,000 iterations
- **[Salt](https://en.wikipedia.org/wiki/Salt_(cryptography)) Generation**: Cryptographically secure random 16-byte salt per file
- **IV Generation**: Unique 12-byte initialization vector per encryption
- **Authentication**: Built-in authentication tag prevents tampering
- **Implementation**: Native [Web Crypto API](https://github.com/w3c/webcrypto) (no third-party crypto libraries)


## 🙏 Acknowledgments

Special thanks to:
- **[@sh-dv](https://github.com/sh-dv)** - For inspiration  with their [hat.sh](https://hat.sh.anatole.co) project.
- **[@w3c](https://github.com/w3c)** - For providing secure native browser cryptography

## 🚀 Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
\`\`\`bash
git clone https://github.com/hopeugetherpes/Z3R0.git
cd Z3R0
npm install
npm run dev
\`\`\`

### Building
\`\`\`bash
npm run build
\`\`\`

## 📄 License

**CC0 1.0 Universal (CC0 1.0) Public Domain Dedication**

This work is dedicated to the public domain. You can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission.

CC0 is a public-domain dedication that waives your copyright and related rights to the fullest extent allowed by law.
People may copy, modify, remix, translate, and redistribute the work for any purpose, including commercial, without asking permission.
Attribution is welcome, but legally optional—to eliminate friction and maximize reuse.

**The dedication is irrevocable, so once released under CC0 the work remains free for everyone, forever.**

CC0 is designed for global use and includes a fallback no-conditions license where public-domain dedications aren’t recognized.
**By removing legal barriers, CC0 accelerates the circulation of information, cultural works, scientific data, and educational resources.
It supports transparency and civic innovation by enabling open access, reproducibility, and long-term preservation of knowledge.**

See [LICENSE](https://creativecommons.org/publicdomain/zero/1.0/) for details.

## 🔗 Links

- **Website**: [Z3R0 Encryption Tool](https://z3r0.app)
- **Creator**: [Anatole](https://anatole.co)
- **Repository**: [GitHub](https://github.com/hopeugetherpes/Z3R0)
- **License**: [CC0 Public Domain](https://creativecommons.org/publicdomain/zero/1.0/)

---

**Remember: Your security is only as strong as your password. Choose wisely. 🔐**
