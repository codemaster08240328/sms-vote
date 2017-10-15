import VoteChoiceDTO from './VoteChoiceDTO';

declare interface VoteSourceDTO {
    _id: any;
    Name: string;
    Enabled: boolean;
    Choices: VoteChoiceDTO[];
    PhoneNumber: string;
}

export default VoteSourceDTO;