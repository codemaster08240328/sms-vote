import { Request, Response, NextFunction } from 'express';
import { default as RegistrationModel, RegistrationDocument } from '../models/Registration';
import RegistrationDTO from '../../../shared/RegistrationDTO';
import * as utils from '../utils';
import { OperationResult, CreateOperationResult } from '../../../shared/OperationResult';
import { EventDocument } from '../models/Event';
import EventModel from '../models/Event';

/**
 * GET /
 * Event/{eventId}/Register
 */
export const index = async (req: Request, res: Response, next: NextFunction) => {
    let event: EventDocument;
    try {
        event = await EventModel
            .findById(req.params.eventId)
            .exec();
    } catch (err) {
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
export const getRegistrations = (req: Request, res: Response, next: NextFunction) => {
    RegistrationModel.find((err, registrations: RegistrationDocument[]) => {
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
export const registerVoter = (req: Request, res: Response, next: NextFunction) => {
    const dto: RegistrationDTO = req.body;

    const Registration = new RegistrationModel(dto);
    Registration.save((err: any, product: RegistrationDocument) => {
        if (err) {
            return next(err);
        }

        const result: CreateOperationResult = {
            Success: true,
            Id: product._id
        };
    });
};