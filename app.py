from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config
from storage.db import init_db
from api.streams import streams_bp
from api.results import results_bp
from streams.manager import StreamManager
from inference.queue_manager import QueueManager
from inference.orchestrator import Orchestrator
import threading

# Initialize Flask app
app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

db = init_db(app)

# Ensure tables are created before starting threads
with app.app_context():
    db.create_all()
    print('Database tables created.')

# Register Blueprints
app.register_blueprint(streams_bp, url_prefix='/streams')
app.register_blueprint(results_bp, url_prefix='/results')

# Global managers
stream_manager = StreamManager()
queue_manager = QueueManager()
orchestrator = Orchestrator(queue_manager, app)

# Attach to app for blueprint access
app.stream_manager = stream_manager
app.queue_manager = queue_manager
app.orchestrator = orchestrator

# Start orchestrator worker thread
orchestrator_thread = threading.Thread(target=orchestrator.run, daemon=True)
orchestrator_thread.start()

@app.route('/')
def index():
    return {'status': 'VMS Backend Running'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG) 