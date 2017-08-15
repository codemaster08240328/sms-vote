import VoteChoiceDTO from './VoteChoiceDTO';

export interface VoteSourceDTO {
    Name: string;
    Enabled: boolean;
    Choices: VoteChoiceDTO[];
    PhoneNumber: string;
    hasVoted(phoneNumber: string): boolean;
}

export default VoteSourceDTO;