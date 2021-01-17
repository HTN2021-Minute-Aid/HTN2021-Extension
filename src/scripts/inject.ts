import { Caption } from "../common/types";

console.log('script successfully injected');

const captionWrapperClass: string = 'a4cQT';
const captionButtonClass: string = 'n8i9t';
const captionSession = {
  content: 'iTTPOb VbkSUe',
  name: 'zs7s8d jxFHg',
  span: 'CNusmb',
  wrapper: 'TBMuR bj4p3b',
};
const joinedBodyClass: string = 'EIlDfe T3F3Rd';


const getElement = (className: string): HTMLElement => {
  return <HTMLDivElement>Array.from(
    document.getElementsByClassName(className)
  )[0];
};

const captions: Caption[] = [];
const sessions: (Function|undefined)[] = [];

let curIdx = 0;

//listens to updated transcripts
const addSessionMO = (session: Element) => {
  const id = session.id;
  const observer = new MutationObserver((mutationList, observer) => {
    mutationList.forEach((mutation: MutationRecord) => {
      mutation.addedNodes.forEach(node => {
        const element: Element = <Element>node;
        if (element.className === captionSession.span) {
          if (!element.parentElement || !element.parentElement.parentElement) return;
          const sentence = Array.from(element.parentElement.parentElement.childNodes)
                                .reduce((sentence, spanWrapper) => {
            const text = (<Element>spanWrapper.childNodes.item(0)).innerHTML;
            return sentence + ' ' + text;
          }, '');
          console.log('sentence'+sentence);
          captions[parseInt(id)].content = sentence;
          console.log(captions);
        }
      });
    });
  });
  observer.observe(session, {
    childList: true,
    subtree: true
  });
  return observer.disconnect;
};

//listens to new sessions being added
const addCaptionMO = () => {
  const wrapper = getElement(captionWrapperClass);

  const observer = new MutationObserver((mutationList, observer) => {
    mutationList.forEach((mutation: MutationRecord) => {
      mutation.addedNodes.forEach(node => {
        const element: Element = <Element>node;
        if (element.className === captionSession.wrapper) {
          if (element.id === '') {
            element.id = curIdx.toString();
            sessions[curIdx] = addSessionMO(element);
            captions[curIdx] = {
              name: (<Element>element.childNodes.item(1)).innerHTML,
              content: (<Element>element.childNodes.item(2)
                        .childNodes.item(0)
                        .childNodes.item(0)
                        .childNodes.item(0))
                        .innerHTML
            };

            curIdx++;
            console.log('new caption session');
          }
        }
      });
      mutation.removedNodes.forEach(node => {
        const element: Element = <Element>node;
        if (element.className === captionSession.wrapper) {
          if (element.id === undefined) return;
          const disconnect = sessions[parseInt(element.id)];
          if (disconnect) {
            disconnect();
            sessions[parseInt(element.id)] = undefined;
          }
          console.log(captions);
          console.log('caption session disappeared');
        }
      });
    });
  });
  observer.observe(wrapper, {
    childList: true,
  });
  return observer.disconnect;
};


//listen to when the user joins the meeting
const addBodyMO = () => {
  const observer = new MutationObserver((mutationList, observer) => {
    mutationList.forEach((mutation: MutationRecord) => {
      if ((<Element>mutation.target).className === joinedBodyClass) {
        console.log((<Element>mutation.target).className);
        // document.dispatchEvent(new CustomEvent('start'));
        document.dispatchEvent(new CustomEvent('joined'));
        observer.disconnect();
      }
    });
  });
  observer.observe(document.body, {
    attributes: true,
  });
  return observer.disconnect;
};

addBodyMO();

let captionMoDisconnect: Function;

document.addEventListener('start', (event) => {
  getElement(captionButtonClass).click();
  captionMoDisconnect = addCaptionMO();
});

document.addEventListener('stop', (event) => {
  getElement(captionButtonClass).click();
  if (captionMoDisconnect) captionMoDisconnect();
  document.dispatchEvent(new CustomEvent('captions', {
    detail: {
      content: captions,
    }
  }))
  captions.splice(0, captions.length);
  sessions.splice(0, sessions.length);
  curIdx = 0;
});
console.log('script loaded');
