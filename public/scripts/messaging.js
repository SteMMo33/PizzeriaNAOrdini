
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
        console.log("Token Is : " + token)
    })
    .catch(err => {
            // errorMessage.innerHTML = errorMessage.innerHTML + "; " + err;
            console.log("No permission to send push: ", err);
    });

    messaging.onMessage(payload => {
        console.log("Message received. ", payload);
        const { title, ...options } = payload.notification;
      });

