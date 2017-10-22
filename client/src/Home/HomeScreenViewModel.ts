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

    public AddNew() {
        this.Editor(new VoteSourceEditorViewModel({
            _id: null,
            Name: '',
            Enabled: false,
            Choices: [{
                _id: undefined,
                Name: '',
                VoteKey: 1,
                Numbers: []
            }],
            PhoneNumber: ''
        },
        (result) => {
            if (result) {
                this.VoteSources.push(result);
            }
            this.Editor(null);
        }));
    }

    public Edit(vote: VoteSourceDTO) {
        this.Editor(new VoteSourceEditorViewModel(vote, (result) => {
            if (result) {
                this.VoteSources.replace(vote, result);
            }
            this.Editor(null);
        }));
    }

    public async Delete(vote: VoteSourceDTO) {
        const result = await Request<OperationResult>(`/vote/${vote._id}`, 'DELETE', null);
        if (result.Success) {
            this.VoteSources.remove(vote);
        }
    }
}

export default HomeScreenViewModel;