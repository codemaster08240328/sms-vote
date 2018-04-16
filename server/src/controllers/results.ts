import { Request, Response, NextFunction } from 'express';
import { default as EventModel, EventDocument } from '../models/Event';

/**
 * GET /
 * Vote results
 */
export let index = (req: Request, res: Response) => {
    EventModel.findById(req.params.eventId, (err, event) => {
        res.render('results', {
            title: `Results for ${event.Name}`
        });
    });
};