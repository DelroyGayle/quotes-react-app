//import React from "react";
import * as React from "react";
import logo from "./logo.svg";
import "./App.css";
// import { useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";

// Default
let quote =
  "The greatest glory in living lies not in never falling, but in rising every time we fall.";
let author = "Nelson Mandela";
let numwords;

function App() {
  const [data, setData] = React.useState(null);
  const [fetchError, setFetchError] = React.useState(null);
  const [fetchError2, setFetchError2] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("https://delroygayle-quote-server-app.glitch.me/api")
      .then((response) => {
        if (!response.ok) {
          let temp = `Could not fetch the data - ${response.status}`;
          setFetchError(temp);
          setIsLoading(false);
          throw temp;
        }

        return response.json();
      })
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setFetchError(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header fadeOut2">
        {isLoading && <img src={logo} className="App-logo" alt="logo" />}
        {isLoading && <div>Loading</div>}
        {fetchError && (
          <div className="errormessage">
            <p>Something went wrong:</p>
            <pre>{fetchError}</pre>
          </div>
        )}
        {data && <Main />}
      </header>
    </div>
  );

  function ErrorHandler({ error }) {
    return (
      <div role="alert">
        <p>An error occurred:</p>
        <pre>{fetchError2}</pre>
      </div>
    );
  }

  function fetchNextQuote() {
    fetch("https://delroygayle-quote-server-app.glitch.me/api/quotes/random")
      .then((response) => {
        if (!response.ok || response.status < 200 || response.status > 204) {
          setFetchError2(response.statusText);
          throw Error(response.statusText);
        }
        return response.text();
      })
      .then((response) => {
        let data = response ? JSON.parse(response) : {};

        setData({ quote: data.message.quote, author: data.message.author });
        quote = data.message.quote;
        author = data.message.author;
        numwords = quote.split(" ").length; // Determine how many words?
      })
      .catch((error) => {
        alert(error.message);
        setFetchError2(`${error}`);
        throw error;
      });
  }

  /* Display the quote however make the font smaller
     if there are more than 25 words in the quote
  */

  function Main() {
    return (
      <ErrorBoundary FallbackComponent={ErrorHandler}>
        <div className="main-backgr">
          <p className="spacing"></p>
          <div className="quote-backgr">
            <blockquote></blockquote>
            <blockquote>
              <p
                className={`quote ${
                  numwords > 25 ? "smaller-font" : ""
                } aligned`}
              >
                {quote}
              </p>
            </blockquote>
            <p className="author">{author}</p>
            <div className="rj-button">
              <p>
                <button
                  id="newquote"
                  className="button-27"
                  onClick={fetchNextQuote}
                >
                  New Quote
                </button>
              </p>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
