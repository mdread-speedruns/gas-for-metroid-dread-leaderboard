import requests
import json
import sys

# python test.py [get/post] [methodName] ?[jsondata]

methodType = sys.argv[1]
methodName = sys.argv[2]
dictData = None
URL = 'https://script.google.com/macros/s/{DEPLOY_ID}/exec?method={METHOD_NAME}'.format(
    DEPLOY_ID="AKfycbw2bcLYmDU0gG87zjxi7KvQzQbWVvoh5gvNDc3He8HvMk1-YtKeshadr9zaPfzWMSd0XQ",
    METHOD_NAME=methodName)
HEADERS = {"Content-Type": "application/json"}

if len(sys.argv) > 3:
    f = open(sys.argv[3], encoding="utf-8")
    dictData = json.load(f)
    print(dictData)
    f.close()

if methodType not in ["get", "post"]:
    raise Exception

if methodType == "get":
    response = requests.get(URL)

    data = response.json()
    print(data)

else:
    response = requests.post(URL, json=dictData, headers=HEADERS)

    data = response.json()
    print(data)


# https://script.google.com/macros/s/AKfycbw2bcLYmDU0gG87zjxi7KvQzQbWVvoh5gvNDc3He8HvMk1-YtKeshadr9zaPfzWMSd0XQ/exec
