"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Registration_1 = require("../models/Registration");
const Event_1 = require("../models/Event");
const Twilio = require("twilio");
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
        // ignore phone number validation for now
        // if (!IsPhoneNumber(dto.PhoneNumber)) {
        //     const error = `Invalid registration record. Phone Number in the wrong format ${dto.PhoneNumber}.`;
        //     console.error(error);
        //     throw error;
        // }
        // dto.PhoneNumber = SanitizePhoneNumber(dto.PhoneNumber);
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
        const twilioClient = Twilio();
        twilioClient.messages.create({
            from: event.PhoneNumber,
            to: dto.PhoneNumber,
            body: event.RegistrationConfirmationMessage
        });
        console.log(`Successfully registered ${dto.FirstName} ${dto.LastName} - ${dto.PhoneNumber}`);
        res.json(result);
    }
    catch (err) {
        return next(err);
    }
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,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UUFDcEQsTUFBTSxLQUFLLEdBQUcsTUFBTSxlQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUQsTUFBTSxpQkFBaUIsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4RixJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDcEIsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbkQ7UUFFRCxNQUFNLFVBQVUsR0FBRyxNQUFNLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN0QyxNQUFNLE1BQU0sR0FBeUM7WUFDakQsT0FBTyxFQUFFLElBQUk7WUFDYixJQUFJLEVBQUUsWUFBWTtTQUNyQixDQUFDO1FBRUYsTUFBTSxZQUFZLEdBQUcsTUFBTSxFQUFFLENBQUM7UUFDOUIsWUFBWSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDekIsSUFBSSxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQ3ZCLEVBQUUsRUFBRSxHQUFHLENBQUMsV0FBVztZQUNuQixJQUFJLEVBQUUsS0FBSyxDQUFDLCtCQUErQjtTQUM5QyxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixHQUFHLENBQUMsU0FBUyxJQUFJLEdBQUcsQ0FBQyxRQUFRLE1BQU0sR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDN0YsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNwQjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1YsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDcEI7QUFFTCxDQUFDLENBQUMiLCJmaWxlIjoiY29udHJvbGxlcnMvcmVnaXN0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCB7IGRlZmF1bHQgYXMgUmVnaXN0cmF0aW9uTW9kZWwsIFJlZ2lzdHJhdGlvbkRvY3VtZW50IH0gZnJvbSAnLi4vbW9kZWxzL1JlZ2lzdHJhdGlvbic7XHJcbmltcG9ydCBSZWdpc3RyYXRpb25EVE8gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL1JlZ2lzdHJhdGlvbkRUTyc7XHJcbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4uL3V0aWxzJztcclxuaW1wb3J0IHsgRGF0YU9wZXJhdGlvblJlc3VsdCwgT3BlcmF0aW9uUmVzdWx0LCBDcmVhdGVPcGVyYXRpb25SZXN1bHQgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvT3BlcmF0aW9uUmVzdWx0JztcclxuaW1wb3J0IHsgRXZlbnREb2N1bWVudCB9IGZyb20gJy4uL21vZGVscy9FdmVudCc7XHJcbmltcG9ydCBFdmVudE1vZGVsIGZyb20gJy4uL21vZGVscy9FdmVudCc7XHJcbmltcG9ydCAqIGFzIG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuaW1wb3J0IHsgSXNQaG9uZU51bWJlciwgU2FuaXRpemVQaG9uZU51bWJlciB9IGZyb20gJy4uL3V0aWxzJztcclxuaW1wb3J0ICogYXMgVHdpbGlvIGZyb20gJ3R3aWxpbyc7XHJcblxyXG4vKipcclxuICogR0VUIC9cclxuICogRXZlbnQve2V2ZW50SWR9L1JlZ2lzdGVyXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgaW5kZXggPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIGxldCBldmVudDogRXZlbnREb2N1bWVudDtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgZXZlbnQgPSBhd2FpdCBFdmVudE1vZGVsXHJcbiAgICAgICAgICAgIC5maW5kQnlJZChyZXEucGFyYW1zLmV2ZW50SWQpXHJcbiAgICAgICAgICAgIC5leGVjKCk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgIHJldHVybiBuZXh0KGVycik7XHJcbiAgICB9XHJcbiAgICByZXMucmVuZGVyKCdyZWdpc3RlcicsIHtcclxuICAgICAgICB0aXRsZTogJ1JlZ2lzdGVyIHZvdGVycycsXHJcbiAgICAgICAgRXZlbnROYW1lOiBldmVudC5OYW1lXHJcbiAgICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHRVQgL1xyXG4gKiBhcGkvRXZlbnQve2V2ZW50SWR9L1JlZ2lzdHJhdGlvbnNcclxuICovXHJcbmV4cG9ydCBjb25zdCBnZXRSZWdpc3RyYXRpb25zID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnZ2V0UmVnaXN0cmF0aW9ucygpLi4uJyk7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGV2ZW50ID0gYXdhaXQgRXZlbnRNb2RlbC5maW5kQnlJZChyZXEucGFyYW1zLmV2ZW50SWQpLnBvcHVsYXRlKCdSZWdpc3RyYXRpb25zJykuZXhlYygpO1xyXG4gICAgICAgIHJlcy5qc29uKGV2ZW50LlJlZ2lzdHJhdGlvbnMpO1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICByZXR1cm4gbmV4dChlcnIpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFBVVCAvXHJcbiAqIGFwaS9FdmVudC97ZXZlbnRJZH0vUmVnaXN0cmF0aW9uXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcmVnaXN0ZXJWb3RlciA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgY29uc3QgZHRvOiBSZWdpc3RyYXRpb25EVE8gPSByZXEuYm9keTtcclxuICAgIGNvbnNvbGUubG9nKGBSZWdpc3RlcmluZyAke2R0by5QaG9uZU51bWJlcn1gKTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgaWYgKCFkdG8uUGhvbmVOdW1iZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgZXJyb3IgPSAnSW52YWxpZCByZWdpc3RyYXRpb24gcmVjb3JkLiBObyBQaG9uZU51bWJlciBwcm92aWRlZC4nO1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBpZ25vcmUgcGhvbmUgbnVtYmVyIHZhbGlkYXRpb24gZm9yIG5vd1xyXG4gICAgICAgIC8vIGlmICghSXNQaG9uZU51bWJlcihkdG8uUGhvbmVOdW1iZXIpKSB7XHJcbiAgICAgICAgLy8gICAgIGNvbnN0IGVycm9yID0gYEludmFsaWQgcmVnaXN0cmF0aW9uIHJlY29yZC4gUGhvbmUgTnVtYmVyIGluIHRoZSB3cm9uZyBmb3JtYXQgJHtkdG8uUGhvbmVOdW1iZXJ9LmA7XHJcbiAgICAgICAgLy8gICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIC8vICAgICB0aHJvdyBlcnJvcjtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIC8vIGR0by5QaG9uZU51bWJlciA9IFNhbml0aXplUGhvbmVOdW1iZXIoZHRvLlBob25lTnVtYmVyKTtcclxuXHJcbiAgICAgICAgbGV0IHJlZ2lzdHJhdGlvbiA9IGF3YWl0IFJlZ2lzdHJhdGlvbk1vZGVsLmZpbmRPbmUoeyBQaG9uZU51bWJlcjogZHRvLlBob25lTnVtYmVyIH0pO1xyXG4gICAgICAgIGlmIChyZWdpc3RyYXRpb24pIHtcclxuICAgICAgICAgICAgcmVnaXN0cmF0aW9uLkZpcnN0TmFtZSA9IGR0by5GaXJzdE5hbWU7XHJcbiAgICAgICAgICAgIHJlZ2lzdHJhdGlvbi5MYXN0TmFtZSA9IGR0by5MYXN0TmFtZTtcclxuICAgICAgICAgICAgcmVnaXN0cmF0aW9uLkVtYWlsID0gZHRvLkVtYWlsO1xyXG4gICAgICAgICAgICByZWdpc3RyYXRpb24uUGhvbmVOdW1iZXIgPSBkdG8uUGhvbmVOdW1iZXI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVnaXN0cmF0aW9uID0gbmV3IFJlZ2lzdHJhdGlvbk1vZGVsKGR0byk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHNhdmVkUmVnaXN0cmF0aW9uID0gYXdhaXQgcmVnaXN0cmF0aW9uLnNhdmUoKTtcclxuICAgICAgICBjb25zdCBldmVudCA9IGF3YWl0IEV2ZW50TW9kZWwuZmluZEJ5SWQocmVxLnBhcmFtcy5ldmVudElkKTtcclxuICAgICAgICBjb25zdCBldmVudFJlZ2lzdHJhdGlvbiA9IGV2ZW50LlJlZ2lzdHJhdGlvbnMuZmluZChyaWQgPT4gcmlkID09IHNhdmVkUmVnaXN0cmF0aW9uLl9pZCk7XHJcbiAgICAgICAgaWYgKCFldmVudFJlZ2lzdHJhdGlvbikge1xyXG4gICAgICAgICAgICBldmVudC5SZWdpc3RyYXRpb25zLnB1c2goc2F2ZWRSZWdpc3RyYXRpb24uX2lkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHNhdmVkRXZlbnQgPSBhd2FpdCBldmVudC5zYXZlKCk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBEYXRhT3BlcmF0aW9uUmVzdWx0PFJlZ2lzdHJhdGlvbkRUTz4gPSB7XHJcbiAgICAgICAgICAgIFN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgICAgIERhdGE6IHJlZ2lzdHJhdGlvblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IHR3aWxpb0NsaWVudCA9IFR3aWxpbygpO1xyXG4gICAgICAgIHR3aWxpb0NsaWVudC5tZXNzYWdlcy5jcmVhdGUoe1xyXG4gICAgICAgICAgICBmcm9tOiBldmVudC5QaG9uZU51bWJlcixcclxuICAgICAgICAgICAgdG86IGR0by5QaG9uZU51bWJlcixcclxuICAgICAgICAgICAgYm9keTogZXZlbnQuUmVnaXN0cmF0aW9uQ29uZmlybWF0aW9uTWVzc2FnZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhgU3VjY2Vzc2Z1bGx5IHJlZ2lzdGVyZWQgJHtkdG8uRmlyc3ROYW1lfSAke2R0by5MYXN0TmFtZX0gLSAke2R0by5QaG9uZU51bWJlcn1gKTtcclxuICAgICAgICByZXMuanNvbihyZXN1bHQpO1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQoZXJyKTtcclxuICAgIH1cclxuXHJcbn07Il19
