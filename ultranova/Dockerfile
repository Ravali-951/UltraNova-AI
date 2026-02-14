
FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["gunicorn","-k","uvicorn.workers.UvicornWorker","-w","4","app.main:app","--bind","0.0.0.0:8000"]
