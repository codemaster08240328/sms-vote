import RegistrationDTO from './RegistrationDTO';

export declare interface ContestantDTO {
    _id: any;
    Name: string;
}

export declare interface EventContestantDTO extends ContestantDTO {
    ContestantNumber: number;
}

export declare interface RoundContestantDTO extends EventContestantDTO {
    Votes: RegistrationDTO[];
}

export default RoundContestantDTO;