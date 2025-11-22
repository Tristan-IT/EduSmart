# Post-Installation Checklist

## ✅ Node.js Installation Steps

### 1. Complete Installation
- Click **Next** to continue
- ✅ Make sure **"Add to PATH"** is checked (shown in screenshot)
- Complete the installation wizard

### 2. Restart Terminal
After installation completes:
```powershell
# Close current terminal and open new one, OR restart VS Code
```

### 3. Verify Installation
```powershell
node --version   # Should show v20.x or v22.x
npm --version    # Should show v10.x
```

### 4. Install Project Dependencies
```powershell
# Root directory (frontend)
npm install

# Server directory (backend)
cd server
npm install
cd ..
```

### 5. Start Development Servers

**Terminal 1 - Backend API:**
```powershell
cd server
npm run dev
```
Should show: `Server running on port 5000`

**Terminal 2 - Mock AI Gateway:**
```powershell
cd server
npm run ai:mock
```
Should show: `Mock AI Gateway running on port 8000`

**Terminal 3 - Frontend:**
```powershell
npm run dev
```
Should show: `Local: http://localhost:5173/`

### 6. Test AI Features
Follow scenarios in `AI-INTEGRATION-TESTING.md`:
- ✅ ParentSummaryModal in Student Dashboard
- ✅ QuizFeedback in Quiz Player
- ✅ ContentCopilot in Content Editor
- ✅ TeacherInsights in Teacher Dashboard
- ✅ AI Chat with feedback buttons

## 🐛 Troubleshooting

### If 'node' not recognized after install:
1. Fully close VS Code (all windows)
2. Open new VS Code
3. Open new terminal in VS Code
4. Try `node --version` again

### If PATH not set:
Add manually:
```
C:\Program Files\nodejs\
```
To System Environment Variables → PATH

### If npm install fails:
```powershell
# Clear cache
npm cache clean --force

# Try again
npm install
```

## 📊 Expected Results
- Backend: Port 5000 (Express API)
- AI Gateway: Port 8000 (Mock streaming)
- Frontend: Port 5173 (Vite dev server)
- MongoDB: Default connection string in .env

## 🎯 All Components Ready
All AI integration code is complete and waiting for runtime!
