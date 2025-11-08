@echo off
echo Starting SmartXerox Development Servers...
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C to stop both servers
echo.
start "SmartXerox Backend" cmd /k "cd server && node server.js"
timeout /t 2 /nobreak >nul
start "SmartXerox Frontend" cmd /k "cd client && npm run dev"
echo.
echo Both servers started in separate windows!
echo Close those windows to stop the servers.
pause
