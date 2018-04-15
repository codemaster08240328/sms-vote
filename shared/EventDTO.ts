import RegistrationDTO from './RegistrationDTO';
import { RoundDTO, RoundConfigDTO } from './RoundDTO';
import { ContestantConfigDTO, ContestantDTO } from './ContestantDTO';

export declare interface EventConfigDTO {
    _id: any;
    Name: string;
    Enabled: boolean;
    Contestants: ContestantConfigDTO[];
    Rounds: RoundConfigDTO[];
    PhoneNumber: string;
    CurrentRound: RoundConfigDTO;
}

export declare interface EventDTO extends EventConfigDTO {
    Registrations: RegistrationDTO[];
    Contestants: ContestantDTO[];
    Rounds: RoundDTO[];
    CurrentRound: RoundDTO;
}

export default EventDTO;