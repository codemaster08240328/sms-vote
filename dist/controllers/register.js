"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Registration_1 = require("../models/Registration");
const Event_1 = require("../models/Event");
const utils_1 = require("../utils");
/**
 * GET /
 * Event/{eventId}/Register
 */
exports.index = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let event;
    try {
        event = yield Event_1.default
            .findById(req.params.eventId)
            .exec();
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
    res.render('register', {
        title: 'Register voters',
        EventName: event.Name
    });
});
/**
 * GET /
 * api/Event/{eventId}/Registrations
 */
exports.getRegistrations = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    console.log('getRegistrations()...');
    try {
        const event = yield Event_1.default.findById(req.params.eventId).populate('Registrations').exec();
        res.json(event.Registrations);
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
});
/**
 * PUT /
 * api/Event/{eventId}/Registration
 */
exports.registerVoter = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const dto = req.body;
    console.log(`Registering ${dto.FirstName} ${dto.LastName} - ${dto.PhoneNumber}`);
    try {
        if (!dto.PhoneNumber) {
            const error = 'Invalid registration record. No PhoneNumber provided.';
            console.error(error);
            throw error;
        }
        if (!utils_1.IsPhoneNumber(dto.PhoneNumber)) {
            const error = `Invalid registration record. Phone Number in the wrong format ${dto.PhoneNumber}.`;
            console.error(error);
            throw error;
        }
        let registration = yield Registration_1.default.findOne({ PhoneNumber: dto.PhoneNumber });
        if (registration) {
            registration.FirstName = dto.FirstName;
            registration.LastName = dto.LastName;
            registration.Email = dto.Email;
            registration.PhoneNumber = dto.PhoneNumber;
        }
        else {
            registration = new Registration_1.default(dto);
        }
        const savedRegistration = yield registration.save();
        const event = yield Event_1.default.findById(req.params.eventId);
        const eventRegistration = event.Registrations.find(rid => rid == savedRegistration.id);
        if (!eventRegistration) {
            event.Registrations.push(savedRegistration._id);
        }
        const savedEvent = yield event.save();
        const result = {
            Success: true,
            Data: registration
        };
        console.log(`Successfully registered ${dto.FirstName} ${dto.LastName} - ${dto.PhoneNumber}`);
        res.json(result);
    }
    catch (err) {
        return next(err);
    }
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,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V0FBVyxDQUFDO1NBQzlDO2FBQU07WUFDSCxZQUFZLEdBQUcsSUFBSSxzQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM3QztRQUNELE1BQU0saUJBQWlCLEdBQUcsTUFBTSxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDcEQsTUFBTSxLQUFLLEdBQUcsTUFBTSxlQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUQsTUFBTSxpQkFBaUIsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN2RixJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDcEIsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbkQ7UUFFRCxNQUFNLFVBQVUsR0FBRyxNQUFNLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN0QyxNQUFNLE1BQU0sR0FBeUM7WUFDakQsT0FBTyxFQUFFLElBQUk7WUFDYixJQUFJLEVBQUUsWUFBWTtTQUNyQixDQUFDO1FBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsR0FBRyxDQUFDLFNBQVMsSUFBSSxHQUFHLENBQUMsUUFBUSxNQUFNLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQzdGLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDcEI7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNWLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3BCO0FBRUwsQ0FBQyxDQUFBLENBQUMiLCJmaWxlIjoiY29udHJvbGxlcnMvcmVnaXN0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCB7IGRlZmF1bHQgYXMgUmVnaXN0cmF0aW9uTW9kZWwsIFJlZ2lzdHJhdGlvbkRvY3VtZW50IH0gZnJvbSAnLi4vbW9kZWxzL1JlZ2lzdHJhdGlvbic7XHJcbmltcG9ydCBSZWdpc3RyYXRpb25EVE8gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL1JlZ2lzdHJhdGlvbkRUTyc7XHJcbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4uL3V0aWxzJztcclxuaW1wb3J0IHsgRGF0YU9wZXJhdGlvblJlc3VsdCwgT3BlcmF0aW9uUmVzdWx0LCBDcmVhdGVPcGVyYXRpb25SZXN1bHQgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvT3BlcmF0aW9uUmVzdWx0JztcclxuaW1wb3J0IHsgRXZlbnREb2N1bWVudCB9IGZyb20gJy4uL21vZGVscy9FdmVudCc7XHJcbmltcG9ydCBFdmVudE1vZGVsIGZyb20gJy4uL21vZGVscy9FdmVudCc7XHJcbmltcG9ydCAqIGFzIG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuaW1wb3J0IHsgSXNQaG9uZU51bWJlciB9IGZyb20gJy4uL3V0aWxzJztcclxuXHJcbi8qKlxyXG4gKiBHRVQgL1xyXG4gKiBFdmVudC97ZXZlbnRJZH0vUmVnaXN0ZXJcclxuICovXHJcbmV4cG9ydCBjb25zdCBpbmRleCA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgbGV0IGV2ZW50OiBFdmVudERvY3VtZW50O1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBldmVudCA9IGF3YWl0IEV2ZW50TW9kZWxcclxuICAgICAgICAgICAgLmZpbmRCeUlkKHJlcS5wYXJhbXMuZXZlbnRJZClcclxuICAgICAgICAgICAgLmV4ZWMoKTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgcmV0dXJuIG5leHQoZXJyKTtcclxuICAgIH1cclxuICAgIHJlcy5yZW5kZXIoJ3JlZ2lzdGVyJywge1xyXG4gICAgICAgIHRpdGxlOiAnUmVnaXN0ZXIgdm90ZXJzJyxcclxuICAgICAgICBFdmVudE5hbWU6IGV2ZW50Lk5hbWVcclxuICAgIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdFVCAvXHJcbiAqIGFwaS9FdmVudC97ZXZlbnRJZH0vUmVnaXN0cmF0aW9uc1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGdldFJlZ2lzdHJhdGlvbnMgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdnZXRSZWdpc3RyYXRpb25zKCkuLi4nKTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgZXZlbnQgPSBhd2FpdCBFdmVudE1vZGVsLmZpbmRCeUlkKHJlcS5wYXJhbXMuZXZlbnRJZCkucG9wdWxhdGUoJ1JlZ2lzdHJhdGlvbnMnKS5leGVjKCk7XHJcbiAgICAgICAgcmVzLmpzb24oZXZlbnQuUmVnaXN0cmF0aW9ucyk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgIHJldHVybiBuZXh0KGVycik7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKipcclxuICogUFVUIC9cclxuICogYXBpL0V2ZW50L3tldmVudElkfS9SZWdpc3RyYXRpb25cclxuICovXHJcbmV4cG9ydCBjb25zdCByZWdpc3RlclZvdGVyID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICBjb25zdCBkdG86IFJlZ2lzdHJhdGlvbkRUTyA9IHJlcS5ib2R5O1xyXG4gICAgY29uc29sZS5sb2coYFJlZ2lzdGVyaW5nICR7ZHRvLkZpcnN0TmFtZX0gJHtkdG8uTGFzdE5hbWV9IC0gJHtkdG8uUGhvbmVOdW1iZXJ9YCk7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGlmICghZHRvLlBob25lTnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVycm9yID0gJ0ludmFsaWQgcmVnaXN0cmF0aW9uIHJlY29yZC4gTm8gUGhvbmVOdW1iZXIgcHJvdmlkZWQuJztcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIUlzUGhvbmVOdW1iZXIoZHRvLlBob25lTnVtYmVyKSkge1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IGBJbnZhbGlkIHJlZ2lzdHJhdGlvbiByZWNvcmQuIFBob25lIE51bWJlciBpbiB0aGUgd3JvbmcgZm9ybWF0ICR7ZHRvLlBob25lTnVtYmVyfS5gO1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcmVnaXN0cmF0aW9uID0gYXdhaXQgUmVnaXN0cmF0aW9uTW9kZWwuZmluZE9uZSh7IFBob25lTnVtYmVyOiBkdG8uUGhvbmVOdW1iZXIgfSk7XHJcbiAgICAgICAgaWYgKHJlZ2lzdHJhdGlvbikge1xyXG4gICAgICAgICAgICByZWdpc3RyYXRpb24uRmlyc3ROYW1lID0gZHRvLkZpcnN0TmFtZTtcclxuICAgICAgICAgICAgcmVnaXN0cmF0aW9uLkxhc3ROYW1lID0gZHRvLkxhc3ROYW1lO1xyXG4gICAgICAgICAgICByZWdpc3RyYXRpb24uRW1haWwgPSBkdG8uRW1haWw7XHJcbiAgICAgICAgICAgIHJlZ2lzdHJhdGlvbi5QaG9uZU51bWJlciA9IGR0by5QaG9uZU51bWJlcjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZWdpc3RyYXRpb24gPSBuZXcgUmVnaXN0cmF0aW9uTW9kZWwoZHRvKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgc2F2ZWRSZWdpc3RyYXRpb24gPSBhd2FpdCByZWdpc3RyYXRpb24uc2F2ZSgpO1xyXG4gICAgICAgIGNvbnN0IGV2ZW50ID0gYXdhaXQgRXZlbnRNb2RlbC5maW5kQnlJZChyZXEucGFyYW1zLmV2ZW50SWQpO1xyXG4gICAgICAgIGNvbnN0IGV2ZW50UmVnaXN0cmF0aW9uID0gZXZlbnQuUmVnaXN0cmF0aW9ucy5maW5kKHJpZCA9PiByaWQgPT0gc2F2ZWRSZWdpc3RyYXRpb24uaWQpO1xyXG4gICAgICAgIGlmICghZXZlbnRSZWdpc3RyYXRpb24pIHtcclxuICAgICAgICAgICAgZXZlbnQuUmVnaXN0cmF0aW9ucy5wdXNoKHNhdmVkUmVnaXN0cmF0aW9uLl9pZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzYXZlZEV2ZW50ID0gYXdhaXQgZXZlbnQuc2F2ZSgpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogRGF0YU9wZXJhdGlvblJlc3VsdDxSZWdpc3RyYXRpb25EVE8+ID0ge1xyXG4gICAgICAgICAgICBTdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgICAgICBEYXRhOiByZWdpc3RyYXRpb25cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhgU3VjY2Vzc2Z1bGx5IHJlZ2lzdGVyZWQgJHtkdG8uRmlyc3ROYW1lfSAke2R0by5MYXN0TmFtZX0gLSAke2R0by5QaG9uZU51bWJlcn1gKTtcclxuICAgICAgICByZXMuanNvbihyZXN1bHQpO1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQoZXJyKTtcclxuICAgIH1cclxuXHJcbn07Il19
