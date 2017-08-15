export function MakeRequestGeneric<T>(url: string, method: 'GET' | 'PUT' | 'POST' | 'DELETE', data?: Object): JQueryPromise<T> {
    const options: JQueryAjaxSettings = <JQueryAjaxSettings>{};
    options.data = data && ko.toJSON(data);

    options.dataType = 'json';
    options.contentType = 'application/json';

    options.type = method;

    const request: JQueryPromise<T> = jQuery.ajax(url, options);
    return request;
}