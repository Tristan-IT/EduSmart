# 🧪 API Testing Guide

## Prerequisites
- Backend server running on `http://localhost:5000`
- Test user created: `student@test.com` / `test123`

## Method 1: Using REST Client (VS Code Extension)

1. Install REST Client extension
2. Open `test-api.http` file
3. Click "Send Request" above each endpoint

## Method 2: Using cURL (Command Line)

### Step 1: Login and Get Token

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"student@test.com\",\"password\":\"test123\"}"
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "691ed326d3e6fe46c906efa3",
    "email": "student@test.com",
    "name": "Test Student",
    "role": "student"
  }
}
```

**Copy the `token` value for next requests!**

### Step 2: Test Gamification Endpoints

```bash
# Set your token here
TOKEN="YOUR_JWT_TOKEN_HERE"

# Get Profile
curl http://localhost:5000/api/gamification/profile \
  -H "Authorization: Bearer $TOKEN"

# Add XP
curl -X POST http://localhost:5000/api/gamification/xp \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"amount\":50,\"reason\":\"Completed lesson\"}"

# Claim Daily Goal
curl -X POST http://localhost:5000/api/gamification/streak/claim \
  -H "Authorization: Bearer $TOKEN"

# Get Gem Balance
curl http://localhost:5000/api/gamification/gems \
  -H "Authorization: Bearer $TOKEN"

# Spend Gems
curl -X POST http://localhost:5000/api/gamification/gems/spend \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"amount\":10,\"reason\":\"Bought hint\"}"

# Get Gem History
curl http://localhost:5000/api/gamification/gems/history \
  -H "Authorization: Bearer $TOKEN"

# Check Achievements
curl -X POST http://localhost:5000/api/gamification/achievements/check \
  -H "Authorization: Bearer $TOKEN"
```

### Step 3: Test Skill Tree Endpoints

```bash
# Get All Nodes
curl http://localhost:5000/api/skill-tree \
  -H "Authorization: Bearer $TOKEN"

# Get User's Skill Tree (personalized)
curl http://localhost:5000/api/skill-tree/user \
  -H "Authorization: Bearer $TOKEN"

# Complete a Node (85% score = 2 stars)
curl -X POST http://localhost:5000/api/skill-tree/node/node-1/complete \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"score\":85}"

# Get Next Available Nodes
curl http://localhost:5000/api/skill-tree/next \
  -H "Authorization: Bearer $TOKEN"

# Get Overall Progress
curl http://localhost:5000/api/skill-tree/progress \
  -H "Authorization: Bearer $TOKEN"
```

### Step 4: Test Achievement Endpoints

```bash
# Get All Achievements
curl http://localhost:5000/api/achievements \
  -H "Authorization: Bearer $TOKEN"

# Get User's Achievements (with progress)
curl http://localhost:5000/api/achievements/user \
  -H "Authorization: Bearer $TOKEN"

# Get Recent Unlocks
curl http://localhost:5000/api/achievements/recent?limit=5 \
  -H "Authorization: Bearer $TOKEN"
```

### Step 5: Test Quiz Endpoints

```bash
# Get Quiz Questions (5 easy algebra questions)
curl "http://localhost:5000/api/quizzes/algebra/questions?difficulty=easy&limit=5" \
  -H "Authorization: Bearer $TOKEN"

# Submit Quiz (replace QUESTION_ID with actual ID from previous response)
curl -X POST http://localhost:5000/api/quizzes/submit \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"topicId\":\"algebra\",\"answers\":[{\"questionId\":\"QUESTION_ID\",\"userAnswer\":\"A\"}],\"timeSpent\":120}"

# Get Quiz Stats
curl http://localhost:5000/api/quizzes/stats/algebra \
  -H "Authorization: Bearer $TOKEN"
```

## Method 3: Using Postman

### Setup

1. Create new collection "Adapti Portal API"
2. Add environment variable:
   - `baseUrl`: `http://localhost:5000/api`
   - `token`: (will be set after login)

### Import Endpoints

