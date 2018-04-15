import { Request, Response, NextFunction } from 'express';
import { default as RegistrationModel, RegistrationDocument } from '../models/Registration';
import RegistrationDTO from '../../../shared/RegistrationDTO';
import * as utils from '../utils';
import { OperationResult, CreateOperationResult } from '../../../shared/OperationResult';

/**
 * GET /
 * Event/{eventId}/Register
 */
export const register = (req: Request, res: Response, next: NextFunction) => {
    res.render('voterRegistration', {
        title: 'Register voters',
        EventName: 'PLACEHOLDER'
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