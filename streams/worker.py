import cv2
import time
import os

def is_image_file(filename):
    return filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp'))

class StreamWorker:
    def __init__(self, stream_id, source_url, queue_manager):
        self.stream_id = stream_id
        self.source_url = source_url
        self.queue_manager = queue_manager
        self._stop = False

    def stop(self):
        self._stop = True

    def run(self):
        if os.path.isdir(self.source_url):
            # Image folder
            files = [os.path.join(self.source_url, f) for f in os.listdir(self.source_url) if is_image_file(f)]
            for img_path in files:
                if self._stop:
                    break
                frame = cv2.imread(img_path)
                if frame is not None:
                    self.queue_manager.enqueue(self.stream_id, frame)
                time.sleep(0.1)
        else:
            # Video file or camera/RTSP
            cap = cv2.VideoCapture(self.source_url)
            while not self._stop and cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                self.queue_manager.enqueue(self.stream_id, frame)
                time.sleep(0.1)
            cap.release() 