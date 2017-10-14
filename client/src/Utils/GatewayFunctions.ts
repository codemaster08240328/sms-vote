
// export function MakeRequestGeneric<T>(url: string, method: 'GET' | 'PUT' | 'POST' | 'DELETE', data?: Object): JQueryPromise<T> {
//     const options: JQueryAjaxSettings = <JQueryAjaxSettings>{};
//     options.data = data && ko.toJSON(data);

//     options.dataType = 'json';
//     options.contentType = 'application/json';

//     options.type = method;

//     XMLHttpRequest; xhr = new XMLHttpRequest();
//     return request;
// }

export async function Request<T>(url: string, method: 'GET' | 'PUT' | 'POST' | 'DELETE', data?: Object): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = (event) => {
            if (xhr.readyState !== 4) return;
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.response)); // OK
            } else {
                reject(xhr.statusText); // Error
            }
        };

        xhr.open(method, url, true); // Async
        xhr.setRequestHeader('Content-Type', 'application/json');
        data ? xhr.send(JSON.stringify(data)) : xhr.send();
    });
}