import React, { useEffect, useState } from "react";
import "./App.css";
import MainComponent from "./components/MainComponent";
import DialogDemo from "./components/DialogComponent/Dialog";
import "../src/index.css";

function App() {
  const [authorizationToken, setAuthorizationToken] = useState(""); // State to hold the authToken

  // Function to handle the authToken from DialogDemo
  const handleAuthToken = (token) => {
    setAuthorizationToken(token);
  };
  useEffect(() => {
    // Check if the token is available in local storage on initial render
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setAuthorizationToken(storedToken);
    }
  }, []);

  return (
    <>
      {authorizationToken ? (
        // If the authToken is set, render the MainComponent
        <div>
          <MainComponent authorizationToken={authorizationToken} />
        </div>
      ) : (
        // If the authToken is not set, render the DialogDemo
        <DialogDemo onSaveToken={handleAuthToken} />
      )}
    </>
  );
}

export default App;
