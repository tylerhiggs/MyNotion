#!/bin/sh

python3 -m venv ~/.virtualenvs/MyNotion
source ~/.virtualenvs/MyNotion/bin/activate
pip install -r backend/requirements.txt
python backend/SubBackend/manage.py migrate

