#!/bin/sh

python backend/SubBackend/manage.py runserver
cd frontend && npm start