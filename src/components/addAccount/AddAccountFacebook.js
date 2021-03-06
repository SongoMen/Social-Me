import React, { useState } from "react";
import firebase from "firebase/app";

let pagesTokes = [];
let pagesNames = [];
let pagesId = [];
let pagesProfiles = [];

const AddAccountFacebook = () => {
  let access_token = window.location.href.split("=")[1];
  let user = firebase.auth().currentUser.uid;
  const [popup, setPopup] = useState(false);
  const [buttonStatus, setStaus] = useState("inactive");
  const [error, setError] = useState(false);

  function getToken(id, token, i) {
    fetch(
      `https://graph.facebook.com/v4.0/${id}?fields=access_token&access_token=${token}`
    )
      .then(res => res.json())
      .then(result => {
        pagesTokes[parseInt(i)] = result.access_token;
      });
  }

  if (window.location.href.includes("access_token")) {
    fetch(
      `https://graph.facebook.com/v4.0/me/accounts?access_token=${access_token}&debug=all&format=json&method=get&pretty=0&suppress_http_code=1&transport=cors`
    )
      .then(res => res.json())
      .then(result => {
        for (let i = 0; i < result.data.length; i++) {
          pagesNames[parseInt(i)] = result.data[parseInt(i)].name;
          pagesId[parseInt(i)] = result.data[parseInt(i)].id;
          getToken(
            result.data[parseInt(i)].id,
            result.data[parseInt(i)].access_token,
            i
          );
        }
      })
      .then(() => {
        if (pagesNames.length > 0) {setPopup(true);}
        else {setPopup("error");}
      })
      .catch(err => {
        console.log(err);
        setError(true);
      });
  }
  function addInformations(i, id) {
    fetch(
      `https://graph.facebook.com/v4.0/${id}/picture?access_token=${access_token}&format=json&method=get&pretty=0&redirect=false&suppress_http_code=1&transport=cors`
    )
      .then(res => res.json())
      .then(result => {
        pagesProfiles[parseInt(i)] = result.data.url;
      })
      .then(() => {
        firebase
          .firestore()
          .collection("users")
          .doc(user)
          .collection("accounts")
          .doc(pagesNames[parseInt(i)])
          .get()
          .then(doc => {
            if (doc.exists) {
              firebase
                .firestore()
                .collection("users")
                .doc(user)
                .collection("accounts")
                .doc(pagesNames[parseInt(i)])
                .update({
                  accessToken: pagesTokes[parseInt(i)],
                  profilePicture: pagesProfiles[parseInt(i)],
                  username: pagesNames[parseInt(i)],
                  social: "facebook",
                  id: pagesId[parseInt(i)]
                })
                .then(() => buttonDashboard())
                .catch(error => {
                  console.log("Error getting document:", error);
                });
            } else {
              firebase
                .firestore()
                .collection("users")
                .doc(user)
                .collection("accounts")
                .doc(pagesNames[parseInt(i)])
                .set({
                  accessToken: pagesTokes[parseInt(i)],
                  profilePicture: pagesProfiles[parseInt(i)],
                  username: pagesNames[parseInt(i)],
                  social: "facebook",
                  id: pagesId[parseInt(i)]
                })
                .then(() => buttonDashboard())
                .catch(error => {
                  console.log("Error getting document:", error);
                });
            }
          });
      });
  }
  function handleClick(e) {
    if (document.getElementById(e.currentTarget.id).classList[0] !== "active") {
      document.getElementById(e.currentTarget.id).classList.add("active");
    } else {
      document.getElementById(e.currentTarget.id).classList.remove("active");
    }
    if (document.querySelectorAll(".active").length > 0){
      setStaus("activeButton");
    }
    else {setStaus("inactive");}
  }
  function buttonClick() {
    if (document.querySelectorAll(".active").length > 0) {
      for (let i = 0; i < document.querySelectorAll(".active").length; i++) {
        addInformations(
          pagesId.indexOf(document.querySelectorAll(".active")[parseInt(i)].id),
          document.querySelectorAll(".active")[parseInt(i)].id
        );
      }
    }
  }

  function buttonDashboard() {
    window.location.href = "/dashboard";
  }
  return (
    <div className="addAccount">
      {error === true && (
        <div className="popup">
          <h2>Error</h2>
          <h4>Please try again later</h4>
          <button className="btn" onClick={buttonDashboard}>
            Dashboard
          </button>
        </div>
      )}
      {popup === true && (
        <div className="popup">
          <h2>Choose Pages to add</h2>
          {pagesNames.map((val, index) => {
            return (
              <h3 onClick={handleClick} key={index} id={pagesId[parseInt(index)]}>
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
