import * as ko from 'knockout';
import RegistrationDTO from '../../../shared/RegistrationDTO';
import RegisteredVoterList from './RegisteredVoterList';
import RegistrationEditor from './RegistrationEditor';

export class RegistrationScreenViewModel {
    public EventId: string = location.pathname.split('/')[2];

    public RegisteredVoters: RegisteredVoterList;
    public RegistrationEditor: KnockoutObservable<RegistrationEditor> = ko.observable<RegistrationEditor>();
    public SubmittedNumbers: KnockoutObservableArray<string> = ko.observableArray<string>();

    public constructor() {
        this.RegisteredVoters = new RegisteredVoterList(this.EventId, this.OnVoterSelected.bind(this));
        this.ResetEditor();
    }

    public OnRegistrationSubmitted(dto: RegistrationDTO) {
        this.RegisteredVoters.UpdateRegistration(dto);
        this.SubmittedNumbers.push(dto.PhoneNumber);
        setTimeout(() => {
            this.SubmittedNumbers.remove(dto.PhoneNumber);
        }, 7000);
        this.ResetEditor();
    }

    public OnVoterSelected(dto: RegistrationDTO) {
        this.ResetEditor();
        this.RegistrationEditor().Load(dto);
    }

    private ResetEditor() {
        this.RegistrationEditor(new RegistrationEditor(this.EventId, this.OnRegistrationSubmitted.bind(this), this.ResetEditor.bind(this)));
    }
}

export default RegistrationScreenViewModel;