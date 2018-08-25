"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const RoundContestantSchema = new mongoose.Schema({
    Detail: { type: mongoose.Schema.Types.ObjectId, ref: 'Contestant' },
    Enabled: Boolean,
    EaselNumber: Number,
    Votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Registration' }]
});
const RoundSchema = new mongoose.Schema({
    RoundNumber: Number,
    Contestants: [RoundContestantSchema],
    IsFinished: Boolean
});
const EventSchema = new mongoose.Schema({
    Name: { type: String, unique: true },
    Contestants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contestant' }],
    Rounds: [RoundSchema],
    PhoneNumber: String,
    Registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Registration' }],
    CurrentRound: RoundSchema,
    Enabled: Boolean
});
EventSchema.methods.hasVoted = function (phoneNumber) {
    const thisEvent = this;
    return thisEvent.CurrentRound.Contestants.reduce((prev, cur) => prev.concat(cur.Votes.map(v => v.PhoneNumber)), [])
        .find(n => n === phoneNumber) ? true : false;
};
const EventModel = mongoose.model('Event', EventSchema);
exports.default = EventModel;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZGVscy9FdmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFxQztBQWFyQyxNQUFNLHFCQUFxQixHQUFvQixJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUM7SUFDL0QsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFDO0lBQ2xFLE9BQU8sRUFBRSxPQUFPO0lBQ2hCLFdBQVcsRUFBRSxNQUFNO0lBQ25CLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsY0FBYyxFQUFDLENBQUM7Q0FDeEUsQ0FBQyxDQUFDO0FBRUgsTUFBTSxXQUFXLEdBQW9CLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQztJQUNyRCxXQUFXLEVBQUUsTUFBTTtJQUNuQixXQUFXLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztJQUNwQyxVQUFVLEVBQUUsT0FBTztDQUN0QixDQUFDLENBQUM7QUFFSCxNQUFNLFdBQVcsR0FBb0IsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDO0lBQ3JELElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtJQUNwQyxXQUFXLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBQyxDQUFDO0lBQ3hFLE1BQU0sRUFBRSxDQUFDLFdBQVcsQ0FBQztJQUNyQixXQUFXLEVBQUUsTUFBTTtJQUNuQixhQUFhLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLGNBQWMsRUFBRSxDQUFDO0lBQzlFLFlBQVksRUFBRSxXQUFXO0lBQ3pCLE9BQU8sRUFBRSxPQUFPO0NBQ25CLENBQUMsQ0FBQztBQUVILFdBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxHQUFHLFVBQVMsV0FBbUI7SUFDbkQsTUFBTSxTQUFTLEdBQW1CLElBQUssQ0FBQztJQUN4QyxPQUFPLFNBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQWMsRUFBRSxHQUF1QixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1NBQzVJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDckQsQ0FBQyxDQUFDO0FBRU4sTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBZ0IsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3ZFLGtCQUFlLFVBQVUsQ0FBQyIsImZpbGUiOiJtb2RlbHMvRXZlbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5pbXBvcnQgeyBSZWdpc3RyYXRpb25TY2hlbWEgfSBmcm9tICcuL1JlZ2lzdHJhdGlvbic7XHJcbmltcG9ydCBFdmVudERUTyBmcm9tICcuLi8uLi8uLi9zaGFyZWQvRXZlbnREVE8nO1xyXG5pbXBvcnQgUm91bmREVE8gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL1JvdW5kRFRPJztcclxuaW1wb3J0IFJvdW5kQ29udGVzdGFudERUTyBmcm9tICcuLi8uLi8uLi9zaGFyZWQvUm91bmRDb250ZXN0YW50RFRPJztcclxuaW1wb3J0IFJlZ2lzdHJhdGlvbkRUTyBmcm9tICcuLi8uLi8uLi9zaGFyZWQvUmVnaXN0cmF0aW9uRFRPJztcclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50RG9jdW1lbnQgZXh0ZW5kcyBFdmVudERUTywgbW9uZ29vc2UuRG9jdW1lbnQge1xyXG4gICAgaGFzVm90ZWQocGhvbmVOdW1iZXI6IHN0cmluZyk6IGJvb2xlYW47XHJcbn1cclxuXHJcbmNvbnN0IFJvdW5kQ29udGVzdGFudFNjaGVtYTogbW9uZ29vc2UuU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgICBEZXRhaWw6IHsgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk9iamVjdElkLCByZWY6ICdDb250ZXN0YW50J30sXHJcbiAgICBFbmFibGVkOiBCb29sZWFuLFxyXG4gICAgRWFzZWxOdW1iZXI6IE51bWJlcixcclxuICAgIFZvdGVzOiBbeyB0eXBlOiBtb25nb29zZS5TY2hlbWEuVHlwZXMuT2JqZWN0SWQsIHJlZjogJ1JlZ2lzdHJhdGlvbid9XVxyXG59KTtcclxuXHJcbmNvbnN0IFJvdW5kU2NoZW1hOiBtb25nb29zZS5TY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICAgIFJvdW5kTnVtYmVyOiBOdW1iZXIsXHJcbiAgICBDb250ZXN0YW50czogW1JvdW5kQ29udGVzdGFudFNjaGVtYV0sXHJcbiAgICBJc0ZpbmlzaGVkOiBCb29sZWFuXHJcbn0pO1xyXG5cclxuY29uc3QgRXZlbnRTY2hlbWE6IG1vbmdvb3NlLlNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gICAgTmFtZTogeyB0eXBlOiBTdHJpbmcsIHVuaXF1ZTogdHJ1ZSB9LFxyXG4gICAgQ29udGVzdGFudHM6IFt7dHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk9iamVjdElkLCByZWY6ICdDb250ZXN0YW50J31dLFxyXG4gICAgUm91bmRzOiBbUm91bmRTY2hlbWFdLFxyXG4gICAgUGhvbmVOdW1iZXI6IFN0cmluZyxcclxuICAgIFJlZ2lzdHJhdGlvbnM6IFt7IHR5cGU6IG1vbmdvb3NlLlNjaGVtYS5UeXBlcy5PYmplY3RJZCwgcmVmOiAnUmVnaXN0cmF0aW9uJyB9XSxcclxuICAgIEN1cnJlbnRSb3VuZDogUm91bmRTY2hlbWEsXHJcbiAgICBFbmFibGVkOiBCb29sZWFuXHJcbn0pO1xyXG5cclxuRXZlbnRTY2hlbWEubWV0aG9kcy5oYXNWb3RlZCA9IGZ1bmN0aW9uKHBob25lTnVtYmVyOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICBjb25zdCB0aGlzRXZlbnQgPSAoPEV2ZW50RG9jdW1lbnQ+dGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXNFdmVudC5DdXJyZW50Um91bmQuQ29udGVzdGFudHMucmVkdWNlKChwcmV2OiBzdHJpbmdbXSwgY3VyOiBSb3VuZENvbnRlc3RhbnREVE8pID0+IHByZXYuY29uY2F0KGN1ci5Wb3Rlcy5tYXAodiA9PiB2LlBob25lTnVtYmVyKSksIFtdKVxyXG4gICAgICAgICAgICAuZmluZChuID0+IG4gPT09IHBob25lTnVtYmVyKSA/IHRydWUgOiBmYWxzZTtcclxuICAgIH07XHJcblxyXG5jb25zdCBFdmVudE1vZGVsID0gbW9uZ29vc2UubW9kZWw8RXZlbnREb2N1bWVudD4oJ0V2ZW50JywgRXZlbnRTY2hlbWEpO1xyXG5leHBvcnQgZGVmYXVsdCBFdmVudE1vZGVsOyJdfQ==
