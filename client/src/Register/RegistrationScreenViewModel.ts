import * as ko from 'knockout';
import RegistrationDTO from '../../../shared/RegistrationDTO';
import RegisteredVoterList from './RegisteredVoterList';
import RegistrationEditor from './RegistrationEditor';

export class RegistrationScreenViewModel {
    public EventId: string = location.pathname.split('/')[1];

    public RegisteredVoters: RegisteredVoterList = new RegisteredVoterList(this.EventId);
    public RegistrationEditor: RegistrationEditor = new RegistrationEditor(this.EventId, this.OnRegistrationSubmitted);

    public OnRegistrationSubmitted(dto: RegistrationDTO) {
        this.RegisteredVoters.AddRegistration(dto);
    }
}

export default RegistrationScreenViewModel;