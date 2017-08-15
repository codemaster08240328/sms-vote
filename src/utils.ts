export const smsify = function(str: string) {
  if (str.length <= 160) { return str; }
  else { return str.substr(0, 157) + '...'; }
};

export const initcap = function(str: string) {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
};

export const testint = function(str: string) {
  const intRegex = /^\d+$/;
  if (intRegex.test(str)) {
    return true;
  }
  return false;
};