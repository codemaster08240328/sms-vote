import * as ko from 'knockout';
import { MakeRequestGeneric } from '../Utils/GatewayFunctions';
import VoteSourceDTO from '../../../shared/VoteSourceDTO';

export class HomeScreenViewModel {
    public VoteSources: KnockoutObservableArray<VoteSourceDTO> = ko.observableArray<VoteSourceDTO>();

    public constructor() {
        MakeRequestGeneric<VoteSourceDTO[]>('/vote', 'GET')
            .done((dtos) => this.VoteSources(dtos));
    }
}

export default HomeScreenViewModel;