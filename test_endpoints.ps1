# Cat Buddy HTTP Endpoint Tests
# Usage: Run while Cat Buddy app is open

$base = "http://127.0.0.1:3333"
$pass = 0
$fail = 0

function Test-Case {
    param($name, $method, $url, $expectedBody, $expectedStatus = 200)
    try {
        $resp = Invoke-WebRequest -Uri "$base$url" -Method $method -UseBasicParsing -TimeoutSec 3
        $body = $resp.Content.Trim()
        $status = $resp.StatusCode

        if ($status -eq $expectedStatus -and $body -eq $expectedBody) {
            Write-Host "  PASS  $name" -ForegroundColor Green
            $script:pass++
        } else {
            Write-Host "  FAIL  $name (status=$status body='$body')" -ForegroundColor Red
            $script:fail++
        }
    } catch {
        Write-Host "  FAIL  $name (error: $($_.Exception.Message))" -ForegroundColor Red
        $script:fail++
    }
}

# Check app is running
Write-Host ""
Write-Host "Connecting to Cat Buddy..." -ForegroundColor Cyan
try {
    $ping = Invoke-WebRequest -Uri $base -Method GET -UseBasicParsing -TimeoutSec 2
    Write-Host "  Connected (response: '$($ping.Content.Trim())')" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "  App is not running. Please open Cat Buddy first." -ForegroundColor Yellow
    exit 1
}

# State transition tests
Write-Host "[ State Transitions ]"
Test-Case "POST /working"           POST "/working"     "ok"
Start-Sleep -Milliseconds 500
Test-Case "POST /sleeping"          POST "/sleeping"    "ok"
Start-Sleep -Milliseconds 500
Test-Case "POST /questioning"       POST "/questioning" "ok"
Start-Sleep -Milliseconds 500
Test-Case "POST /working (return)"  POST "/working"     "ok"

# Invalid request tests
Write-Host ""
Write-Host "[ Invalid Requests ]"
Test-Case "GET / (health check)"         GET  "/"         "cat-buddy"
Test-Case "GET /working (wrong method)"  GET  "/working"  "cat-buddy"
Test-Case "POST /unknown"                POST "/unknown"  "cat-buddy"
Test-Case "POST /WORKING (case check)"   POST "/WORKING"  "cat-buddy"

# Rapid concurrent requests
Write-Host ""
Write-Host "[ Rapid Concurrent Requests (race condition) ]"
$jobs = @()
foreach ($endpoint in @("/working", "/sleeping", "/questioning")) {
    $jobs += Start-Job -ScriptBlock {
        param($url, $ep)
        try {
            $r = Invoke-WebRequest -Uri "$url$ep" -Method POST -UseBasicParsing -TimeoutSec 3
            return $r.Content.Trim()
        } catch { return "error" }
    } -ArgumentList $base, $endpoint
}
$results = $jobs | Wait-Job | Receive-Job
$jobs | Remove-Job
$allOk = ($results | Where-Object { $_ -ne "ok" }).Count -eq 0
if ($allOk) {
    Write-Host "  PASS  3 concurrent requests all responded" -ForegroundColor Green
    $pass++
} else {
    Write-Host "  FAIL  Some concurrent requests failed: $($results -join ', ')" -ForegroundColor Red
    $fail++
}
Start-Sleep -Milliseconds 300
Test-Case "POST /working (after concurrent)" POST "/working" "ok"

# Summary
$total = $pass + $fail
Write-Host ""
if ($fail -eq 0) {
    Write-Host "Result: $pass / $total passed" -ForegroundColor Green
} else {
    Write-Host "Result: $pass / $total passed" -ForegroundColor Yellow
    exit 1
}
