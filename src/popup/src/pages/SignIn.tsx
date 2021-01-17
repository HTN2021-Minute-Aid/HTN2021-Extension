/** @jsx jsx */
import firebase from '@firebase/app';
import React, {useContext} from 'react';
import {jsx, SxStyleProp, useColorMode} from 'theme-ui';
import "@firebase/auth";
import { IUserContext, UserContext } from '../util/context';


export const SignIn: React.FC = () => {

  const {setUserId, setLoggedIn} = useContext<IUserContext>(UserContext);


  const signUp = async() => {
    const authProvider = new firebase.auth.GoogleAuthProvider();
    authProvider.setCustomParameters({
      prompt: 'select_account',
    })
    const userInfo = await firebase.auth().signInWithPopup(authProvider);
    const userId = userInfo.user.uid;
    setUserId(userId);
    setLoggedIn(true);
    chrome.storage.sync.set({userId: userId}, () => console.log('updated userId'));
  };

  const style: SxStyleProp = {
    width: '100%',
    borderColor: 'transparent',
    wordWrap: 'normal',
    bg: 'primary',
    color: 'text.contrast',
    height: '100%',
  };

  return (
    <div>
      <button sx={style} onClick={signUp}>Sign in with Google</button>
    </div>
  );
};