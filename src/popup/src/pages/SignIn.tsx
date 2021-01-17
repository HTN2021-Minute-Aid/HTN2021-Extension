/** @jsx jsx */
import firebase from '@firebase/app';
import React, {useContext} from 'react';
import {jsx, SxStyleProp, useColorMode} from 'theme-ui';
import "@firebase/auth";
import { IUserContext, UserContext } from '../util/context';
import { initialize } from '../util/firebase';


export const SignIn: React.FC = () => {

  const {setUserId, setLoggedIn} = useContext<IUserContext>(UserContext);


  const signUp = async() => {
    initialize();
    chrome.identity.getAuthToken({ 'interactive': true }, async(token) => {
      const credential = firebase.auth.GoogleAuthProvider.credential(null, token);
      const userInfo = await firebase.auth().signInWithCredential(credential);
      const userId = userInfo.user.uid;
      setUserId(userId);
      setLoggedIn(true);
      chrome.storage.sync.set({userId: userId}, () => console.log('updated userId'));
    });
  };

  const style: SxStyleProp = {
    width: '100%',
    borderColor: 'transparent',
    wordWrap: 'normal',
  };

  return (
    <div>
      <button sx={style} onClick={signUp}>Sign in with Google</button>
    </div>
  );
};