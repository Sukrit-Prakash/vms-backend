from storage.db import db

class StreamResult(db.Model):
    __tablename__ = 'stream_results'
    id = db.Column(db.Integer, primary_key=True)
    stream_id = db.Column(db.String(32), nullable=False)
    timestamp = db.Column(db.Integer, nullable=False)
    model_name = db.Column(db.String(64), nullable=False)
    json_output = db.Column(db.Text, nullable=False) 