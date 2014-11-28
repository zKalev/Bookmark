(function () {

    var serviceRootUrl = ' https://api.parse.com/1/',
        persister = application.data.get(serviceRootUrl),
        controllerObj = application.controller.get(persister),
        USER_OBJECT_ID = 'userObjectId',
        USERNAME = 'username';

    function notify(type, message) {
        return noty({
            text: message,
            type: type,
            layout: 'top',
            dismissQueue: true,
            template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
            animation: {
                open: {height: 'toggle'},
                close: {height: 'toggle'},
                easing: 'swing',
                speed: 500
            },
            timeout: false,
            force: false,
            modal: false,
            maxVisible: 5,
            killer: false,
            closeWith: ['click']

        });
    }

    function View() {
        this.form = $('<form/>');
        this.strongText = $('<strong>Login</strong>');
        this.hr = $('<hr/>');
        this.divInputGoup = $('<div/>').attr('id', 'input-group');
        this.button = $('<button id="log-reg-btn"/>');
        this.usernameLabel = $('<label>Username:</label>').attr('for', 'username').attr('class', 'label');
        this.usernameInput = $('<input/>').attr('id', 'username').attr('class', 'input-login');
        this.passwordLabel = $('<label>Password:</label>').attr('for', 'password').attr('class', 'label');
        this.passwordInput = $('<input/>').attr('id', 'password').attr('class', 'input-login');
        this.link = $('<a href="#"/>');
        this.button.html('Login');
        this.link.html('Register here');

        return this;
    }

    View.prototype.attachOnClickLogReg = function () {
        var username = this.usernameInput,
            password = this.passwordInput;

        this.button.on('click', function (e) {
            e.preventDefault();
            var user = username.val();
            var pass = password.val();

            if (!user) {
                notify('error', 'Username cannot be empty!');
                return;
            }
            if (!pass) {
                notify('error', 'Password cannot be empty!');
                return;
            }

            if ($(this).html() === 'Login') {
                controllerObj.login(user, pass, handleResult);

            } else {

                controllerObj.signUp(user, pass, handleResult);
            }
        });
        return this;
    }

    function handleResult(data, username) {
        console.log(username);
        console.log(data.objectId);
        if (username !== undefined && username !== null) {
            $('#header').html('BookMark-' + username);
            $('form').hide();
            cookiesUtils.setCookie(USER_OBJECT_ID, data.objectId);
            cookiesUtils.setCookie(USERNAME, username);
            localStorage.setItem(USER_OBJECT_ID, data.objectId);
            localStorage.setItem(USERNAME, username);
            controllerObj.loadBookmarksForLoggedInUser(data.objectId, handleLoadedBookMarks);
            notify('success', 'Login successfully!');
        }

        return this;
    }

    function handleLoadedBookMarks(data) {
        showLoadedBookmarksData(data);
        View.prototype.attachAddAndRemoveBookmarkEventHandlers();
    }

    function showLoadedBookmarksData(data) {
        appendLoadedBookmarks('#bookmarks-all-wrapper', data);
        appendAddBookmark('#bookmarks-all-wrapper');
    }

    function appendLoadedBookmarks(selector, data) {

        $('#bookmarks-all-wrapper').html('');
        $.each(data.results, function (index, value) {
            bookmark = value;
            console.log(bookmark);
            var bookmarkWrapper = $('<div />').attr('class', 'bookmark-wrapper').attr('id', bookmark.objectId);
            bookmarkWrapper.append($('<div />').append($('<button class="remove-bookmark">x</button>')));
            bookmarkWrapper.append($('<div />').html(bookmark.title));
            bookmarkWrapper.append($('<div />').html(bookmark.url));

            bookmarkWrapper.attr('data-id', bookmark.id);
            $('#bookmarks-all-wrapper').append(bookmarkWrapper);

        })
        if (data.length === 0) {
            $(selector).append("<h2>No bookmarks</h2>");
        }
    }

    function appendAddBookmark(selector) {
        var $addBookMarkWrapper = $('<div id="add-bookmark-wrapper" />'),
            $inputWrapper = $('<div id="input-wrapper"/>'),
            bookmark;

        $addBookMarkWrapper.append('<h3 id="add-new-bookmark-label">New Bookmark</h3>');
        $addBookMarkWrapper.append('<hr id="add-bookmark-hr"/>');
        $addBookMarkWrapper.append($inputWrapper);
        $inputWrapper.append('<input id="add-bookmark-name" class="new-bookmark-input"/>');
        $inputWrapper.append('<input id="add-bookmark-url" class="new-bookmark-input"/>');

        $addBookMarkWrapper.append('<button id="add-bookmark-btn">Add</button>');

        $(selector).append($addBookMarkWrapper);
    }

    View.prototype.checkSessionKey = function () {

        var cookieUserObjectId = cookiesUtils.getCookie(USER_OBJECT_ID);
        var localStorageUserObjectId = localStorage.getItem(USER_OBJECT_ID);
        var username = cookiesUtils.getCookie(USERNAME);
        console.log(cookieUserObjectId + 'cookie---- storage' + localStorageUserObjectId);
        if (cookieUserObjectId === localStorageUserObjectId) {
            $('form').hide();
            $('#header').html('BookMark-' + username);
            controllerObj.loadBookmarksForLoggedInUser(localStorageUserObjectId, handleLoadedBookMarks);
        }
        return this;
    }


    View.prototype.attachAddAndRemoveBookmarkEventHandlers = function () {
        var _this = this,
            loggedUserId = localStorage.getItem('loggedUserId');

        $('#add-bookmark-btn').on('click', function (ev) {

            var userId = {'__type': "Pointer", 'className': '_User', 'objectId': loggedUserId};
            var bookmark = JSON.stringify({
                title: $('#add-bookmark-name').val(),
                url: $('#add-bookmark-url').val(),
                userId: userId
            });
            controllerObj.addBookmark(bookmark, handleAddBookmark);
            ev.preventDefault();
            return false;
        });
        $('.remove-bookmark').on('click', function (ev) {

            var parentParent = $(this).parent().parent();
            var parentParentId = parentParent.attr('id');
            controllerObj.removeBookmark(parentParentId, handleRemoveBookmark);
        })
    }

    function handleAddBookmark(data, code) {
        var loggedUserId = localStorage.getItem('loggedUserId');

        if (code === 200) {
            console.log(data);
            controllerObj.loadBookmarksForLoggedInUser(loggedUserId, handleLoadedBookMarks);
        } else {
            throw Error(data);
        }
    }

    function handleRemoveBookmark(data, code) {
        var loggedUserId = localStorage.getItem('loggedUserId');
        if (code === 200) {
            console.log(data);
            controllerObj.loadBookmarksForLoggedInUser(loggedUserId, handleLoadedBookMarks);
        } else {
            throw Error(data);
        }

    }

    View.prototype.attachOnClickRegisterLink = function () {
        var $headText = this.strongText,
            $btn = this.button,
            $link = this.link;
        this.link.on('click', function registerLinkClicked(e) {
            e.preventDefault();

            if ($(this).html() === 'Register here') {
                $headText.html('Registration');
                $btn.html('Register');
                $link.html('Login');
                $btn.css('margin-right', '23%');
            } else {
                $headText.html('Login');
                $btn.html('Login');
                $link.html('Register here');
                $btn.css('margin-right', '8%');
            }
        });
        return this;
    }

    View.prototype.appendToParent = function (parent) {
        this.usernameLabel.appendTo(this.divInputGoup);
        this.usernameInput.appendTo(this.divInputGoup);
        this.passwordLabel.appendTo(this.divInputGoup);
        this.passwordInput.appendTo(this.divInputGoup);
        this.strongText.appendTo(this.form);
        this.hr.appendTo(this.form)
        this.divInputGoup.appendTo(this.form);
        this.button.appendTo(this.divInputGoup);
        this.link.appendTo(this.divInputGoup);
        this.form.appendTo(parent);
        return this;
    }

    var $parent = $('#wrapper');
    new View()
        .appendToParent($parent)
        .checkSessionKey()
        .attachOnClickLogReg()
        .attachOnClickRegisterLink();

}());