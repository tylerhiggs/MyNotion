# My Notion

## Python environment
Create Python environment with
```
python3 -m venv ~/.virtualenvs/MyNotion
```
Activate
```
source ~/.virtualenvs/MyNotion/bin/activate
```
Add libraries
```
python -m pip install Django
pip install -r backend/requirements.txt
```

Completely reset the database
```
cd backend && ./rmdb
```
