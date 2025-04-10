import { useState, useEffect } from "react";
import Paths from "./router";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initiate() {
      try {
        // dispatch(userLogged());
        setLoading(false);
      } catch (err) {
        // dispatch(removeUser());
        console.error(err);
      }
    }
    initiate();
  }, []);

  return (
    <div>
      <Paths />
    </div>
  );
}

export default App;
