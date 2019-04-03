"use strict";

var handleSong = function handleSong(e) {
    e.preventDefault();

    $("#songMessage").animate({ width: 'hide' }, 350);

    if ($("#songName").val() == '' || $("#songAge").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#songForm").attr("action"), $("#songForm").serialize(), function () {
        loadSongsFromServer();
    });

    return false;
};

var SongForm = function SongForm(props) {
    return React.createElement(
        "form",
        { id: "songForm", onSubmit: handleSong, name: "songForm", action: "/maker", method: "POST", className: "songForm" },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "songName", type: "text", name: "name", placeholder: "Song Name" }),
        React.createElement(
            "label",
            { htmlFor: "age" },
            "Age: "
        ),
        React.createElement("input", { id: "songAge", type: "text", name: "age", placeholder: "Song Age" }),
        React.createElement(
            "label",
            { htmlFor: "perception" },
            "Perception: "
        ),
        React.createElement("input", { id: "songPerception", type: "text", name: "perception", placeholder: "Song Percpetion" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeSongSubmit", type: "submit", value: "Make Song" })
    );
};

var handleRemoveSong = function handleRemoveSong(e) {
    e.preventDefault();

    $("#songMessage").animate({ width: 'hide' }, 350);

    if ($("#songRemoveName").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('GET', '/removeSong', $("#removeForm").serialize(), function (data) {
        loadSongsFromServer();
    });
    loadSongsFromServer();
    return false;
};

var RemoveSongForm = function RemoveSongForm(props) {
    return React.createElement(
        "form",
        { id: "removeForm", onSubmit: handleRemoveSong, name: "songForm", action: "/maker", method: "POST", className: "songForm" },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "songRemoveName", type: "text", name: "name", placeholder: "Song Name" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeSongSubmit", type: "submit", value: "Remove Song" })
    );
};

var SongList = function SongList(props) {
    if (props.songs.length === 0) {
        return React.createElement(
            "div",
            { className: "songList" },
            React.createElement(
                "h3",
                { className: "emptySong" },
                "No Songs yet"
            )
        );
    }

    var songNodes = props.songs.map(function (song) {
        return React.createElement(
            "div",
            { key: song._id, className: "song" },
            React.createElement("img", { src: "/assets/img/songface.jpeg", alt: "song face", className: "songFace" }),
            React.createElement(
                "h3",
                { className: "songName" },
                "Name: ",
                song.name
            ),
            React.createElement(
                "h3",
                { className: "songArtist" },
                "Artist: ",
                song.artist
            ),
            React.createElement(
                "h3",
                { className: "songAlbum" },
                "Album: ",
                song.album
            )
        );
    });

    return React.createElement(
        "div",
        { className: "songList" },
        songNodes
    );
};

var loadSongsFromServer = function loadSongsFromServer() {
    sendAjax('GET', '/getSongs', null, function (data) {
        ReactDOM.render(React.createElement(SongList, { songs: data.songs }), document.querySelector("#songs"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(SongForm, { csrf: csrf }), document.querySelector("#makeSong"));
    ReactDOM.render(React.createElement(RemoveSongForm, { csrf: csrf }), document.querySelector("#removeSong"));

    ReactDOM.render(React.createElement(SongList, { songs: [] }), document.querySelector("#songs"));

    loadSongsFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
