@echo off
echo TASKLIST_JAVA:
tasklist | findstr java
echo.
echo NETSTAT_8085:
netstat -ano | findstr 8085
echo.
echo NETSTAT_8086:
netstat -ano | findstr 8086
