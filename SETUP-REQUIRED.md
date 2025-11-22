# Setup Instructions - Node.js Required

## ⚠️ Node.js Not Found

Your system doesn't have Node.js installed, which is required to run this project.

## 🔧 Installation Options

### Option 1: Install Node.js (Recommended)
1. Download from: https://nodejs.org/
2. Choose **LTS version** (Long Term Support)
3. Run installer with default settings
4. Restart PowerShell/VS Code
5. Verify: `node --version` and `npm --version`

### Option 2: Install Bun (Faster Alternative)
1. Download from: https://bun.sh/
2. Run: `powershell -c "irm bun.sh/install.ps1 | iex"`
3. Restart terminal
4. Replace npm commands with bun:
   - `bun install` instead of `npm install`
   - `bun run dev` instead of `npm run dev`

## 📋 After Installation

### Install Dependencies
```powershell
# Root project (frontend)
npm install

# Backend server
cd server
npm install
```

### Start Development Servers
```powershell
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Mock AI Gateway
cd server
npm run ai:mock

# Terminal 3: Frontend
npm run dev
```

## ✅ Verification Commands
```powershell
node --version    # Should show v20.x or higher
npm --version     # Should show v10.x or higher
```

## 🔗 Quick Links
- **Node.js Download:** https://nodejs.org/en/download/
- **Bun Download:** https://bun.sh/
- **Project Documentation:** See AI-INTEGRATION-TESTING.md

## 📝 Current Status
- ✅ All AI components created and integrated
- ✅ TypeScript code compiles without errors
- ❌ Runtime environment (Node.js/npm) not available
- ⏸️ Testing blocked until Node.js installed

## 🎯 Next Steps After Installation
1. Run `npm install` in root directory
2. Run `npm install` in server directory
3. Start backend: `cd server && npm run dev`
4. Start mock gateway: `cd server && npm run ai:mock`
5. Start frontend: `npm run dev`
6. Follow AI-INTEGRATION-TESTING.md for testing scenarios
