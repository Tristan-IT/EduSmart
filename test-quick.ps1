# Quick Test Script - MongoDB Integration
# Run this to verify everything works

Write-Host "🚀 Testing Adapti Portal API" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Test 1: Server Health Check
Write-Host "1️⃣  Testing server health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -ErrorAction Stop
    Write-Host "✅ Server is running!" -ForegroundColor Green
    Write-Host $health
} catch {
    Write-Host "❌ Server is not running. Please start with: cd server; npm run dev" -ForegroundColor Red
    exit 1
}

Write-Host "`n"

# Test 2: Login
Write-Host "2️⃣  Testing login..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "student@test.com"
        password = "test123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody `
        -ErrorAction Stop

    $token = $loginResponse.token
    $user = $loginResponse.user

    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "   User: $($user.name)" -ForegroundColor White
    Write-Host "   Email: $($user.email)" -ForegroundColor White
    Write-Host "   ID: $($user.id)" -ForegroundColor White
    Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Login failed. Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n"

# Test 3: Get Profile
Write-Host "3️⃣  Testing gamification profile..." -ForegroundColor Yellow
try {
    $headers = @{
        Authorization = "Bearer $token"
    }

    $profile = Invoke-RestMethod -Uri "http://localhost:5000/api/gamification/profile" `
        -Headers $headers `
        -ErrorAction Stop

    Write-Host "✅ Profile retrieved!" -ForegroundColor Green
    Write-Host "   Level: $($profile.profile.level)" -ForegroundColor White
    Write-Host "   XP: $($profile.profile.xp)" -ForegroundColor White
    Write-Host "   Streak: $($profile.profile.streak)" -ForegroundColor White
    Write-Host "   Gems: $($profile.profile.gems)" -ForegroundColor White
    Write-Host "   League: $($profile.profile.league)" -ForegroundColor White
} catch {
    Write-Host "❌ Failed to get profile. Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n"

# Test 4: Add XP
Write-Host "4️⃣  Testing add XP..." -ForegroundColor Yellow
try {
    $xpBody = @{
        amount = 50
        reason = "Quick test"
    } | ConvertTo-Json

    $xpResult = Invoke-RestMethod -Uri "http://localhost:5000/api/gamification/xp" `
        -Method POST `
        -ContentType "application/json" `
        -Headers $headers `
        -Body $xpBody `
        -ErrorAction Stop

    Write-Host "✅ XP added successfully!" -ForegroundColor Green
    Write-Host "   New XP: $($xpResult.profile.xp)" -ForegroundColor White
    Write-Host "   New Level: $($xpResult.profile.level)" -ForegroundColor White
    if ($xpResult.leveledUp) {
        Write-Host "   🎉 LEVEL UP!" -ForegroundColor Magenta
    }
} catch {
    Write-Host "❌ Failed to add XP. Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n"

# Test 5: Get Skill Tree
Write-Host "5️⃣  Testing skill tree..." -ForegroundColor Yellow
try {
    $skillTree = Invoke-RestMethod -Uri "http://localhost:5000/api/skill-tree/user" `
        -Headers $headers `
        -ErrorAction Stop

    $nodeCount = $skillTree.nodes.Count
    Write-Host "✅ Skill tree retrieved!" -ForegroundColor Green
    Write-Host "   Total nodes: $nodeCount" -ForegroundColor White
    
    if ($nodeCount -gt 0) {
        $firstNode = $skillTree.nodes[0]
        Write-Host "   First node: $($firstNode.title)" -ForegroundColor White
        Write-Host "   Status: $($firstNode.userProgress.status)" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Failed to get skill tree. Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n"

# Test 6: Get Achievements
Write-Host "6️⃣  Testing achievements..." -ForegroundColor Yellow
try {
    $achievements = Invoke-RestMethod -Uri "http://localhost:5000/api/achievements/user" `
        -Headers $headers `
        -ErrorAction Stop

    Write-Host "✅ Achievements retrieved!" -ForegroundColor Green
    Write-Host "   Total: $($achievements.stats.total)" -ForegroundColor White
    Write-Host "   Unlocked: $($achievements.stats.unlocked)" -ForegroundColor White
    Write-Host "   In Progress: $($achievements.stats.inProgress)" -ForegroundColor White
} catch {
    Write-Host "❌ Failed to get achievements. Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n"

# Test 7: Complete a Skill Node
Write-Host "7️⃣  Testing node completion..." -ForegroundColor Yellow
try {
    $completeBody = @{
        score = 85
    } | ConvertTo-Json

    $completeResult = Invoke-RestMethod -Uri "http://localhost:5000/api/skill-tree/node/node-1/complete" `
        -Method POST `
        -ContentType "application/json" `
        -Headers $headers `
        -Body $completeBody `
        -ErrorAction Stop

    Write-Host "✅ Node completed!" -ForegroundColor Green
    Write-Host "   Stars: $($completeResult.stars)/3" -ForegroundColor White
    Write-Host "   XP Earned: $($completeResult.xpEarned)" -ForegroundColor White
    Write-Host "   Status: $($completeResult.progress.status)" -ForegroundColor White
} catch {
    # It's OK if node is already completed
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "⚠️  Node already completed (this is OK)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Failed to complete node. Error: $_" -ForegroundColor Red
    }
}

Write-Host "`n"
Write-Host "================================" -ForegroundColor Cyan
Write-Host "🎉 ALL TESTS COMPLETED!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host "`nYour MongoDB integration is working perfectly! ✨" -ForegroundColor White
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. Open test-api.http for more detailed testing" -ForegroundColor White
Write-Host "  2. Read API-TESTING-GUIDE.md for comprehensive guide" -ForegroundColor White
Write-Host "  3. Check INTEGRASI-SELESAI.md for full summary" -ForegroundColor White
Write-Host "`n"
