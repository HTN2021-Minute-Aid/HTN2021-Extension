/** @jsx jsx */
import React, {useEffect, useState} from 'react';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';

import {jsx, ThemeProvider} from 'theme-ui';
import {theme} from './util/theme';

import {getActiveTabId} from './util/functions';
import { JoinMeets } from './pages/JoinMeets';
import { SignIn } from './pages/SignIn';
import { Home } from './pages/Home';
import { Caption } from '../../common/types';

export const App: React.FC = () => {
  const [joined, setJoined] = useState<boolean>(false);
  const [captions, setCaptions] = useState<Caption>();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>();
  const [token, setToken] = useState<string>();


  const getIsJoined = async() => {
    chrome.tabs.sendMessage(
      await getActiveTabId(),
      {action: 'joined'},
      async(response) => {
        console.log(response);
        setJoined(response.joined);
      },
    );
  };

  useEffect(() => {
    getIsJoined();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route
            exact
            path='/'
            // component={
            //   transcripts.length === 0 //no transcripts
            //   ? NoTranscript
            //   : Home
            // }
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
  );
};

export default App;
