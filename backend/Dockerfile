FROM python:3.9-slim

WORKDIR /backend/src

COPY ./src/* /backend/src/*
ADD ./requirements.txt /backend/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /backend/requirements.txt

CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8080"]