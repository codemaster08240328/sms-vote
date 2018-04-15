import * as ko from 'knockout';
import { Request } from '../Utils/GatewayFunctions';
import { OperationResult } from '../../../shared/OperationResult';
import {EventConfigDTO} from '../../../shared/EventDTO';
import EventEditor from './EventEditor';
import { BusyTracker } from '../Utils/BusyTracker';

export class HomeScreenViewModel {
    public Events: KnockoutObservableArray<EventConfigDTO> = ko.observableArray<EventConfigDTO>();
    public Editor: KnockoutObservable<EventEditor> = ko.observable<EventEditor>();

    public LoadingTracker: BusyTracker = new BusyTracker();

    public constructor() {
        this.LoadingTracker.AddOperation(Request<EventConfigDTO[]>('api/events', 'GET')
            .then((dtos) => {
                this.Events(dtos);
            }));
    }

    public AddNew() {
        this.Editor(new EventEditor({
            _id: null,
            Name: '',
            Enabled: false,
            Contestants: [{
                _id: undefined,
                Name: '',
                VoteKey: 1,
            }],
            PhoneNumber: '',
            Rounds: [],
            CurrentRound: null,
        },
        (result) => {
            if (result) {
                this.Events.push(result);
            }
            this.Editor(null);
        }));
    }

    public Edit(event: EventConfigDTO) {
        this.Editor(new EventEditor(event, (result) => {
            if (result) {
                this.Events.replace(event, result);
            }
            this.Editor(null);
        }));
    }

    public async Delete(event: EventConfigDTO) {
        const result = await Request<OperationResult>(`api/event/${event._id}`, 'DELETE', null);
        if (result.Success) {
            this.Events.remove(event);
        }
    }
}

export default HomeScreenViewModel;