@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0INSTALL_NODE_LTS.ps1"
if errorlevel 1 pause
