import requests

response = requests.get(
    'https://script.google.com/macros/s/{DEPLOY_ID}/exec?method={METHOD_NAME}'.format(
        DEPLOY_ID="AKfycbzyV0nyHk0qSeNygxOd1Ny7RRgoZzOEJy9cbtBy9W9Vf8lJWqU8B82nFpvOZ4AAXKkJ",
        METHOD_NAME="getUsers"
    )
)

print(response)