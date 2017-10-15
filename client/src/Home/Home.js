/// <reference path='../Common/ArrayExtensions.ts'/>
/// <reference path='../Common/StringExtensions.ts'/>
import * as ko from 'knockout';
import HomeScreenViewModel from './HomeScreenViewModel';
const vm = new HomeScreenViewModel();
const koRoot = document.getElementById('koroot');
ko.applyBindings(vm, koRoot);
//# sourceMappingURL=Home.js.map