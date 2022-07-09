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

### add a new user

```python
requests.post(
    'https://script.google.com/macros/s/abc.../exec?method=addUser',
    data = {
        userInfo: {
            id: 'my_id',
            name: 'my_name',
            nameJp: 'my_name_jp',
            email: 'my@email.com',
            password: 'my_password'
        }
    }
)
```

### verifying a user

```python
requests.post(
    'https://script.google.com/macros/s/abc.../exec?method=verifyUser',
    data={
        authInfo: {
            identifier: 'my_id',
            password: 'my_password'
        },
        verifyInfo: {
            verifiedToken: 'token'
        }
    }
)
```

### delete User

```python
requests.post(
    'https://script.google.com/macros/s/abc.../exec?method=verifyUser',
    data={
        authInfo: {
            identifier: 'my_id',
            password: 'my_password'
        },
        deleteIdentifierInfo: {
            identifier: 'my_id'
        }
    }
)
```

### add a new record

```python
requests.post(
    'https://script.google.com/macros/s/abc.../exec?method=addRecord',
    data = {
        authInfo: {
            identifier: 'my_id',
            password: '12345678'
        },
        recordInfo: {
            userId: 'my_id',
            realtime: '00:00:00',
            ingametime: '00:00:00',
            category: 'Any',
            difficulty: 'Normal',
            version: '1.0.0',
            turbo: 'False',
            submissiondate: '2020-01-01',
            comment: 'my_comment',
            prooflinks: [
                'https//example.com/my_proof_link_1',
                'https//example.com/my_proof_link_2',
            ],
            verified: 'True',
        }
    }
)
```

### delete a record

```python
requests.post(
    'https://script.google.com/macros/s/abc.../exec?method=addRecord',
    data = {
        authInfo: {
            identifier: 'my_id',
            password: '12345678'
        },
        deleteIdentifierInfo: {
            identfier: 'my_record_id'
        }
    }
)
```


## GET

### get Users

```python
requests.get(
    'https://script.google.com/macros/s/abc.../exec?method=getUsers',
    }
)
```

### get Records

```python
requests.get(
    'https://script.google.com/macros/s/abc.../exec?method=getRecords',
    }
)
```

