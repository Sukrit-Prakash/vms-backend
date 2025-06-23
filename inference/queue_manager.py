import queue

class QueueManager:
    def __init__(self, maxsize=100):
        self.q = queue.Queue(maxsize=maxsize)

    def enqueue(self, stream_id, frame):
        try:
            self.q.put((stream_id, frame), block=False)
        except queue.Full:
            pass  # Drop frame if queue is full

    def dequeue(self):
        try:
            return self.q.get(block=True, timeout=1)
        except queue.Empty:
            return None, None 