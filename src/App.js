import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [res, setRes] = useState([]);
  const fetchRequest = async () => {
    const data = await fetch(
      `https://api.spotify.com/v1/artists/${process.env.REACT_APP_ARTIST_ID}`
    );
    const dataJ = await data.json();
    const result = dataJ.results;
    console.log(result);
    setRes(result);
  };
  useEffect(() => {
    fetchRequest();
  }, []);
  return (
    <div className="App">
      <div>
        <p>Artist Name:</p>
        <p>Artist Followers:</p>
      </div>
    </div>
  );
}

export default App;
