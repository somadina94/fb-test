const express = require("express");
const login = require("facebook-chat-api");
const cookie = require("./cookie").cookie;
const facebookCookie = JSON.stringify(cookie);

const app = express();

const loginAsync = (credentials) => {
  return new Promise((resolve, reject) => {
    login(credentials, (err, api) => {
      if (err) reject(err);
      else {
        // Modify the getUserInfo method before returning the 'api' object
        api.getUserInfo = function (userID, callback, fields) {
          // Log the original 'fields' value
          console.log("Original Fields:", fields);

          // Check if 'fields' is an array before using filter
          const modifiedFields = Array.isArray(fields)
            ? fields.filter((field) => field !== "gender")
            : fields;

          // Log the modified 'fields' value
          console.log("Modified Fields:", modifiedFields);

          // Call the original getUserInfo with the modified 'fields'
          originalGetUserInfo.call(this, userID, callback, modifiedFields);
        };

        resolve(api);
      }
    });
  });
};

const getUserInfoWithCookie = async (cookie) => {
  try {
    // Create a session object using the provided cookie
    const session = {
      appState: JSON.parse(cookie), // Parse the cookie into appState
    };

    // Log in with the session using loginAsync
    const api = await loginAsync({ appState: JSON.parse(cookie) });

    // Replace 'USER_ID_TO_CHECK' with the actual user ID
    const userId = "61550511221539";

    // Get basic user info
    const basicUserInfo = await new Promise((resolve, reject) => {
      api.getUserInfo(userId, (err, userInfo) => {
        if (err) reject(err);
        else resolve(userInfo);
      });
    });

    console.log("Basic User Info:", basicUserInfo);

    // Retrieve additional details, including the current city, using the Facebook Graph API
  } catch (error) {
    console.error(error.message);
  }
};

// Example usage
getUserInfoWithCookie(facebookCookie);

module.exports = app;
//61550511221539
