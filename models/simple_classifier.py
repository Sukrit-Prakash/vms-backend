from .base import ModelInterface
import tensorflow as tf
import numpy as np
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input, decode_predictions

class SimpleClassifier(ModelInterface):
    def __init__(self):
        self.model = None
        self.load_model()

    def load_model(self):
        # Load a pre-trained ResNet50 model
        self.model = ResNet50(weights='imagenet')

    def predict(self, frame):
        # frame: numpy array (BGR, as from OpenCV)
        img_rgb = frame[..., ::-1]
        img_resized = tf.image.resize(img_rgb, (224, 224)).numpy()
        img_preprocessed = preprocess_input(img_resized)
        img_batch = np.expand_dims(img_preprocessed, axis=0)
        preds = self.model.predict(img_batch)
        decoded = decode_predictions(preds, top=1)[0][0]
        return {
            'predicted_class': decoded[1],
            'confidence': float(decoded[2])
        } 