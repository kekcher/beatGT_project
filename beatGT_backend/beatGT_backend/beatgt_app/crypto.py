import jwt
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password

def create_token(payload):
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

def decode_token(token):
    return jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')

def create_hash(item):
    return make_password(item)

def check_pswd(pswd, pswd_hash):
    return check_password(pswd, pswd_hash)