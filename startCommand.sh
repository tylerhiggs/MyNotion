#!/bin/sh
source ~/.virtualenvs/MyNotion/bin/activate
python backend/SubBackend/manage.py runserver
cd frontend && npm start