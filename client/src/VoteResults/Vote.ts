/// <reference path='../Common/ArrayExtensions.ts'/>
/// <reference path='../Common/StringExtensions.ts'/>

import * as ko from 'knockout';
import VoteResultsViewModel from './VoteResultsViewModel';

const vm: VoteResultsViewModel = new VoteResultsViewModel();

const koRoot = document.getElementById('koroot');
ko.applyBindings(vm, koRoot);