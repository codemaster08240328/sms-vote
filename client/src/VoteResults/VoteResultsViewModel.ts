import VoteSourceDTO from '../../../shared/VoteSourceDTO';
import CandidateViewModel from './CandidateViewModel';
import { Request } from '../Utils/GatewayFunctions';
import { BusyTracker } from '../Utils/BusyTracker';

export class VotingResultsViewModel {
    public Name: KnockoutObservable<string> = ko.observable<string>();
    public Candidates: KnockoutObservableArray<CandidateViewModel> = ko.observableArray<CandidateViewModel>();
    public LoadingTracker: BusyTracker = new BusyTracker();

    public constructor() {
        const voteChoiceId: string = new URLSearchParams(location.search.slice(1)).get('id');
        this.LoadingTracker.AddOperation(Request<VoteSourceDTO>(`api/vote/${voteChoiceId}`, 'GET')
            .then((dto) => {
                this.Name(dto.Name);
                const candidates: CandidateViewModel[] = dto.Choices
                    .sort((a, b) => b.Numbers.length - a.Numbers.length)
                    .map((c, idx) => new CandidateViewModel(c, idx + 1));
                this.Candidates(candidates);
            }));
    }
}

export default VotingResultsViewModel;