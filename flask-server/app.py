from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import base64, io
from PIL import Image, ImageOps
import numpy as np
import base64
from io import BytesIO
import torch
import os

app = Flask(__name__)

app.config['DEBURG'] = True

CORS(app, resources={r"/*": {"origins": "*"}})
MAX_BUFFER_SIZE = 50 * 1000 * 1000
socketio = SocketIO(app, cors_allowed_origins="*", max_http_buffer_size = MAX_BUFFER_SIZE)

os.system("rmdir /s yolov5-master\\runs\\detect")

count = 0


@socketio.on('image')
def receive_image(photo):
        img = base64.b64decode(photo['photo'])
        image_stream = BytesIO(img)

        image = Image.open(image_stream)
        image = ImageOps.exif_transpose(image)
        image = image.resize((608, 608))
        image.save("image.jpeg")
        
        image2 = yolo()

        emit("bbox", {'image' : image2})

def yolo():
    global count

    count+=1
    
    if (count == 1):
        count_str = ""
    else:
        count_str = str(count)
        
    os.system("python yolov5-master/detect.py --weights yolov5-master/best.pt --img 600 --conf 0.25 --source image.jpeg")

    image = Image.open(f"yolov5-master/runs/detect/exp{count_str}/image.jpeg")
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    img_byte = buffered.getvalue()
    image = base64.b64encode(img_byte).decode('utf-8')
    
    return image
    
    

if __name__ == '__main__':
    
    socketio.run(app, debug=True, port=5000, host="0.0.0.0")
