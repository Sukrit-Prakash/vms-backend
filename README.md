# Video Management System (VMS) Backend
 you can see frontend screenshots at screenshots folder
## Setup Instructions

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the backend:**
   ```bash
   python app.py
   ```

---

## Example API Usage

### 1. Register a Stream
Register a video file, RTSP stream, or image folder:
```bash
curl -X POST http://localhost:5000/streams/ -H "Content-Type: application/json" -d '{"url": "./sample_data/video1.mp4"}'
```
Response:
```json
{"stream_id": "1"}
```

### 2. List Streams
```bash
curl http://localhost:5000/streams/
```

### 3. Start a Stream
```bash
curl -X POST http://localhost:5000/streams/1/start
```

### 4. Stop a Stream
```bash
curl -X POST http://localhost:5000/streams/1/stop
```

### 5. Fetch Inference Results
```bash
curl "http://localhost:5000/results/?stream_id=1&limit=5"
```

---

## Sample Test Data

Create a folder `sample_data/` in your project root and add:
- A sample video file: `sample_data/video1.mp4`
- Or a folder of images: `sample_data/images/` with `.jpg`/`.png` files

You can use any public domain video or images for testing. For example, download a sample video from [sample-videos.com](https://sample-videos.com/).

---

## Notes
- The backend will process frames and store model outputs in a local SQLite DB (`vms_results.db`).
- The `/results/` endpoint returns recent inference results for use in the dashboard. 