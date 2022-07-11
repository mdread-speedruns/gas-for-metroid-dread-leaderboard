from __future__ import print_function

import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


def main():
    """Runs the sample.
    """
    # pylint: disable=maybe-no-member
    script_id = 'AKfycbzyV0nyHk0qSeNygxOd1Ny7RRgoZzOEJy9cbtBy9W9Vf8lJWqU8B82nFpvOZ4AAXKkJ'

    creds, _ = google.auth.default()
    service = build('script', 'v1', credentials=creds)

    # Create an execution request object.
    request = {"function": "apiTest"}

    try:
        # Make the API request.
        response = service.scripts().run(scriptId=script_id,
                                         body=request).execute()
        if 'error' in response:
            # The API executed, but the script returned an error.
            # Extract the first (and only) set of error details. The values of
            # this object are the script's 'errorMessage' and 'errorType', and
            # a list of stack trace elements.
            error = response['error']['details'][0]
            print(f"Script error message: {0}.{format(error['errorMessage'])}")

            if 'scriptStackTraceElements' in error:
                # There may not be a stacktrace if the script didn't start
                # executing.
                print("Script error stacktrace:")
                for trace in error['scriptStackTraceElements']:
                    print(f"\t{0}: {1}."
                          f"{format(trace['function'], trace['lineNumber'])}")
        else:
            # The structure of the result depends upon what the Apps Script
            # function returns. Here, the function returns an Apps Script
            # Object with String keys and values, and so the result is
            # treated as a Python dictionary (folder_set).
            folder_set = response['response'].get('result', {})
            if not folder_set:
                print('No folders returned!')
            else:
                print('Folders under your root folder:')
                for (folder_id, folder) in folder_set.items():
                    print(f"\t{0} ({1}).{format(folder, folder_id)}")

    except HttpError as error:
        # The API encountered a problem before the script started executing.
        print(f"An error occurred: {error}")
        print(error.content)


if __name__ == '__main__':
    main()

# from __future__ import print_function
# import os.path
# from googleapiclient import errors
# from googleapiclient.discovery import build
# from google_auth_oauthlib.flow import InstalledAppFlow
# from google.auth.transport.requests import Request
# from google.oauth2.credentials import Credentials

# # https://accounts.google.com/o/oauth2/auth?client_id=687320560874-5ivms6pn7fpmfff544qo8r1cdrklsrnk.apps.googleusercontent.com&redirect_uri=http://localhost&scope=https://www.googleapis.com/auth/spreadsheets&response_type=code&approval_prompt=force&access_type=offline
# # http://localhost/?code=4/0AdQt8qj-GL0Qtyi7EG0BC5ZpL8xtVEDK1nZzHWFIOPU5mm3KnW0fQonliJ29cRINy6cHJw&scope=https://www.googleapis.com/auth/spreadsheets
# # URL = "https://script.googleapis.com/v1/scripts/AKfycbzyV0nyHk0qSeNygxOd1Ny7RRgoZzOEJy9cbtBy9W9Vf8lJWqU8B82nFpvOZ4AAXKkJ:run"
# # CLIENT_ID = "687320560874-5ivms6pn7fpmfff544qo8r1cdrklsrnk.apps.googleusercontent.com"
# # CLIENT_SECRET = "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"
# # API_KEY = "AIzaSyAu6luYol8foTRgusvw9IDjWK7W96UEzV0"
# # TOKEN = "4/0AdQt8qj-GL0Qtyi7EG0BC5ZpL8xtVEDK1nZzHWFIOPU5mm3KnW0fQonliJ29cRINy6cHJw"


# def main():
#     """Runs the sample.
#     """
#     # GoogleAppsScriptのデプロイIDのこと
#     SCRIPT_ID = 'AKfycbzyV0nyHk0qSeNygxOd1Ny7RRgoZzOEJy9cbtBy9W9Vf8lJWqU8B82nFpvOZ4AAXKkJ'

#     # ④GoogleCloudPlatformからダウンロードしたJSONファイル
#     # 任意の場所で名前を変えてもOK。
#     # 謎の不具合解消のため、最初はフルパスで記入することをおすすめ。例はwindowsだよ。
#     JSONFILE = r"clientSecret.json"

#     # ④GoogleCloudPlatformでAuth同意画面を作成する で選択したスコープのこと
#     SCOPES = [
#         'https://www.googleapis.com/auth/script.scriptapp',
#         'https://www.googleapis.com/auth/script.send_mail',
#         'https://www.googleapis.com/auth/spreadsheets'
#     ]

#     creds = None

#     # プログラムのある場所にtoken.jsonが自動で作成されます。
#     if os.path.exists('token.json'):
#         creds = Credentials.from_authorized_user_file('token.json', SCOPES)

#     # token.jsonがない場合ブラウザ上で認証画面が表示されます。
#     if not creds or not creds.valid:
#         if creds and creds.expired and creds.refresh_token:
#             creds.refresh(Request())
#         else:
#             flow = InstalledAppFlow.from_client_secrets_file(
#                 JSONFILE, SCOPES)
#             creds = flow.run_local_server(port=0)

#         with open('token.json', 'w') as token:
#             token.write(creds.to_json())
#     service = build('script', 'v1', credentials=creds)

#     # GoogleAppsScriptで呼び出す関数名の設定・パラメータの設定
#     # 下の例だと 関数名=testAPI　キー=test1値=test1の文字
#     request = {"function": "apiTest",
#                #    "parameters": {'test1': 'test1の文字', 'test2': 'test2の文字'}
#                }

#     try:

#         response = service.scripts().run(body=request,
#                                          scriptId=SCRIPT_ID).execute()

#         if 'error' in response:

#             error = response['error']['details'][0]
#             print("Script error message: {0}".format(error['errorMessage']))

#             if 'scriptStackTraceElements' in error:

#                 print("Script error stacktrace:")
#                 for trace in error['scriptStackTraceElements']:
#                     print("\t{0}: {1}".format(trace['function'],
#                                               trace['lineNumber']))
#         else:

#             # GoogleAppsScriptでreturanされた値　
#             folderSet = response['response'].get('result', {})
#             print(folderSet)

#     except errors.HttpError as e:
#         print(e.content)


# if __name__ == '__main__':
#     main()
