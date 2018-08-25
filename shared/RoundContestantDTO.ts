import { ContestantDTO } from './ContestantDTO';
import RegistrationDTO from './RegistrationDTO';

export declare interface RoundContestantConfigDTO {
    _id: any;
    Detail: ContestantDTO;
    Enabled: boolean;
    EaselNumber: number;
}

export declare interface RoundContestantDTO extends RoundContestantConfigDTO {
    Votes: RegistrationDTO[];
}

export default RoundContestantDTO;