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
exports.getRegistrations = (req, res, next) => {
    Registration_1.default.find((err, registrations) => {
        if (err) {
            return next(err);
        }
        res.json(registrations);
    });
};
/**
 * PUT /
 * api/Event/{eventId}/Registration
 */
exports.registerVoter = (req, res, next) => {
    const dto = req.body;
    const Registration = new Registration_1.default(dto);
    Registration.save((err, product) => {
        if (err) {
            return next(err);
        }
        const result = {
            Success: true,
            Id: product._id
        };
    });
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXJzL3JlZ2lzdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQSx5REFBNEY7QUFLNUYsMkNBQXlDO0FBRXpDOzs7R0FHRztBQUNVLFFBQUEsS0FBSyxHQUFHLENBQU8sR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQixFQUFFLEVBQUU7SUFDM0UsSUFBSSxLQUFvQixDQUFDO0lBQ3pCLElBQUk7UUFDQSxLQUFLLEdBQUcsTUFBTSxlQUFVO2FBQ25CLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQzthQUM1QixJQUFJLEVBQUUsQ0FBQztLQUNmO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3BCO0lBQ0QsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7UUFDbkIsS0FBSyxFQUFFLGlCQUFpQjtRQUN4QixTQUFTLEVBQUUsS0FBSyxDQUFDLElBQUk7S0FDeEIsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFBLENBQUM7QUFFRjs7O0dBR0c7QUFDVSxRQUFBLGdCQUFnQixHQUFHLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQixFQUFFLEVBQUU7SUFDaEYsc0JBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLGFBQXFDLEVBQUUsRUFBRTtRQUNsRSxJQUFJLEdBQUcsRUFBRTtZQUNMLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3BCO1FBQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM1QixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQUVGOzs7R0FHRztBQUNVLFFBQUEsYUFBYSxHQUFHLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQixFQUFFLEVBQUU7SUFDN0UsTUFBTSxHQUFHLEdBQW9CLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFFdEMsTUFBTSxZQUFZLEdBQUcsSUFBSSxzQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoRCxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBUSxFQUFFLE9BQTZCLEVBQUUsRUFBRTtRQUMxRCxJQUFJLEdBQUcsRUFBRTtZQUNMLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3BCO1FBRUQsTUFBTSxNQUFNLEdBQTBCO1lBQ2xDLE9BQU8sRUFBRSxJQUFJO1lBQ2IsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHO1NBQ2xCLENBQUM7SUFDTixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyIsImZpbGUiOiJjb250cm9sbGVycy9yZWdpc3Rlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IHsgZGVmYXVsdCBhcyBSZWdpc3RyYXRpb25Nb2RlbCwgUmVnaXN0cmF0aW9uRG9jdW1lbnQgfSBmcm9tICcuLi9tb2RlbHMvUmVnaXN0cmF0aW9uJztcclxuaW1wb3J0IFJlZ2lzdHJhdGlvbkRUTyBmcm9tICcuLi8uLi8uLi9zaGFyZWQvUmVnaXN0cmF0aW9uRFRPJztcclxuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi4vdXRpbHMnO1xyXG5pbXBvcnQgeyBPcGVyYXRpb25SZXN1bHQsIENyZWF0ZU9wZXJhdGlvblJlc3VsdCB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9PcGVyYXRpb25SZXN1bHQnO1xyXG5pbXBvcnQgeyBFdmVudERvY3VtZW50IH0gZnJvbSAnLi4vbW9kZWxzL0V2ZW50JztcclxuaW1wb3J0IEV2ZW50TW9kZWwgZnJvbSAnLi4vbW9kZWxzL0V2ZW50JztcclxuXHJcbi8qKlxyXG4gKiBHRVQgL1xyXG4gKiBFdmVudC97ZXZlbnRJZH0vUmVnaXN0ZXJcclxuICovXHJcbmV4cG9ydCBjb25zdCBpbmRleCA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgbGV0IGV2ZW50OiBFdmVudERvY3VtZW50O1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBldmVudCA9IGF3YWl0IEV2ZW50TW9kZWxcclxuICAgICAgICAgICAgLmZpbmRCeUlkKHJlcS5wYXJhbXMuZXZlbnRJZClcclxuICAgICAgICAgICAgLmV4ZWMoKTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgcmV0dXJuIG5leHQoZXJyKTtcclxuICAgIH1cclxuICAgIHJlcy5yZW5kZXIoJ3JlZ2lzdGVyJywge1xyXG4gICAgICAgIHRpdGxlOiAnUmVnaXN0ZXIgdm90ZXJzJyxcclxuICAgICAgICBFdmVudE5hbWU6IGV2ZW50Lk5hbWVcclxuICAgIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdFVCAvXHJcbiAqIGFwaS9FdmVudC97ZXZlbnRJZH0vUmVnaXN0cmF0aW9uc1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGdldFJlZ2lzdHJhdGlvbnMgPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIFJlZ2lzdHJhdGlvbk1vZGVsLmZpbmQoKGVyciwgcmVnaXN0cmF0aW9uczogUmVnaXN0cmF0aW9uRG9jdW1lbnRbXSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5leHQoZXJyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzLmpzb24ocmVnaXN0cmF0aW9ucyk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBQVVQgL1xyXG4gKiBhcGkvRXZlbnQve2V2ZW50SWR9L1JlZ2lzdHJhdGlvblxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHJlZ2lzdGVyVm90ZXIgPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIGNvbnN0IGR0bzogUmVnaXN0cmF0aW9uRFRPID0gcmVxLmJvZHk7XHJcblxyXG4gICAgY29uc3QgUmVnaXN0cmF0aW9uID0gbmV3IFJlZ2lzdHJhdGlvbk1vZGVsKGR0byk7XHJcbiAgICBSZWdpc3RyYXRpb24uc2F2ZSgoZXJyOiBhbnksIHByb2R1Y3Q6IFJlZ2lzdHJhdGlvbkRvY3VtZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV4dChlcnIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBDcmVhdGVPcGVyYXRpb25SZXN1bHQgPSB7XHJcbiAgICAgICAgICAgIFN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgICAgIElkOiBwcm9kdWN0Ll9pZFxyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxufTsiXX0=
