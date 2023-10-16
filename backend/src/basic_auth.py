import secrets
import os

from fastapi import HTTPException, status, Request, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials

security = HTTPBasic()

def auth_basic(credentials: HTTPBasicCredentials):
    correct_username = secrets.compare_digest(
        credentials.username.encode('utf-8'), os.getenv('BASIC_USER').encode('utf-8'))
    correct_password = secrets.compare_digest(
        credentials.password.encode('utf-8'), os.getenv('BASIC_PASSWORD').encode('utf-8'))
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect email or password',
            headers={'WWW-Authenticate': 'Basic'},
        )

def verify_from_api(credentials: HTTPBasicCredentials = Depends(security)):
    auth_basic(credentials)