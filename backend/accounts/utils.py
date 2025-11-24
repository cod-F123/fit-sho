import requests
from django.conf import settings

API_KEY = settings.PAYAMAK_APIKEY
PAYAMAK_NUMBER = settings.PAYAMAK_NUMBER

def send_message(phone,text):
    data = {'from': PAYAMAK_NUMBER, 'to':phone, 'text': text}
    response = requests.post(f'https://console.melipayamak.com/api/send/simple/{API_KEY}', json=data)
    res = response.json()
    
    return res