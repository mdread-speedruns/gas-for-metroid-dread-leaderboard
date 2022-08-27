const ScriptProperty = PropertiesService.getScriptProperties();

const SHEET_ID_USER = ScriptProperty.getProperty("SHEET_ID_USER");
const SHEET_ID_USERS_RECORD = ScriptProperty.getProperty("SHEET_ID_USERS_RECORD");
const SHEET_ID_PROOF_LINK = ScriptProperty.getProperty("SHEET_ID_PROOF_LINK");
const SHEET_ID_RECORD = ScriptProperty.getProperty("SHEET_ID_RECORD");
const SHEET_ID_UNVERIFIED_RECORD = ScriptProperty.getProperty("SHEET_ID_UNVERIFIED_RECORD");
const SHEET_ID_CATEGORY_CONFIGULATION = ScriptProperty.getProperty("SHEET_ID_CATEGORY_CONFIGULATION");
const SHEET_ID_CATEGORY_CONFIGULATION_SRC = ScriptProperty.getProperty("SHEET_ID_CATEGORY_CONFIGULATION_SRC");
const SHEET_ID_CATEGORY_CONFIGULATION_SRC_CE = ScriptProperty.getProperty("SHEET_ID_CATEGORY_CONFIGULATION_SRC_CE");

const DEPLOY_ID = 'AKfycbw2bcLYmDU0gG87zjxi7KvQzQbWVvoh5gvNDc3He8HvMk1-YtKeshadr9zaPfzWMSd0XQ';
const URL_BASE = `https://script.google.com/macros/s/${DEPLOY_ID}/exec`;

const SHEET_USER_ID_LABEL = 'id';
const SHEET_USER_NAME_LABEL = 'name';
const SHEET_USER_NAME_JP_LABEL = 'nameJp';
const SHEET_USER_MAIL_LABEL = 'mail';
const SHEET_USER_PASSWORD_LABEL = 'password';
const SHEET_USER_REGISTERED_DATE_LABEL = 'registeredDate';
const SHEET_USER_VERIFIED_LABEL = 'verified';
const SHEET_USER_VERIFY_TOKEN_LABEL = 'verifyToken';

const SHEET_RECORD_ID_LABEL = 'id';
const SHEET_RECORD_USER_ID_LABEL = 'userId';
const SHEET_RECORD_REAL_TIME_LABEL = 'realTime';
const SHEET_RECORD_IN_GAME_TIME_LABEL = 'inGameTime';
const SHEET_RECORD_CATEGORY_LABEL = 'category';
const SHEET_RECORD_DIFFICULTY_LABEL = 'difficulty';
const SHEET_RECORD_VERSION_LABEL = 'version';
const SHEET_RECORD_TURBO_LABEL = 'turbo';
const SHEET_RECORD_SUBMISSION_DATE_LABEL = 'submissionDate';
const SHEET_RECORD_COMMENT_LABEL = 'comment';

const SHEET_PROOF_LINK_RECORD_ID_LABEL = 'recordId';
const SHEET_PROOF_LINK_URL_LABEL = 'url';

const SRC_API_GAME = 'https://www.speedrun.com/api/v1/games?abbreviation=mdread&embed=categories';
const SRC_API_GAME_CE = 'https://www.speedrun.com/api/v1/games?abbreviation=mdreadce&embed=categories';

const PASSWORD_STRETCHING_TIMES = 1000;
const PASSWORD_SALT_ITEM_COL_LABEL = SHEET_USER_ID_LABEL;

const POST_METHODS = {
    addUser: addUser,
    verifyUser: verifyUser,
    addRecord: addRecord,
    deleteUser: deleteUser,
    deleteRecord: deleteRecord
}

const GET_METHODS = {
    getRecords: getRecords,
    getUsers: getUsers
}

const STATUS_SUCCESS = "Success"
const STATUS_ERROR = "Error"

// メールアドレスの正規表現
const MAILADDRESS_REGEX = /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
// パスワードの条件用正規表現
// 小文字の半角アルファベット、半角数字を最低1文字以上含む
const PASSWORD_REGEX = /^(?=.*?[a-z])(?=.*?\d)[a-zA-Z\d]{8,64}$/
const PASSWORD_MAX_RETRY = 5
// ユーザーIDの条件用正規表現
const USER_ID_REGEX = /^[a-zA-Z\d]{8,64}$/

// ユーザー認証用トークンの最大桁数
const MAX_TOKEN_DIGITS_FOR_USER_VERIFYING = 6;
// ユーザー認証用トークンのメール整形用関数
const MAIL_TITLE_FOR_USER_VERIFYING = '[Metroid Dread Leaderboard Team] Verify your account';
const MAIL_BODY_FOR_USER_VERIFYING = (userName, token) => `<!DOCTYPE html>
<html>
  <head>
    <title>[Metroid Dread Leaderboard Team] Register Token</title>
  </head>
  <body style="color: #303030; padding: 8px">
    <p>
      <span style="font-family: Roboto, sans-serif; font-size: 16px;">
        <p>Hi ${userName},</token>
        <p>Your register token is <strong>${token}</strong>. It will be discarded in an hour.</p>
      </span>
    </p>
  </body>
</html>`

// アカウント認証用
type AuthInfo = {
    identifier: string, // id or mail
    password: string
};

type UserInfo = {
    id: string,
    name: string,
    nameJp?: string,
    mail: string,
    password: string
};

type SecureUserInfo = {
    id: string,
    name: string,
    nameJp?: string,
};

type VerifyInfo = {
    token: string
};

type DeleteIdentifierInfo = {
    identifier: string
};

type RecordInfo = {
    userId: string,
    realTime: string,
    inGameTime: string,
    category: string,
    difficulty: string,
    version: string,
    turbo: boolean,
    comment: string,
    proofLinks: string[],

    // 返り値専用
    id?: string,             // UUID
    submissionDate?: string, // ISO-format
    verified?: boolean,
};

// 各POSTメソッドが要するデータ
type AddUserData = {
    userInfo: UserInfo,
}

type AddRecordData = {
    authInfo: AuthInfo,
    recordInfo: RecordInfo,
}

type VerifyUserData = {
    authInfo: AuthInfo,
    verifyInfo: VerifyInfo
}

type DeleteUserData = {
    authInfo: AuthInfo,
    deleteIdentifierInfo: DeleteIdentifierInfo,
}

type DeleteRecordData = {
    authInfo: AuthInfo,
    deleteIdentifierInfo: DeleteIdentifierInfo,
}

type DoGetParams = {
    // getRecords: IDを絞る(unused)
    // getUsers: 特定のユーザーで絞る(unused)
    id?: string,

    // getRecords: 承認済みの記録で絞る
    verified?: boolean | "all",

    // getRecords: ユーザーで絞る(unused)
    userId?: string
};

type PostStatusResponder = {
    status: string,
    message: string,
    data?: {
        userInfo?: UserInfo,
        verifyInfo?: VerifyInfo,
        recordInfo?: RecordInfo
        deleteIdentifierInfo?: DeleteIdentifierInfo,
    }
};

type GetStatusResponder = {
    status: string,
    message: string,
    data?: {
        userInfo?: SecureUserInfo[],
        recordInfo?: RecordInfo[]
    }
};