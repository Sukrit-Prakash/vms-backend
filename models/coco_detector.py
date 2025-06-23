from .base import ModelInterface
import torch
import torchvision
from torchvision.transforms import functional as F

class CocoDetector(ModelInterface):
    def __init__(self):
        self.model = None
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.load_model()

    def load_model(self):
        self.model = torchvision.models.detection.fasterrcnn_resnet50_fpn(pretrained=True)
        self.model.eval()
        self.model.to(self.device)

    def predict(self, frame):
        # frame: numpy array (BGR)
        img = F.to_tensor(frame).to(self.device)
        with torch.no_grad():
            outputs = self.model([img])[0]
        # Return top 3 detections as example
        result = []
        for i in range(min(3, len(outputs['boxes']))):
            box = outputs['boxes'][i].cpu().numpy().tolist()
            label = int(outputs['labels'][i].cpu().numpy())
            score = float(outputs['scores'][i].cpu().numpy())
            result.append({'box': box, 'label': label, 'score': score})
        return result 