var requester = (function () {

    var PARSE_APPLICATION_ID = 'xS6t9212fUmQtXAhrIxVodxFgBHXaG56mjnPQnth',
        PARSE_REST_API_KEY = 'iOkMFhWYsOFhBOmeWiL5cye3KhHscyEnRaf2GB9b';


    var makeRequest = function (method, url, data, success, error) {

        $.ajax({
            headers: {
                "X-Parse-Application-Id": PARSE_APPLICATION_ID,
                'X-Parse-REST-API-Key': PARSE_REST_API_KEY
            },
            method: method,
            url: url,
            contentType: 'application/json',
            data: data,
            success: success,
            error: error
        });
    }


    var makeGetRequest = function (url, success, error) {
        makeRequest('GET', url, null, success, error);
    }

    var makePostRequest = function (url, data, success, error) {
        makeRequest('POST', url, data, success, error);
    }


    var makeDeleteRequest = function (url, success, error) {
        makeRequest('DELETE', url, null, success, error);
    }

    return {
        get: makeGetRequest,
        post: makePostRequest,
        delete: makeDeleteRequest
    }

}())
