import { Caption } from "../common/types";

//inject the getting captions script
const script = document.createElement('script');
script.src = chrome.runtime.getURL('scripts/inject.js');
(document.head || document.documentElement).appendChild(script);

let captions: Caption[] = [];
let pending = true;
let joined = false;

const waitForCaptions = (): Promise<void> => new Promise((resolve) => {
  while (pending) {}
  resolve();
});

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
      await waitForCaptions();
      pending = true;
      res({message: 'success', captions: captions});
      break;
    default:
      res({message: `action not found ${msg.action}`});
      break;
  }
  return true;
});


document.addEventListener('captions', (event) => {
  const typedEvent: CustomEvent = <CustomEvent>event;
  console.log('content', typedEvent.detail.captions);
  captions = typedEvent.detail.captions;
  pending = false;
});


document.addEventListener('joined', (event) => {
  joined = true;
});