# API for metroid dread leaderboard
## Usage
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
    json={
        # You need to load required objects along the method
        # 
        # < Example >
        # 
        #   METHOD_NAME=addRecord
        #   -> Requires: RecordInfo, AuthInfo
        # for AuthN & AuthZ user
        'authInfo': {
            'identifier': string, # user id or email
            'password'  : string  # password
        },
        # for adding user's info
        'userInfo': {
            'id'      : string, # large/small letter and digit are usable
                                # 8 ~ 64 letters are required
            'name'    : string, # display name
            'nameJp'  : string, # optional
            'mail'    : string, # mail address
            'password': string  # one or more small letter and digit are required
                                # 8 ~ 64 letters are also needed
        },
        # for adding record's info
        'recordInfo': {
            userId    : string,   # user's id
            realTime  : number,   # RTA-based time
            inGameTime: number,   # In game based time
            category  : string,   # Any, 100, ...
            difficulty: string,   # Normal, Hard, ...
            version   : string,   # 1.0.0, ...
            turbo     : boolean,  # 
            comment   : string,   # 
            proofLinks: string[], # 
            verified  : boolean   # always false
        },
        # used by delete user/record
        'deleteIdentifierInfo': {
            identifier: string    # identifier to delete data
                                  # you can use:
                                  #   deleteUser: user's id or email
                                  #   deleteRecord: record' id
        },
        # used for user verifying
        'verifyInfo': {
            token: string   # token will be sent when you call
                            # method 'addUser' and successed
                            # through email
        }
    },
    header={
        "Content-Type": "application/json"
    }
)

# RETURNS:
# {
#     'status': string,
#     'message': string,
#     'data': {
#         'userInfo': UserInfo,
#         'verifyInfo': VerifyInfo,
#         'recordInfo': RecordInfo
#         'deleteIdentifierInfo': DeleteIdentifierInfo,
#     }
# };
```

Put a common interface on the data to be POSTed.
The following is a summary of each method and a list of interfaces required by the method

#### addUser
Requires: `userInfo`

Add an unverified user and send them an email for approval


#### verifyUser
Requires: `authInfo`, `verifyInfo`

Verify an unverified user


#### addRecord
Requires: `authInfo`, `recordInfo`

Add an unverified record


#### deleteUser
Requires: `authInfo`, `deleteIdentifierInfo`

Delete an user


#### deleteRecord
Requires: `authInfo`, `deleteIdentifierInfo`

Delete a record


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
    json = {
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
    json={
        authInfo: {
            identifier: 'my_id',
            password: 'my_password'
        },
        verifyInfo: {
            verifiedToken: '6_digit_token'
        }
    }
)
```

### delete an user

```python
requests.post(
    'https://script.google.com/macros/s/abc.../exec?method=verifyUser',
    json={
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
    json = {
        authInfo: {
            identifier: 'my_id',
            password: '123456ab'
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
    json = {
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