**Collection Structure:**
```
Adapti Portal API/
├── Auth/
│   └── Login (POST {{baseUrl}}/auth/login)
├── Gamification/
│   ├── Get Profile (GET {{baseUrl}}/gamification/profile)
│   ├── Add XP (POST {{baseUrl}}/gamification/xp)
│   ├── Claim Daily Goal (POST {{baseUrl}}/gamification/streak/claim)
│   ├── Get Gems (GET {{baseUrl}}/gamification/gems)
│   ├── Spend Gems (POST {{baseUrl}}/gamification/gems/spend)
│   └── Check Achievements (POST {{baseUrl}}/gamification/achievements/check)
├── Skill Tree/
│   ├── Get All Nodes (GET {{baseUrl}}/skill-tree)
│   ├── Get User Tree (GET {{baseUrl}}/skill-tree/user)
│   ├── Complete Node (POST {{baseUrl}}/skill-tree/node/:nodeId/complete)
│   └── Get Progress (GET {{baseUrl}}/skill-tree/progress)
├── Achievements/
│   ├── Get All (GET {{baseUrl}}/achievements)
│   ├── Get User Achievements (GET {{baseUrl}}/achievements/user)
│   └── Get Recent (GET {{baseUrl}}/achievements/recent)
└── Quiz/
    ├── Get Questions (GET {{baseUrl}}/quizzes/:topicId/questions)
    ├── Submit Quiz (POST {{baseUrl}}/quizzes/submit)
    └── Get Stats (GET {{baseUrl}}/quizzes/stats/:topicId)
```

### Authorization Setup

In Postman collection settings:
1. Go to "Authorization" tab
2. Type: `Bearer Token`
3. Token: `{{token}}`

In Login request, add test to save token:
```javascript
pm.environment.set("token", pm.response.json().token);
```

## Expected Results

### ✅ Successful Login
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "691ed326d3e6fe46c906efa3",
    "email": "student@test.com",
    "name": "Test Student",
    "role": "student"
  }
}
```

### ✅ Get Profile
```json
{
  "profile": {
    "xp": 0,
    "level": 1,
    "streak": 0,
    "gems": 0,
    "league": "bronze",
    "dailyGoalXP": 30,
    "dailyGoalProgress": 0,
    "dailyGoalMet": false
  }
}
```

### ✅ Complete Node (85% score)
```json
{
  "success": true,
  "message": "Node completed successfully",
  "stars": 2,
  "xpEarned": 75,
  "leveledUp": false,
  "progress": {
    "nodeId": "node-1",
    "status": "completed",
    "stars": 2,
    "bestScore": 85
  }
}
```

### ✅ Get User Achievements
```json
{
  "achievements": [
    {
      "achievement": {
        "_id": "...",
        "achievementId": "first-lesson",
        "title": "First Steps",
        "description": "Complete your first lesson",
        "icon": "🎯",
        "category": "learning"
      },
      "progress": 0,
      "total": 1,
      "unlocked": false,
      "unlockedAt": null
    }
  ],
  "stats": {
    "total": 20,
    "unlocked": 0,
    "inProgress": 0
  }
}
```

## Common Issues

### ❌ 401 Unauthorized
**Problem:** Token missing or invalid

**Solution:**
```bash
# Login again to get fresh token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"student@test.com\",\"password\":\"test123\"}"
```

### ❌ 404 Not Found
**Problem:** Endpoint URL incorrect

**Solution:** Check that server is running on port 5000 and endpoint path is correct

### ❌ 500 Internal Server Error
**Problem:** Database connection or server error

**Solution:** Check server logs in terminal for error details

## PowerShell Alternative (Windows)

```powershell
# Login
$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"student@test.com","password":"test123"}'

$token = $loginResponse.token

# Get Profile
Invoke-RestMethod -Uri "http://localhost:5000/api/gamification/profile" `
  -Headers @{Authorization="Bearer $token"}

# Add XP
Invoke-RestMethod -Uri "http://localhost:5000/api/gamification/xp" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{Authorization="Bearer $token"} `
  -Body '{"amount":50,"reason":"Test"}'
```

## Next Steps

After testing endpoints:
1. ✅ Verify all endpoints return expected data
2. ✅ Check database for updated records
3. ✅ Test error cases (invalid input, missing auth, etc.)
4. ✅ Integrate with frontend components
5. ✅ Test end-to-end user journey

---

**Status:** Ready for testing! 🚀
**Test Account:** student@test.com / test123
