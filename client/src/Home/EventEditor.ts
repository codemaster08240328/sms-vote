import {EventConfigDTO} from '../../../shared/EventDTO';
import VotingEvent from './VotingEvent';
import { CreateOperationResult } from '../../../shared/OperationResult';
import { Request } from '../Utils/GatewayFunctions';
import { BusyTracker } from '../Utils/BusyTracker';

export class EventEditor {
    public Event: VotingEvent;

    public constructor(dto: EventConfigDTO, private _closeCallback: (dto?: EventConfigDTO) => void) {
        this.Event = new VotingEvent(dto);
    }

    public async Save() {
        const dto = this.Event.ToDTO();
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

export default EventEditor;