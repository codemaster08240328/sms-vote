if (!String.prototype.compareTo) {
    String.prototype.compareTo = function (s, ignoreCase) {
        return String.compareTo(this, s, ignoreCase);
    };
}
if (!String.compareTo) {
    String.compareTo = function (s1, s2, ignoreCase) {
        if (ignoreCase) {
            if (s1) {
                s1 = s1.toUpperCase();
            }
            if (s2) {
                s2 = s2.toUpperCase();
            }
        }
        s1 = s1 || '';
        s2 = s2 || '';
        if (s1 == s2) {
            return 0;
        }
        if (s1 < s2) {
            return -1;
        }
        return 1;
    };
}
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (str) {
        return this.indexOf(str) == 0;
    };
}
if (!String.isNullOrEmpty) {
    String.isNullOrEmpty = function (s) {
        return !s || !s.length;
    };
}
if (!String.concat) {
    String.concat = function () {
        if (arguments.length === 2) {
            return arguments[0] + arguments[1];
        }
        return Array.prototype.join.call(arguments, '');
    };
}
// MA: Deprecating this in favour of template strings. leaving it here in case we need it back.
if (!String.format) {
    String.format = function (format, ...values) {
        return __format(format, arguments, false);
    };
}
function __format(format, values, useLocale) {
    const _formatRE = /(\{[^\}^\{]+\})/g;
    return format.replace(_formatRE, function (str, m) {
        const index = parseInt(m.substr(1));
        const value = values[index + 1];
        if ((value === null) || (value === undefined)) {
            return '';
        }
        if (value.format) {
            let formatSpec = null;
            const formatIndex = m.indexOf(':');
            if (formatIndex > 0) {
                formatSpec = m.substring(formatIndex + 1, m.length - 1);
            }
            return value.format(formatSpec);
        }
        else {
            return value.toString();
        }
    });
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9TdHJpbmdFeHRlbnNpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVlBLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRTtJQUM3QixNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQVMsRUFBRSxVQUFtQjtRQUVqRSxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNqRCxDQUFDLENBQUM7Q0FDTDtBQUVELElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO0lBQ25CLE1BQU0sQ0FBQyxTQUFTLEdBQUcsVUFBVSxFQUFVLEVBQUUsRUFBVSxFQUFFLFVBQW1CO1FBRXBFLElBQUksVUFBVSxFQUFFO1lBQ1osSUFBSSxFQUFFLEVBQUU7Z0JBQ0osRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQzthQUN6QjtZQUNELElBQUksRUFBRSxFQUFFO2dCQUNKLEVBQUUsR0FBRyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDekI7U0FDSjtRQUNELEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDO1FBQ2QsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFFZCxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDVixPQUFPLENBQUMsQ0FBQztTQUNaO1FBQ0QsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ1QsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUNiO1FBQ0QsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDLENBQUM7Q0FDTDtBQUVELElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRTtJQUM5QixNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxVQUFVLEdBQVc7UUFDL0MsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDLENBQUM7Q0FDTDtBQUVELElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO0lBQ3ZCLE1BQU0sQ0FBQyxhQUFhLEdBQUcsVUFBVSxDQUFTO1FBQ3RDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQzNCLENBQUMsQ0FBQztDQUNMO0FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7SUFDaEIsTUFBTSxDQUFDLE1BQU0sR0FBRztRQUVaLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDeEIsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3RDO1FBQ0QsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3BELENBQUMsQ0FBQztDQUNMO0FBRUQsK0ZBQStGO0FBQy9GLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0lBQ2hCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsVUFBVSxNQUFNLEVBQUUsR0FBRyxNQUFNO1FBQ3ZDLE9BQU8sUUFBUSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDOUMsQ0FBQyxDQUFDO0NBQ0w7QUFFRCxrQkFBa0IsTUFBYyxFQUFFLE1BQWtCLEVBQUUsU0FBa0I7SUFDcEUsTUFBTyxTQUFTLEdBQVcsa0JBQWtCLENBQUM7SUFFOUMsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFDM0IsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNaLE1BQU8sS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsTUFBTyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxFQUFFO1lBQzNDLE9BQU8sRUFBRSxDQUFDO1NBQ2I7UUFDRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDZCxJQUFLLFVBQVUsR0FBVyxJQUFJLENBQUM7WUFDL0IsTUFBTyxXQUFXLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNwQyxJQUFJLFdBQVcsR0FBRyxDQUFDLEVBQUU7Z0JBQ2pCLFVBQVUsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQzthQUMzRDtZQUNELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNuQzthQUNJO1lBQ0QsT0FBTyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDM0I7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNYLENBQUMiLCJmaWxlIjoiY29tbW9uL1N0cmluZ0V4dGVuc2lvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbnRlcmZhY2UgU3RyaW5nIHtcclxuICAgIHN0YXJ0c1dpdGgoc3RyOiBzdHJpbmcpOiBib29sZWFuO1xyXG4gICAgY29tcGFyZVRvKHM6IHN0cmluZywgaWdub3JlQ2FzZTogYm9vbGVhbik6IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFN0cmluZ0NvbnN0cnVjdG9yIHtcclxuICAgIGlzTnVsbE9yRW1wdHkoczogc3RyaW5nKTogYm9vbGVhbjtcclxuICAgIGNvbmNhdCguLi5zdHJpbmdzOiBzdHJpbmdbXSk6IHN0cmluZztcclxuICAgIGZvcm1hdChmb3JtYXQ6IHN0cmluZywgLi4udmFsdWVzOiBhbnlbXSk6IHN0cmluZztcclxuICAgIGNvbXBhcmVUbyhzdHIxOiBzdHJpbmcsIHN0cjI6IHN0cmluZywgaWdub3JlQ2FzZTogYm9vbGVhbik6IG51bWJlcjtcclxufVxyXG5cclxuaWYgKCFTdHJpbmcucHJvdG90eXBlLmNvbXBhcmVUbykge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5jb21wYXJlVG8gPSBmdW5jdGlvbiAoczogc3RyaW5nLCBpZ25vcmVDYXNlOiBib29sZWFuKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBTdHJpbmcuY29tcGFyZVRvKHRoaXMsIHMsIGlnbm9yZUNhc2UpO1xyXG4gICAgfTtcclxufVxyXG5cclxuaWYgKCFTdHJpbmcuY29tcGFyZVRvKSB7XHJcbiAgICBTdHJpbmcuY29tcGFyZVRvID0gZnVuY3Rpb24gKHMxOiBzdHJpbmcsIHMyOiBzdHJpbmcsIGlnbm9yZUNhc2U6IGJvb2xlYW4pXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKGlnbm9yZUNhc2UpIHtcclxuICAgICAgICAgICAgaWYgKHMxKSB7XHJcbiAgICAgICAgICAgICAgICBzMSA9IHMxLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHMyKSB7XHJcbiAgICAgICAgICAgICAgICBzMiA9IHMyLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgczEgPSBzMSB8fCAnJztcclxuICAgICAgICBzMiA9IHMyIHx8ICcnO1xyXG5cclxuICAgICAgICBpZiAoczEgPT0gczIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzMSA8IHMyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9O1xyXG59XHJcblxyXG5pZiAoIVN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCkge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoID0gZnVuY3Rpb24gKHN0cjogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXhPZihzdHIpID09IDA7XHJcbiAgICB9O1xyXG59XHJcblxyXG5pZiAoIVN0cmluZy5pc051bGxPckVtcHR5KSB7XHJcbiAgICBTdHJpbmcuaXNOdWxsT3JFbXB0eSA9IGZ1bmN0aW9uIChzOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gIXMgfHwgIXMubGVuZ3RoO1xyXG4gICAgfTtcclxufVxyXG5cclxuaWYgKCFTdHJpbmcuY29uY2F0KSB7XHJcbiAgICBTdHJpbmcuY29uY2F0ID0gZnVuY3Rpb24gKCk6IHN0cmluZ1xyXG4gICAge1xyXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcmd1bWVudHNbMF0gKyBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuam9pbi5jYWxsKGFyZ3VtZW50cywgJycpO1xyXG4gICAgfTtcclxufVxyXG5cclxuLy8gTUE6IERlcHJlY2F0aW5nIHRoaXMgaW4gZmF2b3VyIG9mIHRlbXBsYXRlIHN0cmluZ3MuIGxlYXZpbmcgaXQgaGVyZSBpbiBjYXNlIHdlIG5lZWQgaXQgYmFjay5cclxuaWYgKCFTdHJpbmcuZm9ybWF0KSB7XHJcbiAgICBTdHJpbmcuZm9ybWF0ID0gZnVuY3Rpb24gKGZvcm1hdCwgLi4udmFsdWVzKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fZm9ybWF0KGZvcm1hdCwgYXJndW1lbnRzLCBmYWxzZSk7XHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBfX2Zvcm1hdChmb3JtYXQ6IHN0cmluZywgdmFsdWVzOiBJQXJndW1lbnRzLCB1c2VMb2NhbGU6IGJvb2xlYW4pOiBzdHJpbmcge1xyXG4gICAgY29uc3QgIF9mb3JtYXRSRTogUmVnRXhwID0gLyhcXHtbXlxcfV5cXHtdK1xcfSkvZztcclxuXHJcbiAgICByZXR1cm4gZm9ybWF0LnJlcGxhY2UoX2Zvcm1hdFJFLFxyXG4gICAgICAgIGZ1bmN0aW9uIChzdHIsIG0pIHtcclxuICAgICAgICAgICAgY29uc3QgIGluZGV4ID0gcGFyc2VJbnQobS5zdWJzdHIoMSkpO1xyXG4gICAgICAgICAgICBjb25zdCAgdmFsdWUgPSB2YWx1ZXNbaW5kZXggKyAxXTtcclxuICAgICAgICAgICAgaWYgKCh2YWx1ZSA9PT0gbnVsbCkgfHwgKHZhbHVlID09PSB1bmRlZmluZWQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbHVlLmZvcm1hdCkge1xyXG4gICAgICAgICAgICAgICAgbGV0ICBmb3JtYXRTcGVjOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgIGZvcm1hdEluZGV4ID0gbS5pbmRleE9mKCc6Jyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWF0SW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0U3BlYyA9IG0uc3Vic3RyaW5nKGZvcm1hdEluZGV4ICsgMSwgbS5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5mb3JtYXQoZm9ybWF0U3BlYyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG59Il19
