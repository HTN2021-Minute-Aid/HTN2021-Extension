

//inject the getting caption tracks script
const script = document.createElement('script');
script.src = chrome.runtime.getURL('scripts/inject.js');
(document.head || document.documentElement).appendChild(script);


//return true indicates async
chrome.runtime.onMessage.addListener(async (msg, sender, res) => {
  switch (msg.action) {
    case 'start':
      // document.dispatchEvent(
      //   new CustomEvent('jumpToTime', {
      //     detail: {time: msg.data.time}, //the time to jump to
      //   }),
      // );
      // res({message: 'success'});
      break;
    case 'stop':
    default:
      res({message: `action not found ${msg.action}`});
      break;
  }
  return false;
});

document.addEventListener('captions', async (event) => {
  // const typedEvent: CustomEvent = <CustomEvent>event;
  // if (typedEvent.detail === null) {
  //   transcripts = [];
  //   return;
  // }
  // transcripts = await getTranscripts(typedEvent.detail.captionTracks);
  // console.log('content', transcripts);
});

document.addEventListener('loaded', (event) => {

});

