import * as tslib_1 from "tslib";
export class BusyTracker {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
//# sourceMappingURL=BusyTracker.js.map