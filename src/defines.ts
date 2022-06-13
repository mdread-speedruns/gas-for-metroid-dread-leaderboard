// testcase
const SHEET_ID_RUNNER = '1h1-GOPR5VAsv1r5w_-u4c--BROWtJvvw_aWz0s6ui1k';
const SHEET_ID_RUNNERS_RECORD = '19ixRr_8FFd6Ub10eLfcGbSRmLEec33dlCeQLHLr61qU';
const SHEET_ID_PROOF_LINK = '1AULTW4jY0624HzYrMY-jnjCG6WOOvlbBAwodhcpAEro';
const SHEET_ID_RECORD = '1xpOq-BRLotYqB1xFCJNh_WmsB2hqHdHG35CkytCc2wE';
const SHEET_ID_UNVERIFIED_RECORD = '1d9fns88mJZanbB4ujnDXm-t7AID-v2aT9PoImCREbRY';
const SHEET_ID_CATEGORY_CONFIGULATION = '13-i5MsNVe8V7KHpwlO6b07SmeJbpXppq4BwZJzH5F_g';
const SHEET_ID_CATEGORY_CONFIGULATION_SRC = '1SR0grvJIhAZzeRj9iosS32qRYS5q_03NcIDpbGURDSw';
const SHEET_ID_CATEGORY_CONFIGULATION_SRC_CE = '1uF--uKNpuS65p6nNPb1S7GVGiaCNfbMgn3v7S2m5rpc';

const SHEET_RUNNER_ID_LABEL = 'id';
const SHEET_RUNNER_NAME_LABEL = 'name';
const SHEET_RUNNER_NAME_JP_LABEL = 'nameJp';
const SHEET_RUNNER_MAIL_LABEL = 'mail';
const SHEET_RUNNER_PASSWORD_LABEL = 'password';

const SHEET_RECORD_ID_LABEL = 'id';
const SHEET_RECORD_RUNNER_ID_LABEL = 'runnerId';
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
// salt for password hashing
// this constant is actually not used in this script
// but it may help to understand the password hashing algorithm
// this means password hash will be different if id is changed
const PASSWORD_SALT_ITEM_COL_LABEL = SHEET_RUNNER_ID_LABEL;

// types that are used in the code
type Mailaddress = `${string}@${string}`;
type ID = string;


// interfaces for data received from the client
interface RunnerReceiver {
    id: ID,
    name: string,
    nameJp: string | null,
    mail: Mailaddress,
    password: string
}

interface RecordReceiver {
    runnerId: ID,
    realTime: number,
    inGameTime: number,
    category: string,
    difficulty: string,
    version: string,
    turbo: boolean,
    submissionDate: string,
    comment: string,
    proofLinks: string[]
    verified: boolean
}

interface AuthInfoReceiver {
    // assume id or mail is sent as a parameter, not both
    id: ID,
    mail: Mailaddress,
    password: string
}

interface IdReceiver {
    id: ID
}

interface DataReceiver {
    method: string;
    data: {
        [key: string]: RecordReceiver | AuthInfoReceiver | RunnerReceiver;
    } | null;
}


// interfaces for data send to the client
interface RunnerSender {
    id: ID,
    name: string,
    nameJp: string | null,
    mail: Mailaddress,
    password: string
}


interface RecordSender {
    id: ID,
    runnerId: ID,
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
}


interface AuthInfoSender {
    id: ID,
    name: string,
    nameJp: string | null,
    mail: Mailaddress,
    password: string
}


interface IdSender {
    id: ID
}


interface DataSender {
    status: string,
    message: string,
    data: RunnerSender | RecordSender | AuthInfoSender | IdSender | null;
}
