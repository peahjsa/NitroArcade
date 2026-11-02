$ErrorActionPreference='Stop'
$ProgressPreference='SilentlyContinue'
$base='https://nodejs.org/dist/latest-v24.x/'
$target=Join-Path $PSScriptRoot 'portable'
New-Item -ItemType Directory -Force -Path $target | Out-Null
Write-Host 'Getting official Node.js v24 LTS checksum list from nodejs.org...'
$manifest=(Invoke-WebRequest -Uri ($base+'SHASUMS256.txt') -UseBasicParsing).Content
$match=[regex]::Match($manifest,'(?m)^([a-fA-F0-9]{64})\s+(node-v24[^\s]+-win-x64\.zip)$')
if(-not $match.Success){throw 'Official Windows x64 ZIP was not found. Check the LTS version at nodejs.org/en/download.'}
$expected=$match.Groups[1].Value.ToLower();$filename=$match.Groups[2].Value
$archive=Join-Path $target $filename
Write-Host ('Downloading '+$filename+' (may take several minutes)...')
Invoke-WebRequest -Uri ($base+$filename) -OutFile $archive -UseBasicParsing
$actual=(Get-FileHash -Algorithm SHA256 -Path $archive).Hash.ToLower()
if($actual -ne $expected){Remove-Item $archive -Force;throw 'Checksum mismatch. Download deleted for safety.'}
Write-Host 'SHA-256 verified against official Node.js manifest.'
Expand-Archive -Path $archive -DestinationPath $target -Force
$node=Get-ChildItem -Path $target -Filter node.exe -Recurse | Select-Object -First 1
if(-not $node){throw 'node.exe not found after extraction.'}
$nodeFolder=$node.Directory.FullName
Set-Content -Path (Join-Path $PSScriptRoot 'node-path.txt') -Value $nodeFolder -Encoding ascii
Write-Host ('Installed portable Node.js at: '+$nodeFolder)
& $node.FullName --version
Write-Host 'Portable Node is now inside this NitroArcade folder. No system-wide install required.'
Read-Host 'Press Enter to close'
