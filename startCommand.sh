#!/bin/sh
source ~/.virtualenvs/MyNotion/bin/activate
cd frontend && npm install && npm run build
cd frontend && npm start