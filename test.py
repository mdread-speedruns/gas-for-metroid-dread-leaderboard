import json
import requests


def postData(method, data):
    if(method is None):
        print("params is empty")
        return False

    payload = {
        "function": method,
        "data": data
    }
    url = "https://script.googleapis.com/v1/scripts/AKfycbyqx02VzLElvtJCtKALN-IrO9DXhqgo1mvX-1bMhQUI6CPXb3LTaic9bS5NR22uhcnv:run"
    headers = {
        'Content-Type': 'application/json',
    }
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    
    print(response)


if __name__ == "__main__":
    # postしたいデータを渡す
    postData("getUsers", {})
