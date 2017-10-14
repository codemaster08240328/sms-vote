import VoteChoiceDTO from './VoteChoiceDTO';

export interface VoteSourceDTO {
    _id: any;
    Name: string;
    Enabled: boolean;
    Choices: VoteChoiceDTO[];
    PhoneNumber: string;
}

export default VoteSourceDTO;