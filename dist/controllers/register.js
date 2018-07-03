"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Registration_1 = require("../models/Registration");
const Event_1 = require("../models/Event");
const utils_1 = require("../utils");
/**
 * GET /
 * Event/{eventId}/Register
 */
exports.index = async (req, res, next) => {
    let event;
    try {
        event = await Event_1.default
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
};
/**
 * GET /
 * api/Event/{eventId}/Registrations
 */
exports.getRegistrations = async (req, res, next) => {
    console.log('getRegistrations()...');
    try {
        const event = await Event_1.default.findById(req.params.eventId).populate('Registrations').exec();
        res.json(event.Registrations);
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
};
/**
 * PUT /
 * api/Event/{eventId}/Registration
 */
exports.registerVoter = async (req, res, next) => {
    const dto = req.body;
    console.log(`Registering ${dto.PhoneNumber}`);
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
        dto.PhoneNumber = utils_1.SanitizePhoneNumber(dto.PhoneNumber);
        let registration = await Registration_1.default.findOne({ PhoneNumber: dto.PhoneNumber });
        if (registration) {
            registration.FirstName = dto.FirstName;
            registration.LastName = dto.LastName;
            registration.Email = dto.Email;
            registration.PhoneNumber = dto.PhoneNumber;
        }
        else {
            registration = new Registration_1.default(dto);
        }
        const savedRegistration = await registration.save();
        const event = await Event_1.default.findById(req.params.eventId);
        const eventRegistration = event.Registrations.find(rid => rid == savedRegistration._id);
        if (!eventRegistration) {
            event.Registrations.push(savedRegistration._id);
        }
        const savedEvent = await event.save();
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
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,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V0FBVyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7U0FDOUM7YUFBTTtZQUNILFlBQVksR0FBRyxJQUFJLHNCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzdDO1FBQ0QsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNwRCxNQUFNLEtBQUssR0FBRyxNQUFNLGVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1RCxNQUFNLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hGLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUNwQixLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNuRDtRQUVELE1BQU0sVUFBVSxHQUFHLE1BQU0sS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3RDLE1BQU0sTUFBTSxHQUF5QztZQUNqRCxPQUFPLEVBQUUsSUFBSTtZQUNiLElBQUksRUFBRSxZQUFZO1NBQ3JCLENBQUM7UUFFRixPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixHQUFHLENBQUMsU0FBUyxJQUFJLEdBQUcsQ0FBQyxRQUFRLE1BQU0sR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDN0YsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNwQjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1YsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDcEI7QUFFTCxDQUFDLENBQUMiLCJmaWxlIjoiY29udHJvbGxlcnMvcmVnaXN0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCB7IGRlZmF1bHQgYXMgUmVnaXN0cmF0aW9uTW9kZWwsIFJlZ2lzdHJhdGlvbkRvY3VtZW50IH0gZnJvbSAnLi4vbW9kZWxzL1JlZ2lzdHJhdGlvbic7XHJcbmltcG9ydCBSZWdpc3RyYXRpb25EVE8gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL1JlZ2lzdHJhdGlvbkRUTyc7XHJcbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4uL3V0aWxzJztcclxuaW1wb3J0IHsgRGF0YU9wZXJhdGlvblJlc3VsdCwgT3BlcmF0aW9uUmVzdWx0LCBDcmVhdGVPcGVyYXRpb25SZXN1bHQgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvT3BlcmF0aW9uUmVzdWx0JztcclxuaW1wb3J0IHsgRXZlbnREb2N1bWVudCB9IGZyb20gJy4uL21vZGVscy9FdmVudCc7XHJcbmltcG9ydCBFdmVudE1vZGVsIGZyb20gJy4uL21vZGVscy9FdmVudCc7XHJcbmltcG9ydCAqIGFzIG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuaW1wb3J0IHsgSXNQaG9uZU51bWJlciwgU2FuaXRpemVQaG9uZU51bWJlciB9IGZyb20gJy4uL3V0aWxzJztcclxuXHJcbi8qKlxyXG4gKiBHRVQgL1xyXG4gKiBFdmVudC97ZXZlbnRJZH0vUmVnaXN0ZXJcclxuICovXHJcbmV4cG9ydCBjb25zdCBpbmRleCA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgbGV0IGV2ZW50OiBFdmVudERvY3VtZW50O1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBldmVudCA9IGF3YWl0IEV2ZW50TW9kZWxcclxuICAgICAgICAgICAgLmZpbmRCeUlkKHJlcS5wYXJhbXMuZXZlbnRJZClcclxuICAgICAgICAgICAgLmV4ZWMoKTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgcmV0dXJuIG5leHQoZXJyKTtcclxuICAgIH1cclxuICAgIHJlcy5yZW5kZXIoJ3JlZ2lzdGVyJywge1xyXG4gICAgICAgIHRpdGxlOiAnUmVnaXN0ZXIgdm90ZXJzJyxcclxuICAgICAgICBFdmVudE5hbWU6IGV2ZW50Lk5hbWVcclxuICAgIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdFVCAvXHJcbiAqIGFwaS9FdmVudC97ZXZlbnRJZH0vUmVnaXN0cmF0aW9uc1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGdldFJlZ2lzdHJhdGlvbnMgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdnZXRSZWdpc3RyYXRpb25zKCkuLi4nKTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgZXZlbnQgPSBhd2FpdCBFdmVudE1vZGVsLmZpbmRCeUlkKHJlcS5wYXJhbXMuZXZlbnRJZCkucG9wdWxhdGUoJ1JlZ2lzdHJhdGlvbnMnKS5leGVjKCk7XHJcbiAgICAgICAgcmVzLmpzb24oZXZlbnQuUmVnaXN0cmF0aW9ucyk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgIHJldHVybiBuZXh0KGVycik7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKipcclxuICogUFVUIC9cclxuICogYXBpL0V2ZW50L3tldmVudElkfS9SZWdpc3RyYXRpb25cclxuICovXHJcbmV4cG9ydCBjb25zdCByZWdpc3RlclZvdGVyID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICBjb25zdCBkdG86IFJlZ2lzdHJhdGlvbkRUTyA9IHJlcS5ib2R5O1xyXG4gICAgY29uc29sZS5sb2coYFJlZ2lzdGVyaW5nICR7ZHRvLlBob25lTnVtYmVyfWApO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBpZiAoIWR0by5QaG9uZU51bWJlcikge1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvciA9ICdJbnZhbGlkIHJlZ2lzdHJhdGlvbiByZWNvcmQuIE5vIFBob25lTnVtYmVyIHByb3ZpZGVkLic7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFJc1Bob25lTnVtYmVyKGR0by5QaG9uZU51bWJlcikpIHtcclxuICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBgSW52YWxpZCByZWdpc3RyYXRpb24gcmVjb3JkLiBQaG9uZSBOdW1iZXIgaW4gdGhlIHdyb25nIGZvcm1hdCAke2R0by5QaG9uZU51bWJlcn0uYDtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZHRvLlBob25lTnVtYmVyID0gU2FuaXRpemVQaG9uZU51bWJlcihkdG8uUGhvbmVOdW1iZXIpO1xyXG5cclxuICAgICAgICBsZXQgcmVnaXN0cmF0aW9uID0gYXdhaXQgUmVnaXN0cmF0aW9uTW9kZWwuZmluZE9uZSh7IFBob25lTnVtYmVyOiBkdG8uUGhvbmVOdW1iZXIgfSk7XHJcbiAgICAgICAgaWYgKHJlZ2lzdHJhdGlvbikge1xyXG4gICAgICAgICAgICByZWdpc3RyYXRpb24uRmlyc3ROYW1lID0gZHRvLkZpcnN0TmFtZTtcclxuICAgICAgICAgICAgcmVnaXN0cmF0aW9uLkxhc3ROYW1lID0gZHRvLkxhc3ROYW1lO1xyXG4gICAgICAgICAgICByZWdpc3RyYXRpb24uRW1haWwgPSBkdG8uRW1haWw7XHJcbiAgICAgICAgICAgIHJlZ2lzdHJhdGlvbi5QaG9uZU51bWJlciA9IGR0by5QaG9uZU51bWJlcjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZWdpc3RyYXRpb24gPSBuZXcgUmVnaXN0cmF0aW9uTW9kZWwoZHRvKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgc2F2ZWRSZWdpc3RyYXRpb24gPSBhd2FpdCByZWdpc3RyYXRpb24uc2F2ZSgpO1xyXG4gICAgICAgIGNvbnN0IGV2ZW50ID0gYXdhaXQgRXZlbnRNb2RlbC5maW5kQnlJZChyZXEucGFyYW1zLmV2ZW50SWQpO1xyXG4gICAgICAgIGNvbnN0IGV2ZW50UmVnaXN0cmF0aW9uID0gZXZlbnQuUmVnaXN0cmF0aW9ucy5maW5kKHJpZCA9PiByaWQgPT0gc2F2ZWRSZWdpc3RyYXRpb24uX2lkKTtcclxuICAgICAgICBpZiAoIWV2ZW50UmVnaXN0cmF0aW9uKSB7XHJcbiAgICAgICAgICAgIGV2ZW50LlJlZ2lzdHJhdGlvbnMucHVzaChzYXZlZFJlZ2lzdHJhdGlvbi5faWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc2F2ZWRFdmVudCA9IGF3YWl0IGV2ZW50LnNhdmUoKTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IERhdGFPcGVyYXRpb25SZXN1bHQ8UmVnaXN0cmF0aW9uRFRPPiA9IHtcclxuICAgICAgICAgICAgU3VjY2VzczogdHJ1ZSxcclxuICAgICAgICAgICAgRGF0YTogcmVnaXN0cmF0aW9uXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coYFN1Y2Nlc3NmdWxseSByZWdpc3RlcmVkICR7ZHRvLkZpcnN0TmFtZX0gJHtkdG8uTGFzdE5hbWV9IC0gJHtkdG8uUGhvbmVOdW1iZXJ9YCk7XHJcbiAgICAgICAgcmVzLmpzb24ocmVzdWx0KTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIHJldHVybiBuZXh0KGVycik7XHJcbiAgICB9XHJcblxyXG59OyJdfQ==
