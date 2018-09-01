import { Request, Response, NextFunction } from 'express';
import { default as EventModel, EventDocument } from '../models/Event';

/**
 * GET /
 * Vote results
 */
export let index = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const event = await EventModel.findById(req.params.eventId).exec();
        res.render('results', {
            title: `Results for ${event.Name}`,
            EventName: event.Name
        });
    } catch (err) {
        return next(err);
    }
};