(function (ko$1) {
'use strict';

function MakeRequestGeneric(url, method, data) {
    const options = {};
    options.data = data && ko.toJSON(data);
    options.dataType = 'json';
    options.contentType = 'application/json';
    options.type = method;
    const request = jQuery.ajax(url, options);
    return request;
}

class HomeScreenViewModel {
    constructor() {
        this.VoteSources = ko$1.observableArray();
        MakeRequestGeneric('/vote', 'GET')
            .done((dtos) => this.VoteSources(dtos));
    }
}

const vm = new HomeScreenViewModel();
const koRoot = document.getElementById('koroot');
ko$1.applyBindings(vm, koRoot);

}(ko));
//# sourceMappingURL=home.js.map
