import RegistrationDTO from '../../../shared/RegistrationDTO';
import { RoundDTO, RoundConfigDTO } from '../../../shared/RoundDTO';
import { ContestantDTO, EventContestantDTO } from '../../../shared/ContestantDTO';
import { EventDTO } from '../../../shared/EventDTO';
import { Request } from '../Utils/GatewayFunctions';
import { DataOperationResult } from '../../../shared/OperationResult';
import { BusyTracker } from '../Utils/BusyTracker';

export class EventSummary {
    public _id: any;
    public Name: string;
    public Enabled: boolean;
    public PhoneNumber: string;
    public Contestants: EventContestantDTO[];
    public Rounds: KnockoutObservable<RoundDTO[]> = ko.observable<RoundDTO[]>();
    public CurrentRound: KnockoutObservable<RoundDTO> = ko.observable<RoundDTO>();
    public IncrementRoundText: KnockoutComputed<string>;
    public IncrementRoundCSS: KnockoutComputed<string>;
    public NextRoundNumber: KnockoutComputed<number>;

    public CurrentRoundUpdater: BusyTracker = new BusyTracker();

    public constructor(dto: EventDTO) {
        this.LoadEvent(dto);

        this.NextRoundNumber = ko.computed(() => {
            const rounds = this.Rounds()
                .filter(r => !r.IsFinished);
            if (rounds.length > 0) {
                return rounds.map(r => r.RoundNumber)
                    .reduce((prev, cur) => {
                        return prev < cur ? prev : cur;
                    });
            } else {
                return 0;
            }
        });

        this.IncrementRoundText = ko.computed(() => {
            if (this.CurrentRound()) {
                return `End Round ${this.CurrentRound().RoundNumber}`;
            }
            else if (this.Rounds().some(r => !r.IsFinished)) {
                const rounds = this.Rounds()
                    .filter(r => !r.IsFinished);

                if (rounds.length > 0) {
                    const nextRound = rounds.map(r => r.RoundNumber)
                        .reduce((prev, cur) => {
                            return prev < cur ? prev : cur;
                        });
                    if (nextRound != 0) {
                        return `Begin Round ${nextRound}`;
                    }
                }
            }
            else {
                return `Finished!`;
            }
        });

        this.IncrementRoundCSS = ko.computed(() => {
            if (this.CurrentRound()) {
                return `btn-danger`;
            }
            else if (this.Rounds().some(r => !r.IsFinished)) {
                const rounds = this.Rounds()
                    .filter(r => !r.IsFinished);

                if (rounds.length > 0) {
                    const nextRound = rounds.map(r => r.RoundNumber)
                        .reduce((prev, cur) => {
                            return prev < cur ? prev : cur;
                        });
                    if (nextRound != 0) {
                        return `btn-success`;
                    }
                }
            }
            else {
                return `btn-default`;
            }
        });
    }

    public LoadEvent(dto: EventDTO) {
        this._id = dto._id;
        this.Name = dto.Name;
        this.Enabled = dto.Enabled;
        this.PhoneNumber = dto.PhoneNumber;
        this.Contestants = dto.Contestants;
        this.Rounds(dto.Rounds);

        this.CurrentRound(dto.CurrentRound);
    }

    public async IncrementRound(): Promise<void> {
        const result = await this.CurrentRoundUpdater.AddOperation(Request<DataOperationResult<EventDTO>>(`api/event/${this._id}/incrementround`, 'POST'));
        if (result.Success) {
            this.LoadEvent(result.Data);
        }
    }
}

export default EventSummary;