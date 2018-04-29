import { EventContestantDTO, RoundContestantDTO }  from './ContestantDTO';

export declare interface RoundConfigDTO {
    _id: any;
    RoundNumber: number;
    Contestants: EventContestantDTO[];
}

export declare interface RoundDTO extends RoundConfigDTO {
    Contestants: RoundContestantDTO[];
}

export default RoundDTO;