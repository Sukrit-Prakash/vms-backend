from flask import Blueprint, request, jsonify
from storage.db import db
from storage.schemas import StreamResult

results_bp = Blueprint('results', __name__)

@results_bp.route('/', methods=['GET'])
def get_results():
    stream_id = request.args.get('stream_id')
    limit = int(request.args.get('limit', 10))
    q = db.session.query(StreamResult)
    if stream_id:
        q = q.filter(StreamResult.stream_id == stream_id)
    q = q.order_by(StreamResult.timestamp.desc()).limit(limit)
    results = [
        {
            'id': r.id,
            'stream_id': r.stream_id,
            'timestamp': r.timestamp,
            'model_name': r.model_name,
            'output': r.json_output
        }
        for r in q.all()
    ]
    return jsonify(results) 