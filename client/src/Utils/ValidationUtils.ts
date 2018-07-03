
export function IsPhoneNumber(str: string): boolean {
    return /1\d{10}/.test(str) || /^([2-9])(\d{9})/.test(str);
}