"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsify = function (str) {
    if (str.length <= 160) {
        return str;
    }
    else {
        return str.substr(0, 157) + '...';
    }
};
exports.initcap = function (str) {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
};
exports.testint = function (str) {
    const intRegex = /^\d+$/;
    if (intRegex.test(str)) {
        return true;
    }
    return false;
};
function IsPhoneNumber(str) {
    return /1\d{10}/.test(str) || /^([2-9])(\d{9})/.test(str);
}
exports.IsPhoneNumber = IsPhoneNumber;
function SanitizePhoneNumber(str) {
    if (str.startsWith('+')) {
        str = str.replace(/D/g, '');
    }
    if (/^1\d{10}/.test(str)) {
        return str;
    }
    else {
        return `1${str}`;
    }
}
exports.SanitizePhoneNumber = SanitizePhoneNumber;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQWEsUUFBQSxNQUFNLEdBQUcsVUFBUyxHQUFXO0lBQ3hDLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7UUFDckIsT0FBTyxHQUFHLENBQUM7S0FDWjtTQUFNO1FBQ0wsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7S0FDbkM7QUFDSCxDQUFDLENBQUM7QUFFVyxRQUFBLE9BQU8sR0FBRyxVQUFTLEdBQVc7SUFDekMsT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlELENBQUMsQ0FBQztBQUVXLFFBQUEsT0FBTyxHQUFHLFVBQVMsR0FBVztJQUN6QyxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDekIsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3RCLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMsQ0FBQztBQUVGLHVCQUE4QixHQUFXO0lBQ3ZDLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUQsQ0FBQztBQUZELHNDQUVDO0FBRUQsNkJBQW9DLEdBQVc7SUFDM0MsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3JCLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztLQUMvQjtJQUNELElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUN0QixPQUFPLEdBQUcsQ0FBQztLQUNkO1NBQU07UUFDSCxPQUFPLElBQUksR0FBRyxFQUFFLENBQUM7S0FDcEI7QUFDTCxDQUFDO0FBVEQsa0RBU0MiLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3Qgc21zaWZ5ID0gZnVuY3Rpb24oc3RyOiBzdHJpbmcpIHtcclxuICBpZiAoc3RyLmxlbmd0aCA8PSAxNjApIHtcclxuICAgIHJldHVybiBzdHI7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBzdHIuc3Vic3RyKDAsIDE1NykgKyAnLi4uJztcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgaW5pdGNhcCA9IGZ1bmN0aW9uKHN0cjogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIHN0ci5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKSArIHN0ci5zdWJzdHJpbmcoMSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgdGVzdGludCA9IGZ1bmN0aW9uKHN0cjogc3RyaW5nKSB7XHJcbiAgY29uc3QgaW50UmVnZXggPSAvXlxcZCskLztcclxuICBpZiAoaW50UmVnZXgudGVzdChzdHIpKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIElzUGhvbmVOdW1iZXIoc3RyOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICByZXR1cm4gLzFcXGR7MTB9Ly50ZXN0KHN0cikgfHwgL14oWzItOV0pKFxcZHs5fSkvLnRlc3Qoc3RyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFNhbml0aXplUGhvbmVOdW1iZXIoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgaWYgKHN0ci5zdGFydHNXaXRoKCcrJykpIHtcclxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvRC9nLCAnJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoL14xXFxkezEwfS8udGVzdChzdHIpKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGAxJHtzdHJ9YDtcclxuICAgIH1cclxufVxyXG4iXX0=
