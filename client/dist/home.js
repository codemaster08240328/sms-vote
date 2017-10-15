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

class VoteSourceViewModel$2 {
    constructor(dto) {
        this.Name = ko$1.observable();
        this.Numbers = ko$1.observableArray();
        this._id = dto._id;
        this.Name(dto.Name);
        this.Numbers(dto.Numbers);
    }
    ToDTO() {
        const dto = {
            Name: this.Name(),
            Numbers: this.Numbers(),
            _id: this._id
        };
        return dto;
    }
}

class VoteSourceViewModel {
    constructor(dto) {
        this.Name = ko.observable();
        this.Enabled = ko.observable();
        this.Choices = ko.observableArray();
        this.PhoneNumber = ko.observable();
        this._id = dto._id;
        this.Name(dto.Name);
        this.Enabled(dto.Enabled);
        this.Choices(dto.Choices.map(c => new VoteSourceViewModel$2(c)));
        this.PhoneNumber(dto.PhoneNumber);
    }
    ToDTO() {
        const dto = {
            _id: this._id,
            Name: this.Name(),
            Enabled: this.Enabled(),
            Choices: this.Choices().map(c => c.ToDTO()),
            PhoneNumber: this.PhoneNumber()
        };
        return dto;
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

class VoteSourceEditorViewModel {
    constructor(dto, _closeCallback) {
        this._closeCallback = _closeCallback;
        this.SavingTracker = new BusyTracker();
        this.VoteSource = new VoteSourceViewModel(dto);
    }
    Save() {
        return __awaiter(this, void 0, void 0, function* () {
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

class HomeScreenViewModel {
    constructor() {
        this.VoteSources = ko$1.observableArray();
        this.Editor = ko$1.observable();
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
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Request('vote', 'DELETE', null);
            if (result.Success) {
                this.VoteSources.remove(vote);
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
