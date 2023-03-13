import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios"

function App() {
  const [res, setRes] = useState([]);
  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])
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
    const token = window.localStorage.getItem("token");

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
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params : {
        q : searchKey,
        type: "artist"
      }
    })
    setArtists(data.artists.items)
  }
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
          <input type="text" onChange={e => setSearchKey(e.target.value)}/>
          <button type={"submit"}>Search</button>
        </form>
        <p>Artist Name:</p>
        <p>Artist Followers:</p>
      </div>
    </div>
  );
}

export default App;
