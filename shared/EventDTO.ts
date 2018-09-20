import RegistrationDTO from './RegistrationDTO';
import { RoundDTO, RoundConfigDTO } from './RoundDTO';
import { ContestantDTO, EventContestantDTO } from './ContestantDTO';

export declare interface EventConfigDTO {
    _id: any;
    Name: string;
    Enabled: boolean;
    Contestants: EventContestantDTO[];
    Rounds: RoundConfigDTO[];
    PhoneNumber: string;
    CurrentRound: RoundConfigDTO;
    RegistrationConfirmationMessage: string;
}

export declare interface EventDTO extends EventConfigDTO {
    Registrations: RegistrationDTO[];
    Contestants: EventContestantDTO[];
    Rounds: RoundDTO[];
    CurrentRound: RoundDTO;
}

export default EventDTO;