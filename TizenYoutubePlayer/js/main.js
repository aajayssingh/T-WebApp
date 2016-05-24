window.onload = function () {

    if (window.tizen === undefined) {
        console.log('This application needs to be run on Tizen device');
        //return;
    }

// add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });

    initialize();
    switchYouTube("G_GBwuYuOOs");

}