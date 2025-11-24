Write-Host "Testing Leaderboard Endpoint..." -ForegroundColor Cyan

# Test global leaderboard
Write-Host "`n1. Testing GET /api/gamification/leaderboard (global)" -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/gamification/leaderboard?limit=10" -Method Get -Headers @{
    "Authorization" = "Bearer YOUR_TOKEN_HERE"
    "Content-Type" = "application/json"
} -ErrorAction Stop

Write-Host "Success! Found $($response.data.leaderboard.Count) students" -ForegroundColor Green
Write-Host "Current user rank: $($response.data.currentUser.rank)" -ForegroundColor Green

# Test league-specific leaderboard
Write-Host "`n2. Testing GET /api/gamification/leaderboard?league=bronze" -ForegroundColor Yellow
$response2 = Invoke-RestMethod -Uri "http://localhost:5000/api/gamification/leaderboard?league=bronze&limit=10" -Method Get -Headers @{
    "Authorization" = "Bearer YOUR_TOKEN_HERE"
    "Content-Type" = "application/json"
} -ErrorAction Stop

Write-Host "Success! Found $($response2.data.leaderboard.Count) bronze league students" -ForegroundColor Green

Write-Host "`nLeaderboard endpoint is working correctly!" -ForegroundColor Green
