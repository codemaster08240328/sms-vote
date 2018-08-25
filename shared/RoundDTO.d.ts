import { RoundContestantDTO, RoundContestantConfigDTO } from './RoundContestantDTO';

export declare interface RoundConfigDTO {
    _id: any;
    RoundNumber: number;
    Contestants: RoundContestantConfigDTO[];
}

export declare interface RoundDTO extends RoundConfigDTO {
    Contestants: RoundContestantDTO[];
    IsFinished: boolean;
}

export default RoundDTO;