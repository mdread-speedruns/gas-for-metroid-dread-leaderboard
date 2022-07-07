const SHEET_ID_USER = '1h1-GOPR5VAsv1r5w_-u4c--BROWtJvvw_aWz0s6ui1k';
const SHEET_ID_USERS_RECORD = '19ixRr_8FFd6Ub10eLfcGbSRmLEec33dlCeQLHLr61qU';
const SHEET_ID_PROOF_LINK = '1AULTW4jY0624HzYrMY-jnjCG6WOOvlbBAwodhcpAEro';
const SHEET_ID_RECORD = '1xpOq-BRLotYqB1xFCJNh_WmsB2hqHdHG35CkytCc2wE';
const SHEET_ID_UNVERIFIED_RECORD = '1d9fns88mJZanbB4ujnDXm-t7AID-v2aT9PoImCREbRY';
const SHEET_ID_CATEGORY_CONFIGULATION = '13-i5MsNVe8V7KHpwlO6b07SmeJbpXppq4BwZJzH5F_g';
const SHEET_ID_CATEGORY_CONFIGULATION_SRC = '1SR0grvJIhAZzeRj9iosS32qRYS5q_03NcIDpbGURDSw';
const SHEET_ID_CATEGORY_CONFIGULATION_SRC_CE = '1uF--uKNpuS65p6nNPb1S7GVGiaCNfbMgn3v7S2m5rpc';

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

const DEPLOY_ID = 'AKfycbyqx02VzLElvtJCtKALN-IrO9DXhqgo1mvX-1bMhQUI6CPXb3LTaic9bS5NR22uhcnv';
const URL_BASE = `https://script.google.com/macros/s/${DEPLOY_ID}/exec`;

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

const MAILADDRESS_REGEX = /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;

// アカウント認証用
type AuthInfo = {
    identifier: string, // id or mail
    password: string
}

type UserInfo = {
    id: string,
    name: string,
    nameJp?: string,
    mail: string,
    password: string
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
    method: string,

    // method=getRecords でのクエリパラメータ
    verified?: boolean // undefなら全て取得
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
        userInfo?: UserInfo[],
        recordInfo?: RecordInfo[]
    }
};