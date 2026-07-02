from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
from PIL import Image
import io
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
model = YOLO("yolov8n.pt")  
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")

def home():
    return {"message": "Instrument AI is running"}


@app.post("/predict")
async def predict (file:UploadFile= File(...)):
    image_byte = await file.read() 

    image  = Image.open(io.BytesIO(image_byte)) 

    results = model(image)[0]
  

    name  = results.names
    boxes = results.boxes

    predictions = []
      
    for box in boxes:
        cls_id = int(box.cls[0])
        confidence = float(box.conf[0])

        predictions.append({
            "class": name[cls_id],
            "confidence": round(confidence, 2)
        })



    return {
    "message": "Detection done",
    "predictions": predictions
}
         