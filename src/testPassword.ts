function testPassword(password: string): boolean {
    return PASSWORD_REGEX.test(password);
}