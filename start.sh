#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

echo "======================================================================"
echo "          SAHAAYA - AI-Driven Mobile Health Companion"
echo "======================================================================"

cd "$DIR/backend"
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

echo "Seeding database..."
python3 seed_data.py

echo "Starting FastAPI Backend on http://localhost:8000 ..."
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

echo "Starting Expo Frontend..."
cd "$DIR/frontend"
npx expo start &
FRONTEND_PID=$!

echo "======================================================================"
echo "Sahaaya running! Press Ctrl+C to stop."
echo "API Docs: http://localhost:8000/docs"
echo "======================================================================"

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
