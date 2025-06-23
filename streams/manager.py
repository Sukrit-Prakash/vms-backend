import threading
from streams.worker import StreamWorker

class StreamManager:
    def __init__(self):
        self.streams = {}  # id: {'url': ..., 'status': ..., 'worker': ...}
        self.counter = 1
        self.lock = threading.Lock()

    def register_stream(self, url):
        with self.lock:
            stream_id = str(self.counter)
            self.streams[stream_id] = {'url': url, 'status': 'registered', 'worker': None}
            self.counter += 1
        return stream_id

    def start_stream(self, stream_id, queue_manager):
        with self.lock:
            if stream_id in self.streams and self.streams[stream_id]['status'] != 'running':
                worker = StreamWorker(stream_id, self.streams[stream_id]['url'], queue_manager)
                t = threading.Thread(target=worker.run, daemon=True)
                t.start()
                self.streams[stream_id]['worker'] = worker
                self.streams[stream_id]['status'] = 'running'
                return True
        return False

    def stop_stream(self, stream_id):
        with self.lock:
            if stream_id in self.streams and self.streams[stream_id]['status'] == 'running':
                worker = self.streams[stream_id]['worker']
                if worker:
                    worker.stop()
                self.streams[stream_id]['status'] = 'stopped'
                return True
        return False

    def list_streams(self):
        with self.lock:
            return {sid: {'url': s['url'], 'status': s['status']} for sid, s in self.streams.items()} 