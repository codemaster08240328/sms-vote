"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("../models/Event");
/**
 * GET /
 * Vote results
 */
exports.index = (req, res) => {
    Event_1.default.findById(req.params.eventId, (err, event) => {
        res.render('results', {
            title: `Results for ${event.Name}`,
            EventName: event.Name
        });
    });
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXJzL3Jlc3VsdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwyQ0FBdUU7QUFFdkU7OztHQUdHO0FBQ1EsUUFBQSxLQUFLLEdBQUcsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLEVBQUU7SUFDL0MsZUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUNuRCxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUNsQixLQUFLLEVBQUUsZUFBZSxLQUFLLENBQUMsSUFBSSxFQUFFO1lBQ2xDLFNBQVMsRUFBRSxLQUFLLENBQUMsSUFBSTtTQUN4QixDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyIsImZpbGUiOiJjb250cm9sbGVycy9yZXN1bHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UsIE5leHRGdW5jdGlvbiB9IGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgeyBkZWZhdWx0IGFzIEV2ZW50TW9kZWwsIEV2ZW50RG9jdW1lbnQgfSBmcm9tICcuLi9tb2RlbHMvRXZlbnQnO1xyXG5cclxuLyoqXHJcbiAqIEdFVCAvXHJcbiAqIFZvdGUgcmVzdWx0c1xyXG4gKi9cclxuZXhwb3J0IGxldCBpbmRleCA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgIEV2ZW50TW9kZWwuZmluZEJ5SWQocmVxLnBhcmFtcy5ldmVudElkLCAoZXJyLCBldmVudCkgPT4ge1xyXG4gICAgICAgIHJlcy5yZW5kZXIoJ3Jlc3VsdHMnLCB7XHJcbiAgICAgICAgICAgIHRpdGxlOiBgUmVzdWx0cyBmb3IgJHtldmVudC5OYW1lfWAsXHJcbiAgICAgICAgICAgIEV2ZW50TmFtZTogZXZlbnQuTmFtZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07Il19
