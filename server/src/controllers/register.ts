import { Request, Response, NextFunction } from 'express';
import { default as RegistrationModel, RegistrationDocument } from '../models/Registration';
import RegistrationDTO from '../../../shared/RegistrationDTO';
import * as utils from '../utils';
import { DataOperationResult, OperationResult, CreateOperationResult } from '../../../shared/OperationResult';
import { EventDocument } from '../models/Event';
import EventModel from '../models/Event';
import * as mongoose from 'mongoose';
import { IsPhoneNumber, SanitizePhoneNumber } from '../utils';
import * as Twilio from 'twilio';

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
export const getRegistrations = async (req: Request, res: Response, next: NextFunction) => {
    console.log('getRegistrations()...');
    try {
        const event = await EventModel.findById(req.params.eventId).populate('Registrations').exec();
        res.json(event.Registrations);
    } catch (err) {
        console.log(err);
        return next(err);
    }
};

/**
 * PUT /
 * api/Event/{eventId}/Registration
 */
export const registerVoter = async (req: Request, res: Response, next: NextFunction) => {
    const dto: RegistrationDTO = req.body;
    console.log(`Registering ${dto.PhoneNumber}`);
    try {
        if (!dto.PhoneNumber) {
            const error = 'Invalid registration record. No PhoneNumber provided.';
            console.error(error);
            throw error;
        }
        if (!IsPhoneNumber(dto.PhoneNumber)) {
            const error = `Invalid registration record. Phone Number in the wrong format ${dto.PhoneNumber}.`;
            console.error(error);
            throw error;
        }

        dto.PhoneNumber = SanitizePhoneNumber(dto.PhoneNumber);

        let registration = await RegistrationModel.findOne({ PhoneNumber: dto.PhoneNumber });
        if (registration) {
            registration.FirstName = dto.FirstName;
            registration.LastName = dto.LastName;
            registration.Email = dto.Email;
            registration.PhoneNumber = dto.PhoneNumber;
        } else {
            registration = new RegistrationModel(dto);
        }
        const savedRegistration = await registration.save();
        const event = await EventModel.findById(req.params.eventId);
        const eventRegistration = event.Registrations.find(rid => rid == savedRegistration._id);
        if (!eventRegistration) {
            event.Registrations.push(savedRegistration._id);
        }

        const savedEvent = await event.save();
        const result: DataOperationResult<RegistrationDTO> = {
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
    } catch (err) {
        return next(err);
    }

};