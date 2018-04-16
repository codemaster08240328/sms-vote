(function (ko$1) {
'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */













function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

// export function MakeRequestGeneric<T>(url: string, method: 'GET' | 'PUT' | 'POST' | 'DELETE', data?: Object): JQueryPromise<T> {
//     const options: JQueryAjaxSettings = <JQueryAjaxSettings>{};
//     options.data = data && ko.toJSON(data);
//     options.dataType = 'json';
//     options.contentType = 'application/json';
//     options.type = method;
//     XMLHttpRequest; xhr = new XMLHttpRequest();
//     return request;
// }
function Request(url, method, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = (event) => {
                if (xhr.readyState !== 4)
                    return;
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(JSON.parse(xhr.response)); // OK
                }
                else {
                    reject(xhr.statusText); // Error
                }
            };
            xhr.open(method, url, true); // Async
            xhr.setRequestHeader('Content-Type', 'application/json');
            data ? xhr.send(JSON.stringify(data)) : xhr.send();
        });
    });
}

class Contestant {
    constructor(dto) {
        this.Name = ko$1.observable();
        this._id = dto._id;
        this.Name(dto.Name);
    }
    ToDTO() {
        const dto = {
            _id: this._id,
            Name: this.Name(),
            VoteKey: this.VoteKey
        };
        return dto;
    }
    OrderUpdated(idx) {
        this.VoteKey = idx + 1;
    }
}

class Round {
    constructor(dto, _eventContestants) {
        this._eventContestants = _eventContestants;
        this.Contestants = ko.observableArray();
        this._id = dto._id;
        this.RoundNumber = dto.RoundNumber;
        this.Contestants(dto.Contestants.map(c => _eventContestants().find(ec => ec.VoteKey == c.VoteKey)));
    }
    ToDTO() {
        return {
            _id: this._id,
            RoundNumber: this.RoundNumber,
            Contestants: this.Contestants().map(c => c.ToDTO())
        };
    }
}

class VotingEvent {
    constructor(dto) {
        this.Name = ko.observable();
        this.Enabled = ko.observable();
        this.Contestants = ko.observableArray();
        this.Rounds = ko.observableArray();
        this.PhoneNumber = ko.observable();
        this.CurrentRound = ko.observable();
        this._id = dto._id;
        this.Name(dto.Name);
        this.Enabled(dto.Enabled);
        this.Contestants(dto.Contestants.map(c => new Contestant(c)));
        this.PhoneNumber(dto.PhoneNumber);
    }
    ToDTO() {
        const dto = {
            _id: this._id,
            Name: this.Name(),
            Enabled: this.Enabled(),
            Contestants: this.Contestants().map((c) => c.ToDTO()),
            PhoneNumber: this.PhoneNumber(),
            Rounds: this.Rounds().map((r) => r.ToDTO()),
            CurrentRound: this.CurrentRound().ToDTO()
        };
        return dto;
    }
    AddContestant() {
        this.Contestants.push(new Contestant({
            _id: undefined,
            Name: '',
            VoteKey: this.Contestants().length,
        }));
    }
    DeleteContestant(contestant) {
        this.Contestants.remove(contestant);
        this.Rounds().forEach(r => r.Contestants.remove(contestant));
    }
    AddRound() {
        this.Rounds.push(new Round({
            _id: null,
            RoundNumber: this.Rounds().length + 1,
            Contestants: []
        }, this.Contestants));
    }
    DeleteRound(round) {
        this.Rounds.remove(round);
    }
    SetCurrentRound(round) {
        this.CurrentRound(round);
    }
}

class EventEditor {
    constructor(dto, _closeCallback) {
        this._closeCallback = _closeCallback;
        this.Event = new VotingEvent(dto);
    }
    Save() {
        return __awaiter(this, void 0, void 0, function* () {
            const dto = this.Event.ToDTO();
            const result = yield Request('api/vote', 'POST', dto);
            if (result.Success) {
                dto._id = result.Id;
                this._closeCallback(dto);
            }
        });
    }
    Cancel() {
        this._closeCallback();
    }
}

class BusyTracker {
    constructor() {
        this._tasks = ko.observableArray();
        this._operations = ko.observableArray();
        this.ConfigureDependentObservables();
    }
    ConfigureDependentObservables() {
        this.Busy = ko.computed({
            owner: this,
            read: () => {
                return this._tasks().length + this._operations().length > 0;
            }
        });
    }
    AddTask(task) {
        /// <param name="task" type="String">
        /// Identifies the task being performed that is keeping the tracker busy
        /// </param>
        if (!this._tasks().contains(task)) {
            this._tasks.push(task);
        }
    }
    AddOperations(operations) {
        /// <param name="operations" type="Array">
        /// </param>
        operations.forEach((operation) => {
            this.AddOperation(operation);
        });
    }
    AddOperation(operation) {
        return __awaiter(this, void 0, void 0, function* () {
            /// <param name="operation" type="JQueryPromise">
            /// </param>
            /// <returns type="JQueryPromise"></returns>
            const existingOperation = ko.utils.arrayFirst(this._operations(), (listOperation) => {
                return listOperation === operation;
            }, this);
            if (existingOperation == null) {
                this._operations.push(operation);
                operation.then(() => {
                    this._operations.remove(operation);
                });
            }
            return operation;
        });
    }
    TaskComplete(task) {
        /// <param name="task" type="String">
        /// </param>
        if (this._tasks().contains(task)) {
            this._tasks.remove(task);
        }
    }
    ClearTasks() {
        this._tasks.removeAll();
    }
    HasTask(taskName) {
        /// <param name="taskName" type="String">
        /// </param>
        /// <returns type="Boolean"></returns>
        return this._tasks().contains(taskName);
    }
}

class HomeScreenViewModel {
    constructor() {
        this.Events = ko$1.observableArray();
        this.Editor = ko$1.observable();
        this.LoadingTracker = new BusyTracker();
        this.LoadingTracker.AddOperation(Request('api/events', 'GET')
            .then((dtos) => {
            this.Events(dtos);
        }));
    }
    AddNew() {
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
        }, (result) => {
            if (result) {
                this.Events.push(result);
            }
            this.Editor(null);
        }));
    }
    Edit(event) {
        this.Editor(new EventEditor(event, (result) => {
            if (result) {
                this.Events.replace(event, result);
            }
            this.Editor(null);
        }));
    }
    Delete(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Request(`api/event/${event._id}`, 'DELETE', null);
            if (result.Success) {
                this.Events.remove(event);
            }
        });
    }
}

/// <reference path='../Common/ArrayExtensions.ts'/>
/// <reference path='../Common/StringExtensions.ts'/>
const vm = new HomeScreenViewModel();
const koRoot = document.getElementById('koroot');
ko$1.applyBindings(vm, koRoot);

}(ko));
//# sourceMappingURL=home.js.map
