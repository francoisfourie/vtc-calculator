self.addEventListener('install', (event) => {
    console.log('Service worker installed.');
  });
  
  self.addEventListener('fetch', (event) => {
    // You can handle fetch events here if needed
  });