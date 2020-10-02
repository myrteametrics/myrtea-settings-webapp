export let appTitle = '';

export const environment = {
  production: true,
  URL: '/api/v4',
  defaultLanguage: 'fr',
  clientLogo: '../assets/images/LogoWebApp.png',
  WS_URL: `wss://${window.location.host}/api/v4`
};

export const titleConfig = new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', './assets/app-title.json');
  xhr.onload = () => {
    if (xhr.status === 200) {
      appTitle = JSON.parse(xhr.responseText).appTitle;
      resolve(JSON.parse(xhr.responseText));
    } else {
      reject('Cannot load configuration...');
    }
  };
  xhr.send();
});
