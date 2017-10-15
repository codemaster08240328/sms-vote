import { Request, Response, NextFunction } from 'express';
import * as twilio from 'twilio';
import { default as VoteSourceModel, VoteSourceDocument } from '../models/VoteSource';
import VoteChoiceDTO from '../../../shared/VoteChoiceDTO';
import VoteSourceDTO from '../../../shared/VoteSourceDTO';
import twilioConfig from '../config/twilio';
import * as utils from '../utils';
import { OperationResult, CreateOperationResult } from '../../../shared/OperationResult';

export const voteSMS = (request: Request, response: Response) => {
    response.header('Content-Type', 'text/xml');
    const body = request.param('Body').trim();

    // the number the vote it being sent to (this should match an Event)
    const to = request.param('To').slice(1);

    // the voter, use this to keep people from voting more than once
    const from = request.param('From');

    VoteSourceModel.find( { PhoneNumber: to } )
        .limit(1)
        .exec((err, votes: VoteSourceDocument[]) => {
        const vote = votes[0];
        if (err) {
            console.log(err);
            // silently fail for the user
            response.send('<Response></Response>');
        }
        else if (!vote.Enabled) {
            response.send('<Response><Sms>Voting is now closed.</Sms></Response>');
        }
        else if (!utils.testint(body)) {
            console.log('Bad vote: ' + vote.Name + ', ' + from + ', ' + body);
            response.send('<Response><Sms>Sorry, invalid vote. Please text a number between 1 and ' + vote.Choices.length + '</Sms></Response>');
        }
        else if (utils.testint(body) && (parseInt(body) <= 0 || parseInt(body) > vote.Choices.length)) {
            console.log('Bad vote: ' + vote.Name + ', ' + from + ', ' + body + ', ' + ('[1-' + vote.Choices.length + ']'));
            response.send('<Response><Sms>Sorry, invalid vote. Please text a number between 1 and ' + vote.Choices.length + '</Sms></Response>');
        }
        else if (vote.hasVoted(from)) {
            console.log('Denying vote: ' + vote.Name + ', ' + from);
            response.send('<Response><Sms>Sorry, you are only allowed to vote once.</Sms></Response>');
        }
        else {

            const choice = parseInt(body);

            vote.Choices[choice].Numbers.push(from);

            vote.save((err) => {
                if (err) {
                    response.send('<Response><Sms>We encountered an error saving your vote. Try again?</Sms></Response>');
                }
                else {
                    console.log('Accepting vote: ' + vote.Name + ', ' + from);
                    response.send('<Response><Sms>Thanks for your vote for ' + vote.Name + '. Powered by Twilio.</Sms></Response>');
                }
            });
        }
    });
};

export const saveVote = (req: Request, res: Response, next: NextFunction) => {
    const dto: VoteSourceDTO = req.body;
    if (!dto._id) {
        const vote = new VoteSourceModel(dto);
        vote.save((err: any, product: VoteSourceDocument) => {
            if (err) {
                return next(err);
            }

            const result: CreateOperationResult = {
                Success: true,
                Id: product._id
            };
            res.json(result);
        });
    } else {
        VoteSourceModel.findByIdAndUpdate(dto._id,
            { Name: dto.Name, PhoneNumber: dto.PhoneNumber, Enabled: dto.Enabled },
            { upsert: true },
            (err: any, product: VoteSourceDocument) => {
                if (err) {
                    return next(err);
                }

                const result: CreateOperationResult = {
                    Success: true,
                    Id: product._id
                };
                res.json(result);
            });
    }
};

export const deleteVote = (req: Request, res: Response, next: NextFunction) => {
    VoteSourceModel.findByIdAndRemove(req.params.voteId, (err, res: VoteSourceDocument) => {
        if (err) {
            return next(err);
        }

        const result: OperationResult = {
            Success: true
        };
    });
};

export const getVotes = (req: Request, res: Response, next: NextFunction) => {
    VoteSourceModel.find((err, votes: VoteSourceDocument[]) => {
        if (err) {
            return next(err);
        }
        res.json(votes);
    });
};