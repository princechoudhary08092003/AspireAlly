@echo off
echo Starting MentorPath...
echo.
echo Starting backend server on http://localhost:5000
start cmd /k "cd /d %~dp0server && npm run dev"
timeout /t 2 >nul
echo Starting frontend on http://localhost:5173
start cmd /k "cd /d %~dp0client && npm run dev"
echo.
echo MentorPath is running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo.
echo Default Admin: admin@mentorpath.com / Admin@123
pause
