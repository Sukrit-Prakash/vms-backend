from .base import ModelInterface
import tensorflow as tf
import numpy as np
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input, decode_predictions

class DefectAnalyzer(ModelInterface):
    def __init__(self):
        self.model = None
        self.load_model()

    def load_model(self):
        # Load a pre-trained MobileNetV2 model
        self.model = MobileNetV2(weights='imagenet')

    def predict(self, frame):
        # frame: numpy array (BGR, as from OpenCV)
        # Convert BGR to RGB
        img_rgb = frame[..., ::-1]
        # Resize to 224x224 as required by MobileNetV2
        img_resized = tf.image.resize(img_rgb, (224, 224)).numpy()
        # Preprocess for MobileNetV2
        img_preprocessed = preprocess_input(img_resized)
        # Add batch dimension
        img_batch = np.expand_dims(img_preprocessed, axis=0)
        # Run inference
        preds = self.model.predict(img_batch)
        # Decode predictions
        decoded = decode_predictions(preds, top=1)[0][0]  # (class, name, score)
        return {
            'predicted_class': decoded[1],
            'confidence': float(decoded[2])
        } 