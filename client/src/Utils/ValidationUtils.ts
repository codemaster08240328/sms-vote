
export function IsPhoneNumber(str: string): boolean {
    return /1\d{10}/.test(str);
}