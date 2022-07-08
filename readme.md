## usage

### Post

```python
import requests

DEPLOY_ID = '<deploy_id>'
METHOD_NAME = '<method_name>'

response = requests.post(
    'https://script.google.com/macros/s/{DEPLOY_ID}/exec?method={METHOD_NAME}'.format(
        DEPLOY_ID=DEPLOY_ID,
        METHOD_NAME=METHOD_NAME
    ),
    data={'foo': 'bar'}
)
```

### Get

```python
requests.get(
    'https://script.google.com/macros/s/{DEPLOY_ID}/exec?method={METHOD_NAME}'.format(
        DEPLOY_ID=DEPLOY_ID,
        METHOD_NAME=METHOD_NAME
    )
)
```

## example

### adding a new user

```python
requests.post(
    'https://script.google.com/macros/s/abc.../exec?method=addUser',
    data={
        'id': 'my_id',
        'name': 'my_name',
        'nameJp': 'my_name_jp',
        'email': 'my@email',
        'password': 'my_password'
    }
)
```

### adding a new record

```python
requests.post(
    'https://script.google.com/macros/s/abc.../exec?method=addRecord',
    data={
        'userId': 'my_id',
        'realtime': '00:00:00',
        'ingametime': '00:00:00',
        'category': 'Any',
        'difficulty': 'Normal',
        'version': '1.0.0',
        'turbo': 'False',
        'submissiondate': '2020-01-01',
        'comment': 'my_comment',
        'prooflinks': [
            'https://example.com/my_proof_link_1'
        ],
        'verified': 'True',
    }
)
```

### verifying a user

```python
requests.post(
    'https://script.google.com/macros/s/abc.../exec?method=verifyUser',
    data={
        'id': 'my_id',
        'password': 'my_password',
        'verifiedToken': 'token'
    }
)
```
