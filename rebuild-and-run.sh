#!/bin/bash
cd frontend
npm run build:backend
cd ../backend
pkill -f "mvn spring-boot:run"
sleep 2
mvn spring-boot:run
