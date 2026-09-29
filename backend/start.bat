@echo off
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
python seed_data.py
uvicorn main:app --reload --host 0.0.0.0 --port 8000
