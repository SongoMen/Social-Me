import React, { useState } from "react";
import firebase from "firebase/app";

let pagesTokes = [];
let pagesNames = [];
let pagesId = [];

const AddAccountFacebook = () => {
  let access_token = window.location.href.split("=")[1];
  let user = firebase.auth().currentUser.uid;
  const [popup, setPopup] = useState(false);
  const [buttonStatus, setStaus] = useState("inactive");
  const [error, setError] = useState(false);
  if (window.location.href.includes("access_token")) {
    fetch(
      `https://graph.facebook.com/v4.0/me/accounts?access_token=${access_token}&debug=all&format=json&method=get&pretty=0&suppress_http_code=1&transport=cors`
    )
      .then(res => res.json())
      .then(result => {
        for (let i = 0; i < result.data.length; i++) {
          pagesNames[i] = result.data[i].name;
          pagesTokes[i] = result.data[i].access_token;
          pagesId[i] = result.data[i].id;
        }
      })
      .then(() => {
        if (pagesNames.length > 0) setPopup(true);
        else setPopup("error");
      })
      .catch(err => {
        console.log(err);
        setError(true)
      });
  }
  function handleClick(e) {
    if (document.getElementById(e.currentTarget.id).classList[0] !== "active") {
      document.getElementById(e.currentTarget.id).classList.add("active");
    } else {
      document.getElementById(e.currentTarget.id).classList.remove("active");
    }
    if (document.querySelectorAll(".active").length > 0)
      setStaus("activeButton");
    else setStaus("inactive");
  }
  function buttonClick() {
    if (document.querySelectorAll(".active").length > 0) {
      for (let i = 0; i < document.querySelectorAll(".active").length; i++) {
        console.log(document.querySelectorAll(".active")[i].id);
      }
    }
  }
  function buttonDashboard(){
      window.location.href = "/dashboard"
  }
  function addInformations(i, id) {}
  return (
    <div className="addAccount">
        {error === true&&
        <div className="popup">
            <h2>Error</h2>
            <h4>Please try again later</h4>
            <button className="btn" onClick={buttonDashboard}>Dashboard</button>
        </div>
        }
      {popup === true && (
        <div className="popup">
          <h2>Choose Pages to add</h2>
          {pagesNames.map((val, index) => {
            return (
              <h3 onClick={handleClick} key={index} id={pagesId[index]}>
                {val}
              </h3>
            );
          })}
          <button onClick={buttonClick} className={"btn " + buttonStatus}>
            Next
          </button>
        </div>
      )}
      {popup === "error" && (
        <div className="popup">
          <h2>We didn't find pages.</h2>
        </div>
      )}
      <svg width="38" height="38" viewBox="0 0 38 38" stroke="#fff">
        <g fill="none" fillRule="evenodd">
          <g transform="translate(1 1)" strokeWidth="2">
            <circle strokeOpacity="0.5" cx="18" cy="18" r="18" />
            <path d="M36 18c0-9.94-8.06-18-18-18">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </g>
      </svg>
      <h3>Wait a second, we are setting everything up !</h3>
    </div>
  );
};

export default AddAccountFacebook;
