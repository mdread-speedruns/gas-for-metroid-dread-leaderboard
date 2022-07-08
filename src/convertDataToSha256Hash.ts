function convertDataToSha256Hash(data: string, stretching: number, salt: string): string {
    assert(data !== undefined, 'data is undefined');
    assert(stretching > 0, 'Stretching must be greater than 0');

    let hash: string = data + salt;

    for (let i = 0; i < stretching; i++) {
        let rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, hash, Utilities.Charset.UTF_8);
        let txtHash = '';

        for (let byte of rawHash) {
            // byte: (-128 ~ 128)
            let hashVal = byte + 128;

            if (hashVal.toString(16).length == 1) {
                txtHash += '0';
            }
            txtHash += hashVal.toString(16);
        }
        hash = txtHash;
    }
    return hash;
}

function convertDataToSha256HashTest(): void {
    let startTime = new Date().getTime();
    let data = 'Hello World';
    let hash = convertDataToSha256Hash(data, 1000, 'salt');
    console.log(`Data: ${data}`);
    console.log(`Hash: ${hash}`);
    console.log(`Time: ${new Date().getTime() - startTime} ms`);
}
