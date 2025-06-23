import os

class Config:
    DEBUG = True
    PORT = 5000
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///vms_results.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False 