from flask_sqlalchemy import SQLAlchemy
from config import Config

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)
    with app.app_context():
        from storage import schemas
        db.create_all()
    return db 