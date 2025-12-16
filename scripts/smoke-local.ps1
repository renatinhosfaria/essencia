$ErrorActionPreference = 'Stop'

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')

function Assert-LastExitCode {
  param([string]$Step)
  if ($LASTEXITCODE -ne 0) {
    throw "Command failed (exit=$LASTEXITCODE): $Step"
  }
}

function Cleanup-ConflictingContainers {
  $names = @(
    'essencia-minio',
    'essencia-postgres',
    'essencia-redis',
    'essencia-db-bootstrap',
    'essencia-core',
    'essencia-engagement',
    'essencia-gateway'
  )

  foreach ($name in $names) {
    try {
      docker rm -f $name 2>$null | Out-Null
    } catch {
      # ignore
    }
  }
}

function Wait-PostgresReady {
  param([int]$TimeoutSeconds = 90)

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    try {
      docker exec essencia-postgres pg_isready -U postgres | Out-Null
      return
    } catch {
      Start-Sleep -Seconds 2
    }
  }

  throw "Postgres did not become ready in ${TimeoutSeconds}s"
}

function Wait-ContainerExit {
  param(
    [Parameter(Mandatory = $true)][string]$ContainerName,
    [int]$TimeoutSeconds = 600
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    try {
      $status = docker inspect -f '{{.State.Status}}' $ContainerName 2>$null
      if ($status -eq 'exited') {
        $exitCode = docker inspect -f '{{.State.ExitCode}}' $ContainerName
        if ([int]$exitCode -ne 0) {
          throw "Container $ContainerName exited with code $exitCode"
        }
        return
      }
    } catch {
      # ignore transient inspect failures
    }

    Start-Sleep -Seconds 3
  }

  throw "Container did not exit in ${TimeoutSeconds}s: $ContainerName"
}

function Wait-HttpOk {
  param(
    [Parameter(Mandatory = $true)][string]$Url,
    [int]$TimeoutSeconds = 90
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    try {
      Invoke-RestMethod -Method Get -Uri $Url -TimeoutSec 5 | Out-Null
      return
    } catch {
      Start-Sleep -Seconds 2
    }
  }

  throw "HTTP endpoint not responding: $Url"
}

Set-Location $repoRoot

# Stop and remove all Essencia containers to ensure clean state
Write-Host "Cleaning up existing containers..."
docker compose down --remove-orphans 2>$null | Out-Null

Write-Host "[1/4] Starting infra (postgres/redis/minio)..."
docker compose up -d postgres redis minio
Assert-LastExitCode 'docker compose up -d postgres redis minio'
Wait-PostgresReady

Write-Host "[2/4] Bootstrapping DB (migrate + RLS + seed + verify)..."
docker compose up --no-deps --abort-on-container-exit --exit-code-from db-bootstrap db-bootstrap
Assert-LastExitCode 'docker compose up --abort-on-container-exit --exit-code-from db-bootstrap db-bootstrap'

Write-Host "[3/4] Starting API services (gateway/core/engagement)..."
Set-Location $repoRoot

docker compose up -d --build core engagement gateway
Assert-LastExitCode 'docker compose up -d --build core engagement gateway'
Wait-HttpOk -Url 'http://localhost:3000/api/v1/health' -TimeoutSeconds 120

Write-Host "[4/4] Smoke calls (login + auth/me + basic lists)..."

$loginBody = @{ email = 'daviane@essenciafeliz.com.br'; password = 'demo123'; tenantSlug = 'essencia-feliz' } | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri 'http://localhost:3000/api/v1/auth/login' -ContentType 'application/json' -Body $loginBody

$accessToken = $login.data.accessToken
if (-not $accessToken) {
  throw 'Login response did not include data.accessToken'
}

$tenantId = $login.data.user.tenantId
if (-not $tenantId) {
  throw 'Login response did not include data.user.tenantId'
}

$headers = @{ Authorization = "Bearer $accessToken"; 'x-tenant-id' = $tenantId }

Invoke-RestMethod -Method Get -Uri 'http://localhost:3000/api/v1/auth/me' -Headers $headers | Out-Null
Invoke-RestMethod -Method Get -Uri 'http://localhost:3000/api/v1/users/me' -Headers $headers | Out-Null
Invoke-RestMethod -Method Get -Uri 'http://localhost:3000/api/v1/classes' -Headers $headers | Out-Null
Invoke-RestMethod -Method Get -Uri 'http://localhost:3000/api/v1/students' -Headers $headers | Out-Null
Invoke-RestMethod -Method Get -Uri 'http://localhost:3000/api/v1/announcements' -Headers $headers | Out-Null

Write-Host '✅ Smoke test passed.'
