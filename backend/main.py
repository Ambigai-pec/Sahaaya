from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from .database import engine, Base
    from .routes import auth, medications, mood, risk, stock, caregiver, chat, notifications, admin
except (ImportError, ValueError):
    from database import engine, Base
    from routes import auth, medications, mood, risk, stock, caregiver, chat, notifications, admin

app = FastAPI(title='Sahaaya API', version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth.router)
app.include_router(medications.router)
app.include_router(mood.router)
app.include_router(risk.router)
app.include_router(stock.router)
app.include_router(caregiver.router)
app.include_router(chat.router)
app.include_router(notifications.router)
app.include_router(admin.router)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
