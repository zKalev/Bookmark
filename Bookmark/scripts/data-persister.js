var application = application || {};

application.data = (function () {

    var uris = {
        USERS: 'users',
        LOG_IN: 'login',
        BOOKMARKS: 'classes/Bookmark'
    }

    function Data(baseUrl) {
        this.baseUrl = baseUrl;
        this.users = new Base(baseUrl + uris.USERS);
        this.bookmarks = new Base(baseUrl + uris.BOOKMARKS);
    }

    Data.prototype.signUp = function (username, password, success, error) {
        var userData = JSON.stringify({'username': username, 'password': password});
        requester.post(this.baseUrl + uris.USERS, userData, success, error);
    }

    Data.prototype.login = function (username, password, success, error) {
        var url = this.baseUrl + uris.LOG_IN + '?username=' + username + '&password=' + password;
        requester.get(url, success, error);
    }

    var Base = (function () {

        function Base(url) {
            this.serviceUrl = url;
        }

        Base.prototype.getAll = function (objectId,
                                          success, error) {
            var url = this.serviceUrl + '?where={"userId":{"__type":"Pointer","className":"_User","objectId":"' + objectId + '"}}'; // + objectId + '" }}'
            requester.get(url, success, error);
        }

        Base.prototype.add = function (data, success, error) {
            requester.post(this.serviceUrl, data, success, error);
        }

        Base.prototype.remove = function (id, success, error) {
            requester.delete(this.serviceUrl + '/' + id, success, error);
        }


        return Base
    }());

    return {
        get: function (baseUrl) {
            return new Data(baseUrl);
        }
    }

}());