/** @jsx jsx */
import React, {useEffect, useState} from 'react';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';

import {jsx, ThemeProvider} from 'theme-ui';
import {theme} from './util/theme';

import {getActiveTabId} from './util/functions';
import { JoinMeets } from './pages/JoinMeets';
import { SignIn } from './pages/SignIn';
import { Home } from './pages/Home';
import { IUserContext, UserContext } from './util/context';
import {initializeFirebase} from './util/firebase';

export const App: React.FC = () => {
  const [joined, setJoined] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>();


  const initialize = async() => {
    chrome.tabs.sendMessage(
      await getActiveTabId(),
      {action: 'joined'},
      async(response) => {
        console.log(response);
        setJoined(response.joined);
      },
    );
    const result = await chrome.storage.sync.get(['userId']);

    if (result.userId) {
      setUserId(result.userId);
      setLoggedIn(true);
    }
  };

  useEffect(() => {
    initialize();
    initializeFirebase();
  }, []);

  const userContext: IUserContext = {
    userId: userId,
    setUserId: setUserId,
    loggedIn: loggedIn,
    setLoggedIn: setLoggedIn,
  };

  return (
    <UserContext.Provider value={userContext}>
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route
              exact
              path='/'
              component={
                loggedIn ? (joined ? Home : JoinMeets) : SignIn
              }
            />
            <Route path='/sign-in' component={SignIn} />
            <Route path='/join-meets' component={JoinMeets} />
            <Route path='/home' component={Home} />
          </Switch>
        </Router>
      </ThemeProvider>
    </UserContext.Provider>
  );
};

export default App;
