import * as ko from 'knockout';
import HomeScreenViewModel from './HomeScreenViewModel';

const vm: HomeScreenViewModel = new HomeScreenViewModel();

const koRoot = document.getElementById('koroot');
ko.applyBindings(vm, koRoot);