/** @jsx jsx */
import React, {useContext, useEffect, useState} from 'react';
import {jsx, SxStyleProp, useColorMode} from 'theme-ui';
import { getActiveTabId } from '../util/functions';


export const Home: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const initialize = async() => {
    const result = await chrome.storage.local.get(['title', 'isRecording']);
    setTitle(result.title);
    setIsRecording(result.isRecording);
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


    setIsRecording((isRecording) => {
      chrome.storage.local.set({
        // isRecording: false,
        isRecording: !isRecording,
      });
      return !isRecording;
    });
  };


  const editTitle = (title: string) => {
    setTitle(title);
    chrome.storage.local.set({
      title: title,
    });
  };


  const titleStyle: SxStyleProp = {
    fontSize: 'medium',
    fontWeight: 'body',
    px: 'bodyWrapper.px',
    py: 'bodyWrapper.py',
    width: '100%',
    height: '50%',
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
    </div>
  );
};