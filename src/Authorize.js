// WORK IN PROGRESS, NOT USED CURRENTLY
// Use Firebase & httpOnly server side Cookies to create persistent login
// Not sure whether need both this and server.js as well

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../backend/firebase/firebase";
import {  getAuth,
    setPersistence,
    signInWithEmailAndPassword,
    browserSessionPersistence,
    signOut,
    Auth
} from 'firebase/auth';

function Authorize(props) {

    const { state } = props;

    setPersistence(Auth.Persistence.NONE);

    signInWithEmailAndPassword(auth, props.state.email, props.state.password)
        .then(user => {
        // Get the user's ID token as it is needed to exchange for a session cookie.
        return user.getIdToken().then(idToken => {
          // Session login endpoint is queried and the session cookie is set.
          // CSRF protection should be taken into account.
          // ...


          //   Figure out how to write getCookie() and postIdTokenToSessionLogin() below
          //   const csrfToken = getCookie('csrfToken')
          //   return postIdTokenToSessionLogin('/sessionLogin', idToken, csrfToken);
        });
      })
        .then(() => {
        // A page redirect would suffice as the persistence is set to NONE.
        return signOut();
      }).then(() => {
        window.location.assign('/login');
      });
}

export default Authorize;