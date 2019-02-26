import { Request, Response, NextFunction } from 'express';
import { default as EventModel, EventDocument } from '../models/Event';
import ContestantModel from '../models/Contestant';
import { RoundDTO } from '../../../shared/RoundDTO';
import { EventContestantDTO } from '../../../shared/ContestantDTO';
import RoundContestantDTO from '../../../shared/RoundContestantDTO';
import { EventDTO } from '../../../shared/EventDTO';
import * as utils from '../utils';
import { DataOperationResult, OperationResult, CreateOperationResult } from '../../../shared/OperationResult';
import { nextTick } from 'q/index';
import * as Twilio from 'twilio';
import { IsPhoneNumber, SanitizePhoneNumber } from '../utils';
import { default as User, UserDocument } from '../models/User';
import { AuthToken } from '../../../shared/UserDTO';

export async function getAnnounce(req: Request, res: Response) {
    const event = await EventModel.findById(req.params.eventId);
    res.render('announce', {
        title: 'Announcement',
        EventName: event.Name,
        EventId: event._id
    });
  }

export const announce = async (req: Request, res: Response, next: NextFunction) => {
    console.log(`announce() called at ${new Date().toISOString()}`);

    const message = req.param('Message').trim();
    try {
        const event = await EventModel
            .findById(req.params.eventId)
            .populate('Registrations')
            .exec();

        const twilioClient = Twilio();

        event.Registrations.forEach(registrant => {
            console.log(`Sending message: ${message} From: ${event.PhoneNumber} To: ${registrant.PhoneNumber}`);
            twilioClient.messages.create({
                from: event.PhoneNumber,
                to: registrant.PhoneNumber,
                body: message
            });
        });

        req.flash('success', { msg: 'Success! Message sent to all participants!' });
        res.redirect('/');
    } catch (err) {
        console.log(err);
        return next(err);
    }

};


export const voteSMS = async (req: Request, res: Response, next: NextFunction) => {
    res.header('Content-Type', 'text/xml');

    console.log(`voteSMS() called at ${new Date().toISOString()}`);

    const body = req.param('Body').trim();
    // the number the vote it being sent to (this should match an Event)
    const to = req.param('To').slice(1);

    // the voter, use this to keep people from voting more than once
    const from = req.param('From').replace(/\D/g, '');
    console.log(`Vote received - Body: ${body} From: ${from} To: ${to}`);

    let events: EventDocument[];
    try {
        events = await EventModel
            .find(( { PhoneNumber: to, Enabled: true } ))
            .populate('Registrations')
            .populate('Contestants')
            .populate('Rounds.Contestants.Detail')
            .populate('Rounds.Contestants.Votes')
            .populate('CurrentRound.Contestants.Detail')
            .populate('CurrentRound.Contestants.Votes')
            .exec();
    } catch (err) {
        console.log(err);
        res.send('<Response>Sorry! Our system encountered an error. Please try again.</Response>');
        return next(err);
    }

    const event = events[0];

    if (!event) {
        console.log(`No event is configured at this number: ${to}`);
        res.send('<Response><Sms>No event is currently running at this number. Please check the number and try again.</Sms></Response>');
        return;
    }

    const voterRegistration = event.Registrations.find(r => r.PhoneNumber == from);

    if (!voterRegistration) {
        console.log('Phone number is not registered to vote in this event');
        res.send(`<Response><Sms>This number is not yet registered for this event. Please register and try again.</Sms></Response>`);
        return;
    } else if (!event.Enabled) {
        res.send('<Response><Sms>Voting is now closed.</Sms></Response>');
        return;
    }
    else if (!event.CurrentRound) {
        console.log(`No round is currently selected for event: ${event.Name}`);
        res.send('<Response><Sms>Voting is currently closed.</Sms></Response>');
        return;
    }

    if (event.hasVoted(from)) {
        console.log('Denying vote: ' + event.Name + ', ' + from + ' - Already voted');
        res.send('<Response><Sms>You are only allowed to vote once per round.</Sms></Response>');
        return;
    }

    const availableOptions = event.CurrentRound.Contestants
        .filter(c => c.Enabled && c.EaselNumber)
        .map(c => c.EaselNumber);
    const availableOptionsString = availableOptions.join(', ');
    if (!utils.testint(body)) {
        console.log('Bad vote: ' + event.Name + ', ' + from + ', ' + body);
        res.send(`<Response><Sms>Invalid vote. Please choose one of the following options: ${availableOptionsString} </Sms></Response>`);
        return;
    }

    const vote = parseInt(body);

    if (!availableOptions.contains(vote) ) {
        console.log('Bad vote: ' + event.Name + ', ' + from + ', ' + body + ', Available Options: ' + availableOptionsString);
        res.send(`<Response><Sms>Invalid vote. Please choose one of the following options: ${availableOptionsString} </Sms></Response>`);
        return;
    } else {
        const choice = parseInt(body);
        const registration = event.Registrations.find(r => r.PhoneNumber == from);

        const votedFor = event.CurrentRound.Contestants
            .find(c => c.EaselNumber === choice && c.Enabled);
        votedFor.Votes.push(registration);

        event.save((err) => {
            if (err) {
                res.send('<Response><Sms>We encountered an error saving your vote. Try again?</Sms></Response>');
            }
            else {
                console.log('Accepting vote: ' + votedFor.Detail.Name + ', ' + from);
                res.send('<Response><Sms>Thanks for your vote for ' + votedFor.Detail.Name + '.</Sms></Response>');
            }
        });
    }
};

