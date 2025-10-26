@echo off
echo.
echo ====================================
echo   Opening Swagger UI Documentation
echo ====================================
echo.
echo Swagger UI: http://localhost:8080/swagger-ui.html
echo OpenAPI JSON: http://localhost:8080/api-docs
echo.

timeout /t 2 /nobreak >nul

start http://localhost:8080/swagger-ui.html

echo.
echo Browser opened!
echo If backend is not running, start it first with: mvn spring-boot:run
echo.
pause
