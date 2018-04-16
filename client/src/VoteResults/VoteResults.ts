/// <reference path='../Common/ArrayExtensions.ts'/>
/// <reference path='../Common/StringExtensions.ts'/>

import * as ko from 'knockout';
import EventResultsViewModel from './EventResultsViewModel';

const vm: EventResultsViewModel = new EventResultsViewModel();

const koRoot = document.getElementById('koroot');
ko.applyBindings(vm, koRoot);