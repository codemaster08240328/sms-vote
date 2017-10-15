import * as tslib_1 from "tslib";
import VoteSourceViewModel from './VoteSourceViewModel';
import { Request } from '../Utils/GatewayFunctions';
import { BusyTracker } from '../Utils/BusyTracker';
export class VoteSourceEditorViewModel {
    constructor(dto, _closeCallback) {
        this._closeCallback = _closeCallback;
        this.SavingTracker = new BusyTracker();
        this.VoteSource = new VoteSourceViewModel(dto);
    }
    Save() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const dto = this.VoteSource.ToDTO();
            const result = yield Request('vote', 'PUT', dto);
            if (result.Success) {
                dto._id = result.Id;
                this._closeCallback(dto);
            }
        });
    }
    Cancel() {
        this._closeCallback(this.VoteSource.ToDTO());
    }
}
export default VoteSourceEditorViewModel;
//# sourceMappingURL=VoteSourceEditorViewModel.js.map