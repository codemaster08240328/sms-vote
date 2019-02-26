"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("../models/Event");
/**
 * GET /
 * Vote results
 */
exports.index = async (req, res, next) => {
    try {
        const event = await Event_1.default.findById(req.params.eventId).exec();
        res.render('results', {
            title: `Results for ${event.Name}`,
            EventName: event.Name
        });
    }
    catch (err) {
        return next(err);
    }
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXJzL3Jlc3VsdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwyQ0FBdUU7QUFFdkU7OztHQUdHO0FBQ1EsUUFBQSxLQUFLLEdBQUcsS0FBSyxFQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0IsRUFBRSxFQUFFO0lBQ3hFLElBQUk7UUFDQSxNQUFNLEtBQUssR0FBRyxNQUFNLGVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuRSxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUNsQixLQUFLLEVBQUUsZUFBZSxLQUFLLENBQUMsSUFBSSxFQUFFO1lBQ2xDLFNBQVMsRUFBRSxLQUFLLENBQUMsSUFBSTtTQUN4QixDQUFDLENBQUM7S0FDTjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1YsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDcEI7QUFDTCxDQUFDLENBQUMiLCJmaWxlIjoiY29udHJvbGxlcnMvcmVzdWx0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IHsgZGVmYXVsdCBhcyBFdmVudE1vZGVsLCBFdmVudERvY3VtZW50IH0gZnJvbSAnLi4vbW9kZWxzL0V2ZW50JztcclxuXHJcbi8qKlxyXG4gKiBHRVQgL1xyXG4gKiBWb3RlIHJlc3VsdHNcclxuICovXHJcbmV4cG9ydCBsZXQgaW5kZXggPSBhc3luYyhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBldmVudCA9IGF3YWl0IEV2ZW50TW9kZWwuZmluZEJ5SWQocmVxLnBhcmFtcy5ldmVudElkKS5leGVjKCk7XHJcbiAgICAgICAgcmVzLnJlbmRlcigncmVzdWx0cycsIHtcclxuICAgICAgICAgICAgdGl0bGU6IGBSZXN1bHRzIGZvciAke2V2ZW50Lk5hbWV9YCxcclxuICAgICAgICAgICAgRXZlbnROYW1lOiBldmVudC5OYW1lXHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICByZXR1cm4gbmV4dChlcnIpO1xyXG4gICAgfVxyXG59OyJdfQ==
