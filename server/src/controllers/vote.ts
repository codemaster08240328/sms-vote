import { Request, Response, NextFunction } from 'express';
import * as twilio from 'twilio';
import { default as VoteSource, VoteSourceModel } from '../models/VoteSource';
import twilioConfig from '../config/twilio';
import * as utils from '../utils';

export let voteSMS = (request: Request, response: Response) => {
    response.header('Content-Type', 'text/xml');
    const body = request.param('Body').trim();

    // the number the vote it being sent to (this should match an Event)
    const to = request.param('To').slice(1);

    // the voter, use this to keep people from voting more than once
    const from = request.param('From');

    VoteSource.findOne({ PhoneNumber: to, Enabled: true }, function(err, vote: VoteSourceModel) {
        if (err) {
            console.log(err);
            // silently fail for the user
            response.send('<Response></Response>');
        }
        else if (vote.Enabled === false) {
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