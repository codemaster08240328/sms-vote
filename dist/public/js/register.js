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

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    // export function MakeRequestGeneric<T>(url: string, method: 'GET' | 'PUT' | 'POST' | 'DELETE', data?: Object): JQueryPromise<T> {
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

    class RegisteredVoterList {
        constructor(eventId) {
            this.RegisteredVoters = ko.observableArray();
            this.Filter = ko.observable();
            this.LoadingTracker = new BusyTracker();
            this.LoadingTracker.AddOperation(Request(`api/event/${eventId}/registrations`, 'GET')
                .then((dtos) => {
                const registeredVoters = dtos
                    .sort((a, b) => a.LastName.compareTo(b.LastName, true));
                this.RegisteredVoters(registeredVoters);
            }));
        }
        AddRegistration(dto) {
            this.RegisteredVoters.push(dto);
        }
        ConfigureComputed() {
            this.FilteredRegistrations = ko.computed(() => {
                return this.RegisteredVoters()
                    .filter(r => {
                    const filter = this.Filter();
                    return r.Email.contains(filter) ||
                        r.FirstName.contains(filter) ||
                        r.LastName.contains(filter) ||
                        r.PhoneNumber.contains(filter);
                });
            });
        }
    }

    class RegistrationEditor {
        constructor(EventId, _submitCallback) {
            this.EventId = EventId;
            this._submitCallback = _submitCallback;
            this.FirstName = ko.observable();
            this.LastName = ko.observable();
            this.Email = ko.observable();
            this.PhoneNumber = ko.observable();
            this.Saving = ko.observable(false);
        }
        ToDTO() {
            return {
                _id: this._id,
                FirstName: this.FirstName(),
                LastName: this.LastName(),
                Email: this.Email(),
                PhoneNumber: this.PhoneNumber()
            };
        }
        Save() {
            return __awaiter(this, void 0, void 0, function* () {
                const dto = this.ToDTO();
                const result = yield Request(`api/event/${this.EventId}/register`, 'PUT', dto);
                if (result.Success) {
                    dto._id = result.Id;
                }
            });
        }
    }

    class RegistrationScreenViewModel {
        constructor() {
            this.EventId = location.pathname.split('/')[1];
            this.RegisteredVoters = new RegisteredVoterList(this.EventId);
            this.RegistrationEditor = new RegistrationEditor(this.EventId, this.OnRegistrationSubmitted);
        }
        OnRegistrationSubmitted(dto) {
            this.RegisteredVoters.AddRegistration(dto);
        }
    }

    /// <reference path='../Common/ArrayExtensions.ts'/>
    const koRoot = document.getElementById('koroot');
    const vm = new RegistrationScreenViewModel();
    ko$1.applyBindings(vm, koRoot);

}(ko));
