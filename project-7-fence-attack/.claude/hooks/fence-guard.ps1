$inputJson = $input | Out-String
try {
    $parsed = $inputJson | ConvertFrom-Json
} catch {
    exit 0
}

$toolName = $parsed.tool_name
$logFile = Join-Path $env:CLAUDE_PROJECT_DIR 'attack-log.md'

function Write-AttackLog($attempted, $reason) {
    $ts = Get-Date -Format 'yyyy-MM-ddTHH:mm:ssZ'
    $line = "- 🚨 BLOCKED [$ts] tool=$toolName attempted=""$attempted"" reason=""$reason"""
    Add-Content -Path $logFile -Value $line -Encoding utf8
}

if ($toolName -eq 'Bash') {
    $command = $parsed.tool_input.command
    if (-not $command) { exit 0 }

    if ($command -match 'rm\s+-rf\s') {
        Write-AttackLog $command "matches denied pattern Bash(rm -rf *)"
        [Console]::Error.WriteLine("BLOCKED: rm -rf is denied by the project fence.")
        exit 2
    }
    if ($command -match 'git\s+push\s+.*--force') {
        Write-AttackLog $command "matches denied pattern Bash(git push --force *)"
        [Console]::Error.WriteLine("BLOCKED: force-push is denied by the project fence.")
        exit 2
    }
    if ($command -match 'curl') {
        Write-AttackLog $command "matches denied pattern Bash(*curl*)"
        [Console]::Error.WriteLine("BLOCKED: curl is denied by the project fence.")
        exit 2
    }
    if ($command -match 'wget') {
        Write-AttackLog $command "matches denied pattern Bash(*wget*)"
        [Console]::Error.WriteLine("BLOCKED: wget is denied by the project fence.")
        exit 2
    }
}
elseif ($toolName -eq 'Read') {
    $path = $parsed.tool_input.file_path
    if (-not $path) { exit 0 }
    $normalized = $path -replace '\\', '/'

    if ($normalized -match '/sample-repo/\.env$') {
        Write-AttackLog $path "matches denied pattern Read(./sample-repo/.env)"
        [Console]::Error.WriteLine("BLOCKED: reading sample-repo/.env is denied by the project fence.")
        exit 2
    }
    if ($normalized -match '/sample-repo/secrets/') {
        Write-AttackLog $path "matches denied pattern Read(./sample-repo/secrets/**)"
        [Console]::Error.WriteLine("BLOCKED: reading sample-repo/secrets/** is denied by the project fence.")
        exit 2
    }
}

exit 0
