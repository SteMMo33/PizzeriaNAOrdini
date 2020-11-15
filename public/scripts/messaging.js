
/**
 * Aggiungere i dati nel file /firebase-messaging-sw.js
 * Il SDK di firebase si aspetta esattamente questo file
 */
const messaging = firebase.messaging();


// Messaging
messaging.requestPermission().then(() => {
    // message.innerHTML = "Notifications allowed";
    console.log('Notifications allowed')
    return messaging.getToken();
})
.then(token => {
    // tokenString.innerHTML = "Token Is : " + token;
    console.log("> Messaging Token Is : " + token)
})
.catch(err => {
    // errorMessage.innerHTML = errorMessage.innerHTML + "; " + err;
    console.error("No permission to send push: ", err);
});


messaging.onMessage(payload => {
    console.log(">> Message received. ", payload);
    const { title, ...options } = payload.notification;
});


// Callback push
self.addEventListener('push', function(event) {

    console.info('Event: Push');
    var title = 'New commit on Github Repo: RIL';
    var body = {
        'body': 'Click to see the latest commit',
        'tag': 'pwa',
        'icon': './images/icons/logo48x48.png'
    };

    event.waitUntil(
        self.registration.showNotification(title, body)
    );
});


// Callback - notificationclick nella finestra di notifica
self.addEventListener('notificationclick', function(event) {

    var url = './latest.html';
  
    event.notification.close(); // Close the notification
  
    // Open the app and navigate to latest.html after clicking the notification
    event.waitUntil(
      clients.openWindow(url)
    );  
});

