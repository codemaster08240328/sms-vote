import * as ko from 'knockout';
import { Request } from '../Utils/GatewayFunctions';
import { OperationResult } from '../../../shared/OperationResult';
import VoteSourceDTO from '../../../shared/VoteSourceDTO';
import VoteSourceEditorViewModel from './VoteSourceEditorViewModel';
import { BusyTracker } from '../Utils/BusyTracker';

export class HomeScreenViewModel {
    public VoteSources: KnockoutObservableArray<VoteSourceDTO> = ko.observableArray<VoteSourceDTO>();
    public Editor: KnockoutObservable<VoteSourceEditorViewModel> = ko.observable<VoteSourceEditorViewModel>();

    public LoadingTracker: BusyTracker = new BusyTracker();

    public constructor() {
        this.LoadingTracker.AddOperation(Request<VoteSourceDTO[]>('/vote', 'GET')
            .then((dtos) => {
                this.VoteSources(dtos);
            }));
    }

    public Edit(vote: VoteSourceDTO) {
        this.Editor(new VoteSourceEditorViewModel(vote, (result) => {
            this.VoteSources.replace(vote, result);
            this.Editor(null);
        }));
    }

    public async Delete(vote: VoteSourceDTO) {
        const result = await Request<OperationResult>('vote', 'DELETE', null);
        if (result.Success) {
            this.VoteSources.remove(vote);
        }
    }
}

export default HomeScreenViewModel;