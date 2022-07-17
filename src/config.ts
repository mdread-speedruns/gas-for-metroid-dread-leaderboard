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
    addUser: 'addUser',
    verifyUser: 'verifyUser',
    addRecord: 'addRecord',
    deleteUser: 'deleteUser',
    deleteRecord: 'deleteRecord'
}

const GET_METHODS = {
    getRecords: 'getRecords',
    getUsers: 'getUsers'
}

// メールアドレスの正規表現
const MAILADDRESS_REGEX = /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
// パスワードの条件用正規表現
const PASSWORD_REGEX = /^[a-zA-Z0-9.?/-]{8,64}$/
const PASSWORD_MAX_RETRY = 5

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
    id?: string
    userId: string,
    realTime: number,
    inGameTime: number,
    category: string,
    difficulty: string,
    version: string,
    turbo: boolean,
    submissionDate: string,
    comment: string,
    proofLinks: string[],
    verified: boolean
};

type DoPostData = {
    authInfo?: AuthInfo,
    userInfo?: UserInfo,
    verifyInfo?: VerifyInfo,
    recordInfo?: RecordInfo
    deleteIdentifierInfo?: DeleteIdentifierInfo,
};

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