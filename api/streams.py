from flask import Blueprint, request, jsonify, current_app

streams_bp = Blueprint('streams', __name__)

@streams_bp.route('/', methods=['POST'])
def register_stream():
    data = request.get_json()
    url = data.get('url')
    if not url:
        return jsonify({'error': 'Missing url'}), 400
    stream_id = current_app.stream_manager.register_stream(url)
    return jsonify({'stream_id': stream_id})

@streams_bp.route('/', methods=['GET'])
def list_streams():
    streams = current_app.stream_manager.list_streams()
    return jsonify(streams)

@streams_bp.route('/<stream_id>/start', methods=['POST'])
def start_stream(stream_id):
    ok = current_app.stream_manager.start_stream(stream_id, current_app.queue_manager)
    return jsonify({'started': ok})

@streams_bp.route('/<stream_id>/stop', methods=['POST'])
def stop_stream(stream_id):
    ok = current_app.stream_manager.stop_stream(stream_id)
    return jsonify({'stopped': ok}) 