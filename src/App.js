import { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [res, setRes] = useState([]);
  const [mainArtist, setMainArtist] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const artistRef = useRef();
  const imgRef = useRef();
  const trackRef = useRef()
  const followerRef = useRef();
  const playlistRef = useRef();
  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);
  // const fetchRequest = async () => {
  //   const data = await fetch(
  //     `https://api.spotify.com/v1/artists/${process.env.REACT_APP_ARTIST_ID}`
  //   );
  //   const dataJ = await data.json();
  //   const result = dataJ.results;
  //   console.log(result);
  //   setRes(result);
  // };
  useEffect(() => {
    // fetchRequest();
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.localStorage.hash = "";
      window.localStorage.setItem("token", token);
    }
    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };
  const searchArtists = async (e) => {
    e.preventDefault();
    const { data } = await axios.get(
      "https://api.spotify.com/v1/search?limit=2",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: searchKey,
          type: "artist",
        },
      }
    );
    console.log(data);
    setArtists(data.artists.items);
  };
  const getArtist = async (e) => {
    e.preventDefault();
    const mainartistData = await axios.get(
      `https://api.spotify.com/v1/artists/${process.env.REACT_APP_ARTIST_ID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(mainartistData.data);
    artistRef.current.innerHTML = "Artist Name: " + mainartistData.data.name;
    imgRef.current.src = mainartistData.data.images[0].url;
    followerRef.current.innerHTML =
      "Followers: " +
      mainartistData.data.followers.total.toLocaleString("en-US");
    setMainArtist(mainArtist);
  };
  const getPlaylist = async () => {
    const playListData = await axios.get(
      `https://api.spotify.com/v1/playlists/${process.env.REACT_APP_PLAYLIST_ID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    playlistRef.current.innerHTML= `Playlist Name: ` + playListData.data.name
    console.log(playListData.data);
  };
  getPlaylist();
  return (
    <div className="App">
      <div>
        <h1>Spotify React</h1>
        {!token ? (
          <a
            href={`${process.env.REACT_APP_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=${process.env.REACT_APP_RESPONSE_TYPE}`}
          >
            Login
          </a>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
        <form onSubmit={searchArtists}>
          <input type="text" onChange={(e) => setSearchKey(e.target.value)} />
          <button type={"submit"}>Search</button>
        </form>
        {artists.map((artist) => (
          <div key={artist.id}>
            <p>Artist Name: {artist.name}</p>
            {artist.images.length ? (
              <img width="50px" src={artist.images[0].url} alt="" />
            ) : (
              <div>No Image</div>
            )}
          </div>
        ))}
        <button onClick={getArtist}>Get EmmaOMG on Spotify</button>
        <h5 ref={artistRef}> </h5>
        <h5 ref={followerRef}></h5>
        <img ref={imgRef} alt="Artist Icon" />
        <h5 ref={playlistRef}>Playlist Name: </h5>
        <h5 ref={trackRef}>Tracks</h5>
      </div>
    </div>
  );
}

export default App;
