from models.coco_detector import CocoDetector
from models.defect_analyzer import DefectAnalyzer
from models.simple_classifier import SimpleClassifier
from storage.db import db
from storage.schemas import StreamResult
import time
import json

class Orchestrator:
    def __init__(self, queue_manager, app):
        self.queue_manager = queue_manager
        self.app = app
        self.models = [
            CocoDetector(),
            DefectAnalyzer(),
            SimpleClassifier()
        ]
        self.model_names = ['coco_detector', 'defect_analyzer', 'simple_classifier']

    def run(self):
        while True:
            stream_id, frame = self.queue_manager.dequeue()
            if frame is None:
                time.sleep(0.1)
                continue
            for model, name in zip(self.models, self.model_names):
                output = model.predict(frame)
                self.save_result(stream_id, name, output)

    def save_result(self, stream_id, model_name, output):
        with self.app.app_context():
            result = StreamResult(
                stream_id=stream_id,
                timestamp=int(time.time()),
                model_name=model_name,
                json_output=json.dumps(output)
            )
            db.session.add(result)
            db.session.commit() 