//WORK IN PROGRESS, NOT USED CURRENTLY
//https://firebase.google.com/docs/auth/admin/manage-cookies
//https://github.com/firebase/quickstart-nodejs/blob/master/auth-sessions/app.js

import {  getAuth } from 'firebase/auth';
import { firebaseConfig } from './firebase/firebase';

const express = require('express');
const app = express();

const admin = require("firebase-admin");

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');



function serveContentForUser(endpoint, req, res, decodedClaims) {
    // Lookup the user information corresponding to cookie and return the profile data for the user.
    return admin.auth().getUser(decodedClaims.sub).then(()=>{
      res.redirect('/home')
    }
    )
}

// Attaches a CSRF token to the request
function attachCsrfToken(url, cookie, value) {
  return function(req, res, next) {
    if (req.url == url) {
      res.cookie(cookie, value);
    }
    next();
  }
}

// Checks if a user is signed in and if so, redirects to profile page
function checkIfSignedIn(url) {
  return function(req, res, next) {
    if (req.url == url) {
      const sessionCookie = req.cookies.session || '';
      // User already logged in. Redirect to profile page.
      admin.auth().verifySessionCookie(sessionCookie).then(function(decodedClaims) {
        res.redirect('/home');
      }).catch(function(error) {
        next();
      });
    } else {
      next();
    }
  }
}

// Initialize Firebase
admin.initializeApp(firebaseConfig);

// Support JSON-encoded bodies.
app.use(bodyParser.json());
// Support URL-encoded bodies.
app.use(bodyParser.urlencoded({
  extended: true
}));
// Support cookie manipulation.
app.use(cookieParser());
// Attach CSRF token on each request.
app.use(attachCsrfToken('/', 'csrfToken', (Math.random()* 100000000000000000).toString()));
// If a user is signed in, redirect to profile page.
app.use(checkIfSignedIn('/',));
// Serve static content from public folder.
app.use('/', express.static('public'));


// Get profile endpoint.
app.get('/profile', function (req, res) {
  // Get session cookie.
  const sessionCookie = req.cookies.session || '';
  // Get the session cookie and verify it. In this case, we are verifying if the
  // Firebase session was revoked, user deleted/disabled, etc.
  admin.auth().verifySessionCookie(sessionCookie, true /** check if revoked. */)
    .then(function(decodedClaims) {
      // Serve content for signed in user.
      return serveContentForUser('/home', req, res, decodedClaims);
    }).catch(function(error) {
      // Force user to login.
      res.redirect('/');
    });
});

// Login user
app.post('/sessionLogin', (req, res) => {
    // Get the ID token passed and the CSRF token.
    const idToken = req.body.idToken.toString();
    const csrfToken = req.body.csrfToken.toString();
    // Guard against CSRF attacks.
    if (csrfToken !== req.cookies.csrfToken) {
      res.status(401).send('UNAUTHORIZED REQUEST!');
      return;
    }
    // Set session expiration to 1 day.
    const expiresIn = 60 * 60 * 24 * 1000;
    // Create the session cookie. This will also verify the ID token in the process.
    // The session cookie will have the same claims as the ID token.
    // To only allow session cookie setting on recent sign-in, auth_time in ID token
    // can be checked to ensure user was recently signed in before creating a session cookie.
    getAuth()
      .createSessionCookie(idToken, { expiresIn })
      .then(
        (sessionCookie) => {
          // Set cookie policy for session cookie.
          const options = { maxAge: expiresIn, httpOnly: true, secure: true };
          res.cookie('session', sessionCookie, options);
          res.end(JSON.stringify({ status: 'success' }));
        },
        (error) => {
          res.status(401).send('UNAUTHORIZED REQUEST!');
        }
      );
  });


// Allow logged in users to access content
app.post('/home', (req, res) => {
    const sessionCookie = req.cookies.session || '';
    // Verify the session cookie. In this case an additional check is added to detect
    // if the user's Firebase session was revoked, user deleted/disabled, etc.
    getAuth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then((decodedClaims) => {
        serveContentForUser('/profile', req, res, decodedClaims);
      })
      .catch((error) => {
        // Session cookie is unavailable or invalid. Force user to login.
        res.redirect('/login');
      });
});

// Logout user
app.post('/sessionLogout', (req, res) => {
    res.clearCookie('session');
    res.redirect('/login');
});


app.listen(8000, function () {
    console.log('mini-plm backend app listening on port 8000')
  })