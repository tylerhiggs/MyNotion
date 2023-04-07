#!/bin/sh

source ~/.virtualenvs/MyNotion/bin/activate
rm -f SubBackend/db.sqlite3
python SubBackend/manage.py makemigrations notion_models
python SubBackend/manage.py migrate
python SubBackend/manage.py shell < SubBackend/dummy_data.py
python SubBackend/manage.py runserver