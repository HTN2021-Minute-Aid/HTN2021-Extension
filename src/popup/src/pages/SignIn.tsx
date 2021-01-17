/** @jsx jsx */
import firebase from '@firebase/app';
import React, {useContext} from 'react';
import {jsx, SxStyleProp, useColorMode} from 'theme-ui';
import "@firebase/auth";
import { IUserContext, userContext } from '../util/context';
import { initialize } from '../util/firebase';


export const SignIn: React.FC = () => {

  const {setUserId} = useContext<IUserContext>(userContext);


  const signUp = async() => {
    initialize();
    chrome.identity.getAuthToken({ 'interactive': true }, async(token) => {
      // Use the token.
      const credential = firebase.auth.GoogleAuthProvider.credential(null, token);
      const user = await firebase.auth().signInWithCredential(credential);
      setUserId(user.user.uid);
    });
  };

  const style: SxStyleProp = {
    width: '100%',
    borderColor: 'transparent',
  };

  return (
    <div>
      <button sx={style} onClick={signUp}>Sign up</button>
    </div>
  );
};