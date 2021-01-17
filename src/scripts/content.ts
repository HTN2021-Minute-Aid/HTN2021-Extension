export interface Caption {
  name: string;
  content: string;
}
export interface Transcript {
  ownerID: string;
  title: string;
  content: Caption[];
}
//inject the getting captions script
const script = document.createElement('script');
script.src = chrome.runtime.getURL('scripts/inject.js');
(document.head || document.documentElement).appendChild(script);

let joined = false;
let title = '';

const postTranscript = async(transcript: Transcript) => {
  const url = 'https://minute-aid.herokuapp.com/transcripts/add';
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transcript),
  });
  console.log(await response.json());
};

const clearSiteStorage = () => {
  const tabUrl = location.href;
  chrome.storage.local.remove([`title${tabUrl}`, `isRecording${tabUrl}`]);
  console.log('cleared');
};

clearSiteStorage();

//return true indicates async
chrome.runtime.onMessage.addListener(async (msg, sender, res) => {
  switch (msg.action) {
    case 'joined':
      res({message: 'success', joined: joined});
      break;
    case 'start':
      document.dispatchEvent(new CustomEvent('start'));
      res({message: 'success'});
      break;
    case 'stop':
      document.dispatchEvent(new CustomEvent('stop'));
      title = msg.title;
      res({message: 'success'});
      break;
    default:
      res({message: `action not found ${msg.action}`});
      break;
  }
  return true;
});

const getUserId = async() => {
  const userId: string = await new Promise((resolve) => {
    chrome.storage.sync.get(['userId'], (result) => {
      resolve(result.userId);
    });
  });
  return userId;
};

document.addEventListener('captions', async(event) => {
  const typedEvent: CustomEvent = <CustomEvent>event;
  const captions = typedEvent.detail.content;
  console.log(typedEvent.detail);
  const transcript: Transcript = {
    ownerID: await getUserId(),
    title: title,
    content: captions,
  };
  postTranscript(transcript);
  console.log(transcript);
});


document.addEventListener('joined', (event) => {
  joined = true;
});