# Subir el proyecto a GitHub (requiere Git en PATH y login a GitHub).
# En PowerShell, desde esta carpeta:
#   .\push-github.ps1
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host "Git no está en PATH. Instala Git for Windows y vuelve a abrir la terminal." -ForegroundColor Red
  exit 1
}

if (-not (git config --get user.email) -or -not (git config --get user.name)) {
  Write-Host "Configura tu identidad en Git, por ejemplo:" -ForegroundColor Yellow
  Write-Host '  git config --global user.email "tu@email.com"'
  Write-Host '  git config --global user.name "Tu Nombre"'
  exit 1
}

$remote = "https://github.com/calossalfate/SalfateAbogados-IA.git"

if (-not (Test-Path .git)) {
  git init
}

git branch -M main 2>$null

$null = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
  git remote set-url origin $remote
} else {
  git remote add origin $remote
}

git add -A
if (-not (git status --porcelain)) {
  Write-Host "No hay cambios nuevos para commitear. Intentando push..." -ForegroundColor Yellow
} else {
  git commit -m "Initial commit: landing Salfate Abogados (Next.js)"
}

git push -u origin main
Write-Host "Listo. Repo: https://github.com/calossalfate/SalfateAbogados-IA" -ForegroundColor Green