export const saveEvent = async (req: Request, res: Response, next: NextFunction) => {
    const dto: EventDTO = req.body;
    console.log(`Saving event: ${dto.Name}`);
    let savedEvent: EventDocument;
    try {
        dto.PhoneNumber = dto.PhoneNumber.trim();
        if (!dto.PhoneNumber) {
            const error = 'Invalid event record. No PhoneNumber provided.';
            console.error(error);
            throw error;
        }
        if (!IsPhoneNumber(dto.PhoneNumber)) {
            const error = `Invalid event record. Phone Number in the wrong format ${dto.PhoneNumber}.`;
            console.error(error);
            throw error;
        }

        dto.PhoneNumber = SanitizePhoneNumber(dto.PhoneNumber);

        dto.Contestants.map(contestant => ContestantModel.findByIdAndUpdate(contestant._id, contestant, { upsert: true }).exec())
            .forEach(async promise => await promise);

        let event: EventDocument = await EventModel
            .findById(dto._id)
            .exec();

        if (!event) {
            const eventDTO: EventDTO = dto as EventDTO;
            eventDTO.Rounds = eventDTO.Rounds.map(r => {
                    r.IsFinished = false;
                    return r;
                }
            );

            event = new EventModel(eventDTO);
            savedEvent = await event.save();

            const result: DataOperationResult<EventDTO> = {
                Success: true,
                Data: savedEvent
            };
            res.json(result);
        } else {
            event.edit(dto);
            savedEvent = await event.save();
            const result: DataOperationResult<EventDTO> = {
                Success: true,
                Data: savedEvent
            };
            res.json(result);
        }
    }
    catch (err) {
        return next(err);
    }
};

// OBSOLETE: Never delete events
// export const deleteEvent = (req: Request, res: Response, next: NextFunction) => {
//     EventModel.findByIdAndRemove(req.params.eventId, (err, product: EventDocument) => {
//         if (err) {
//             return next(err);
//         }

//         const result: OperationResult = {
//             Success: true
//         };

//         res.json(result);
//     });
// };

export const archiveEvent = async (req: Request, res: Response, next: NextFunction) => {
    const event = await EventModel.findById(req.params.eventId);

    event.Enabled = false;

    await event.save();

    const result: OperationResult = {
        Success: true
    };

    res.json(result);
};

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: UserDocument = await User.findById(req.user.id);

        let query = EventModel.find()
            .populate('Contestants')
            .populate('Rounds.Contestants.Detail')
            .populate('Rounds.Contestants.Votes')
            .populate('CurrentRound.Contestants.Detail')
            .populate('CurrentRound.Contestants.Votes');

        if (!user.isAdmin) {
            query = query.where('Enabled').equals(true);
        }
        const events: EventDocument[] = await query.exec();

        res.json(events);
    }
    catch (err) {
        return next(err);
    }
};

export const getEvent = async (req: Request, res: Response, next: NextFunction) => {
    let event: EventDocument;
    try {
        const user: UserDocument = await User.findById(req.user.id);

        event = await EventModel
            .findById(req.params.eventId)
            .populate('Contestants')
            .populate('Rounds.Contestants.Detail')
            .populate('Rounds.Contestants.Votes')
            .populate('CurrentRound.Contestants.Detail')
            .populate('CurrentRound.Contestants.Votes')
            .exec();

        if (event.Enabled || (!user.isAdmin && !event.Enabled)) {
            res.json(event);
        }
    }
    catch (err) {
        return next(err);
    }
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