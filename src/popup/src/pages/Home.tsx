/** @jsx jsx */
import firebase from '@firebase/app';
import React, {useContext, useEffect, useState} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import { getActiveTabId, getActiveTabUrl } from '../util/functions';
import '@firebase/auth';
import { IUserContext, UserContext } from '../util/context';


export const Home: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const {setLoggedIn, setUserId} = useContext<IUserContext>(UserContext);

  const initialize = async() => {
    const tabUrl = await getActiveTabUrl();
    const result = await chrome.storage.local.get(
      [`title${tabUrl}`, `isRecording${tabUrl}`]
    );
    setTitle(result[`title${tabUrl}`]);
    setIsRecording(result[`isRecording${tabUrl}`]);
  };

  useEffect(() => {initialize()}, []);

  const toggleRecording = async() => {
    if (isRecording) {
      chrome.tabs.sendMessage(
        await getActiveTabId(),
        {
          action: 'stop',
          title: title,
        },
        async(response) => {
          console.log(response);
        },
      );
    } else {
      chrome.tabs.sendMessage(
        await getActiveTabId(),
        {action: 'start'},
        async(response) => {
          console.log(response);
        },
      );
    }

    const tabUrl = await getActiveTabUrl();
    setIsRecording((isRecording) => {
      chrome.storage.local.set({
        [`isRecording${tabUrl}`]: !isRecording,
      });
      return !isRecording;
    });
  };


  const editTitle = async(title: string) => {
    setTitle(title);
    const tabUrl = await getActiveTabUrl();
    chrome.storage.local.set({
      [`title${tabUrl}`]: title,
    });
  };

  const signOut = () => {
    firebase.auth().signOut();
    
    setLoggedIn(false);
    setUserId(undefined);
    chrome.storage.sync.remove(['userId']);
    console.log('user signed out');
  };


  const titleStyle: SxStyleProp = {
    fontSize: 'medium',
    fontWeight: 'body',
    px: 'bodyWrapper.px',
    py: 'bodyWrapper.py',
    width: '100%',
  };

  const wrapperStyle: SxStyleProp = {
    height: '100%',
  };

  const buttonStyle: SxStyleProp = {
    bg: 'primary',
    width: '100%',
    fontFamily: 'body',
    color: 'text.contrast',
    borderWidth: 0,
    py: '0.5em',
    my: 10,
  };


  return (
    <div sx={wrapperStyle}>
      <input
        sx={titleStyle}
        placeholder='Title'
        value={title}
        onChange={(event) => editTitle(event.target.value)}
      />
      <button
        sx={buttonStyle}
        onClick={toggleRecording}
      >{isRecording ? 'Stop' : 'Start'}</button>
      <button
        sx={buttonStyle}
        onClick={signOut}
      >Sign out</button>
    </div>
  );
};