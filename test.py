from googleapiclient.discovery import build

API_KEY = "AIzaSyDcvdSNTdHDG3pnhaZOh4Sz2qtL5VYxTgE"

SAMPLE_SPREADSHEET_ID = '15qMXVPzqXtaOA3ON3I23TuEdmXR6QMwFrvXaUpyQviU'
SAMPLE_RANGE_NAME = 'Taulukko1!A1:H4'


def main():
    service = build('sheets', 'v4', developerKey=API_KEY)
    sheet = service.spreadsheets()
    result = sheet.values().get(
        spreadsheetId=SAMPLE_SPREADSHEET_ID,
        range=SAMPLE_RANGE_NAME).execute()
    values = result.get('values', [])
    print(values)


if __name__ == '__main__':
    main()
