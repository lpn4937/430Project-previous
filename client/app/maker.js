const handleSong = (e) => {
    e.preventDefault();

    $("#songMessage").animate({width:'hide'},350);
    
    if($("#songName").val() == '' || $("#songArtist").val() == '' || $("#songAlbum").val() == ''){
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#songForm").attr("action"), $("#songForm").serialize(), function() {
        loadSongsFromServer();
    });

    return false;
}

const SongForm = (props) => {
    return (
        <form id="songForm" onSubmit={handleSong} name="songForm" action="/maker" method="POST" className = "songForm">
            <label htmlFor="name">Name: </label>
            <input id="songName" type="text" name="name" placeholder="Song Name" />
            <label htmlFor="artist">Artist: </label>
            <input id="songArtist" type="text" name="artist" placeholder="Song Artist" />
            <label htmlFor="album">Album: </label>
            <input id="songAlbum" type="text" name="album" placeholder="Song Album" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeSongSubmit" type="submit" value="Make Song" />
        </form>
    );
};

const handleRemoveSong = (e) => {
    e.preventDefault();
    
    $("#songMessage").animate({width:'hide'},350);
    
    if($("#songRemoveName").val() == ''){
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('GET','/removeSong',$("#removeForm").serialize(),(data)=>{
        loadSongsFromServer();
    });
    loadSongsFromServer();
    return false;
}

const RemoveSongForm = (props) => {
    return (
        <form id="removeForm" onSubmit={handleRemoveSong} name="songForm" action="/maker" method="POST" className = "songForm">
            <label htmlFor="name">Name: </label>
            <input id="songRemoveName" type="text" name="name" placeholder="Song Name" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeSongSubmit" type="submit" value="Remove Song" />
        </form>
    );
};

const SongList = function(props) {
    if(props.songs.length === 0) {
        return (
            <div className="songList">
                <h3 className="emptySong">No Songs yet</h3>
            </div>
        );
    }

    const songNodes = props.songs.map(function(song){
        return (
            <div key={song._id} className="song">
                <img src="/assets/img/domoface.jpeg" alt="song face" className="songFace" />
                <h3 className="songName">Name: {song.name}</h3>
                <h3 className="songArtist">Artist: {song.artist}</h3>
                <h3 className="songAlbum">Album: {song.album}</h3>
            </div>
        );
    });

    return (
        <div className="songList">
            {songNodes}
        </div>
    );
};

const loadSongsFromServer = () => {
    sendAjax('GET','/getSongs',null,(data)=>{
        ReactDOM.render(
            <SongList songs={data.songs} />, document.querySelector("#songs")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <SongForm csrf={csrf} />, document.querySelector("#makeSong")
    );
    ReactDOM.render(
        <RemoveSongForm csrf={csrf} />, document.querySelector("#removeSong")
    );

    ReactDOM.render(
        <SongList songs={[]} />, document.querySelector("#songs")
    );

    loadSongsFromServer();
};

const getToken = () => {
    sendAjax('GET','/getToken',null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});