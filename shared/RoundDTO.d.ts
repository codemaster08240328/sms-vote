import {ContestantDTO, ContestantConfigDTO}  from './ContestantDTO';

export declare interface RoundConfigDTO {
    _id: any;
    RoundNumber: number;
    Contestants: ContestantConfigDTO[];
}

export declare interface RoundDTO extends RoundConfigDTO {
    Contestants: ContestantDTO[];
}

export default RoundDTO;