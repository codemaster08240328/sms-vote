import { Request, Response, NextFunction } from 'express';
import { default as EventModel, EventDocument } from '../models/Event';
import { RoundConfigDTO } from '../../../shared/RoundDTO';
import { RoundContestantDTO, EventContestantDTO } from '../../../shared/ContestantDTO';
import { EventConfigDTO, EventDTO } from '../../../shared/EventDTO';
import * as utils from '../utils';
import { DataOperationResult, OperationResult, CreateOperationResult } from '../../../shared/OperationResult';
import { nextTick } from 'q/index';

export const voteSMS = async (request: Request, response: Response, next: NextFunction) => {
    response.header('Content-Type', 'text/xml');

    console.log(`voteSMS() called at ${new Date().toISOString()}`);

    const body = request.param('Body').trim();
    // the number the vote it being sent to (this should match an Event)
    const to = request.param('To').slice(1);

    // the voter, use this to keep people from voting more than once
    const from = request.param('From');
    console.log(`Vote received - Body: ${body} From: ${from} To: ${to}`);

    let events: EventDocument[];
    try {
        events = await EventModel
            .find( { PhoneNumber: to } )
            .limit(1)
            .exec();
    } catch (err) {
        console.log(err);
        response.send('<Response>Sorry! Our system encountered an error. Please try again.</Response>');
        return next(err);
    }

    const event = events[0];

    if (events.length < 1) {
        console.log(`No event is configured at this number: ${to}`);
        // silently fail for the user
        response.send('<Response><Sms>Sorry! No event is currently running at this number. Please check the number and try again.</Sms></Response>');
    }
    else if (!event.Enabled) {
        response.send('<Response><Sms>Voting is now closed.</Sms></Response>');
    }
    else if (!utils.testint(body)) {
        console.log('Bad vote: ' + event.Name + ', ' + from + ', ' + body);
        response.send('<Response><Sms>Sorry, invalid vote. Please text a number between 1 and ' + event.Contestants.length + '</Sms></Response>');
    }
    else if (!event.CurrentRound) {
        console.log(`No round is currently selected for event: ${event.Name}`);
        response.send('<Response><Sms>Voting is now closed.</Sms></Response>');
    }
    else if (utils.testint(body) && (parseInt(body) <= 0 || !event.CurrentRound.Contestants.map(c => c.ContestantNumber).contains(parseInt(body)))) {
        console.log('Bad vote: ' + event.Name + ', ' + from + ', ' + body + ', ' + ('[1-' + event.Contestants.length + ']'));
        response.send('<Response><Sms>Sorry, invalid vote. Please text a number between 1 and ' + event.Contestants.length + '</Sms></Response>');
    }
    else if (event.hasVoted(from)) {
        console.log('Denying vote: ' + event.Name + ', ' + from + ' - Already voted');
        response.send('<Response><Sms>Sorry, you are only allowed to vote once per round.</Sms></Response>');
    }
    else {
        const choice = parseInt(body);
        const registration = event.Registrations.find(r => r.PhoneNumber == from);

        event.CurrentRound.Contestants
            .find(c => c.ContestantNumber === choice)
            .Votes.push(registration);

        event.save((err) => {
            if (err) {
                response.send('<Response><Sms>We encountered an error saving your vote. Try again?</Sms></Response>');
            }
            else {
                console.log('Accepting vote: ' + event.Name + ', ' + from);
                response.send('<Response><Sms>Thanks for your vote for ' + event.Name + '. Powered by Twilio.</Sms></Response>');
            }
        });
    }
};

export const saveEvent = async (req: Request, res: Response, next: NextFunction) => {
    const dto: EventConfigDTO = req.body;
    let savedEvent: EventDocument;
    if (!dto._id) {
        const eventDTO: EventDTO = dto as EventDTO;
        eventDTO.Rounds = eventDTO.Rounds.map(r => {
                r.IsFinished = false;
                return r;
            }
        );
        const event = new EventModel(eventDTO);
        try {
            savedEvent = await event.save();
        } catch (err) {
            return next(err);
        }

        const result: DataOperationResult<EventDTO> = {
            Success: true,
            Data: savedEvent
        };
        res.json(result);
    } else {
        try {
            savedEvent = await EventModel.findByIdAndUpdate(dto._id, dto, { upsert: true });
            const result: DataOperationResult<EventDTO> = {
                Success: true,
                Data: savedEvent
            };
            res.json(result);
        } catch (err) {
            return next(err);
        }
    }
};

export const deleteEvent = (req: Request, res: Response, next: NextFunction) => {
    EventModel.findByIdAndRemove(req.params.eventId, (err, product: EventDocument) => {
        if (err) {
            return next(err);
        }

        const result: OperationResult = {
            Success: true
        };

        res.json(result);
    });
};

export const getEvents = (req: Request, res: Response, next: NextFunction) => {
    EventModel.find((err, events: EventDocument[]) => {
        if (err) {
            return next(err);
        }
        events = events.map(v => {
            v.Contestants = v.Contestants.sort((c1, c2) => c1.ContestantNumber - c2.ContestantNumber);
            return v;
        });
        res.json(events);
    });
};

export const getEvent = async (req: Request, res: Response, next: NextFunction) => {
    let event: EventDocument;
    try {
        event = await EventModel.findById(req.params.eventId);
    }
    catch (err) {
        return next(err);
    }
    event.Contestants = event.Contestants.sort((c1, c2) => c1.ContestantNumber - c2.ContestantNumber);
    res.json(event);
};

export const incrementRound = async (req: Request, res: Response, next: NextFunction) => {
    let event: EventDocument;
    try {
        event = await EventModel.findById(req.params.eventId);

        if (event.CurrentRound) { // if a round is running, complete it

            console.log(`Closing round ${event.CurrentRound.RoundNumber}`);

            const currentRound = event.Rounds
                .find(r => r.RoundNumber == event.CurrentRound.RoundNumber);
            currentRound.IsFinished = true;
            currentRound.Contestants = event.CurrentRound.Contestants;
            event.CurrentRound = null;
            const result = await event.save();
            const operationResult: DataOperationResult<EventDTO> = {
                Success: true,
                Data: result
            };
            res.json(operationResult);
        }
        else {
            const availableRounds = event.Rounds.filter(r => !r.IsFinished);
            if (availableRounds.length > 0) { // if there are any rounds left, start the next one
                const nextRound = availableRounds.reduce((prev, cur) => {
                    return prev.RoundNumber < cur.RoundNumber ? prev : cur;
                });

                console.log(`Starting round ${nextRound.RoundNumber}`);

                event.CurrentRound = nextRound;
                const result = await event.save();
                const operationResult: DataOperationResult<EventDTO> = {
                    Success: true,
                    Data: result
                };
                res.json(operationResult);
            }
            else { // can't increment because all rounds are finished. return failure.
                console.log('Attempted to increment round on finished event.');
                const operationResult: OperationResult = {
                    Success: false
                };
                res.json(operationResult);
            }
        }
    }
    catch (err) {
        return next(err);
    }
};