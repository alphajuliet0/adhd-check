import { mount } from './app.js';
// Memory-only store: answers live only in this tab's memory. Nothing is written
// to localStorage, cookies, IndexedDB or any other browser storage, so closing
// or reloading the tab clears them. The result page offers a report download
// and print/PDF for keeping a copy.
let mem = null;
const store = {
  persistent: false,
  load() { return mem; },
  save(s) { mem = s; },
  clear() { mem = null; },
};
mount(document.getElementById('app'), store, {
  footerPrivacy: 'Your answers are scored in your browser. This page has no code that sends them anywhere, and it loads nothing from other sites. They are kept only in this tab\'s memory and are cleared when you close or reload it; use the download or print options on the result page if you want to keep a copy. Like any website, the host keeps standard visit logs (such as IP address and time). Those are separate from your answers, which never reach the host.',
});
