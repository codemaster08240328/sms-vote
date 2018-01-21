import VoteSourceDTO from '../../../shared/VoteSourceDTO';
import { CreateOperationResult } from '../../../shared/OperationResult';
import VoteSourceViewModel from './VoteSourceViewModel';
import { Request } from '../Utils/GatewayFunctions';
import { BusyTracker } from '../Utils/BusyTracker';

export class VoteSourceEditorViewModel {
    public VoteSource: VoteSourceViewModel;
    public SavingTracker: BusyTracker = new BusyTracker();

    public constructor(dto: VoteSourceDTO, private _closeCallback: (dto?: VoteSourceDTO) => void) {
        this.VoteSource = new VoteSourceViewModel(dto);
    }

    public async Save() {
        const dto = this.VoteSource.ToDTO();
        const result = await Request<CreateOperationResult>('api/vote', 'POST', dto);
        if (result.Success) {
            dto._id = result.Id;
            this._closeCallback(dto);
        }
    }

    public Cancel() {
        this._closeCallback();
    }
}

export default VoteSourceEditorViewModel;