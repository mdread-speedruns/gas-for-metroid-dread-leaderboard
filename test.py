import requests

response = requests.get(
    'https://script.google.com/macros/s/{DEPLOY_ID}/exec?method={METHOD_NAME}'.format(
        DEPLOY_ID="AKfycbw2bcLYmDU0gG87zjxi7KvQzQbWVvoh5gvNDc3He8HvMk1-YtKeshadr9zaPfzWMSd0XQ",
        METHOD_NAME="getUsers"
    )
)

data = response.json()

print(data)

# https://script.google.com/macros/s/AKfycbw2bcLYmDU0gG87zjxi7KvQzQbWVvoh5gvNDc3He8HvMk1-YtKeshadr9zaPfzWMSd0XQ/exec
