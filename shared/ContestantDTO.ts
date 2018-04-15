import RegistrationDTO from './RegistrationDTO';

export declare interface ContestantConfigDTO {
    _id: string;
    Name: string;
    VoteKey: number;
}

export declare interface ContestantDTO extends ContestantConfigDTO {
    Votes: RegistrationDTO[];
}

export default ContestantDTO;