var application = application || {};

application.controller = (function () {

    function Main(persister) {
        this.persister = persister;
    }

    Main.prototype.login = function (username, password, handleLoginResult) {

        this.persister.login(username, password,
            function successLogin(data) {
                handleLoginResult(data, username);
                console.log(data.objectId);
                localStorage.setItem('loggedUserId', data.objectId);
            },
            function errorLogin(error) {
                handleLoginResult(data);
                console.log(error)
            });
    }

    Main.prototype.signUp = function (username, password, handleLoginResult) {

        this.persister.signUp(username, password,
            function successLogin(data) {

                handleLoginResult(data, username);
                console.log(data);
                localStorage.setItem('loggedUserId', data.objectId);
            },
            function errorLogin(error) {
                handleLoginResult(data);
                console.log(error)
            });
    }

    Main.prototype.loadBookmarksForLoggedInUser = function (loggedUserId, handleLoadedBookMarks) {
        this.persister.bookmarks.getAll(loggedUserId,
            function (data) {
                handleLoadedBookMarks(data);
                console.log(data);

            },
            function (error) {
                console.log(error);
            });
    }

    Main.prototype.addBookmark = function (data, handleAddBookmark) {

        this.persister.bookmarks.add(data,
            function addSuccessBookmark(data) {
                handleAddBookmark(data, 200);

            },
            function addErrorBookmark(error) {
                handleAddBookmark(error, 400);
            })
    }

    Main.prototype.removeBookmark = function (id, handleRemoveBookmark) {
        this.persister.bookmarks.remove(id,
            function removeSuccessBookmark(data) {
                handleRemoveBookmark(data, 200);
            },
            function removeErrorBookmark(error) {
                handleRemoveBookmark(error, 400);
            }
        );
    }

    return {
        get: function (dataPersister) {
            return new Main(dataPersister);
        }
    }

}());