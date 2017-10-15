import * as tslib_1 from "tslib";
import * as ko from 'knockout';
import { Request } from '../Utils/GatewayFunctions';
import VoteSourceEditorViewModel from './VoteSourceEditorViewModel';
import { BusyTracker } from '../Utils/BusyTracker';
export class HomeScreenViewModel {
    constructor() {
        this.VoteSources = ko.observableArray();
        this.Editor = ko.observable();
        this.LoadingTracker = new BusyTracker();
        this.LoadingTracker.AddOperation(Request('/vote', 'GET')
            .then((dtos) => {
            this.VoteSources(dtos);
        }));
    }
    Edit(vote) {
        this.Editor(new VoteSourceEditorViewModel(vote, (result) => {
            this.VoteSources.replace(vote, result);
            this.Editor(null);
        }));
    }
    Delete(vote) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield Request('vote', 'DELETE', null);
            if (result.Success) {
                this.VoteSources.remove(vote);
            }
        });
    }
}
export default HomeScreenViewModel;
//# sourceMappingURL=HomeScreenViewModel.js.map