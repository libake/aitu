export function phone(s: string) {
    let reg = /^1[3-9]\d{9}$/;
    if (reg.test(s)) {
        return true;
    }
    return false;
}