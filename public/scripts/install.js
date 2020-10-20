
'use strict';

let deferredInstallPrompt = null;

const installButton = document.getElementById('butInstall');
installButton.addEventListener('click', installPWA);

const searchOrderlButton = document.getElementById('butInstall');


// Add event listener for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);

// Add event listener for appinstalled event
window.addEventListener('appinstalled', logAppInstalled);


/**
 * Event handler for beforeinstallprompt event.
 *   Saves the event & shows install button.
 * @param {Event} evt
 */
function saveBeforeInstallPromptEvent(evt) {
  // alert("App può essere installata!")
  console.log('[install] saveBeforeInstallPromptEvent')
  // Save event & show the install button.
  deferredInstallPrompt = evt;
  installButton.removeAttribute('hidden');
}


/**
 * Event handler for butInstall - Does the PWA installation.
 * @param {Event} evt
 */
function installPWA(evt) {
  // Add code show install prompt & hide the install button.
  deferredInstallPrompt.prompt();
  installButton.setAttribute('hidden',true);

  // Log user response to prompt.
  deferredInstallPrompt.userChoice
    .then((choice) => {
      if (choice.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt', choice);
      } else {
        console.log('User dismissed the A2HS prompt', choice);
      }
      deferredInstallPrompt = null;
    });
}


/**
 * Event handler for appinstalled event.
 *   Log the installation to analytics or save the event somehow.
 * @param {Event} evt
 */
function logAppInstalled(evt) {
  // Add code to log the event
  console.log('App was installed.', evt);
}
