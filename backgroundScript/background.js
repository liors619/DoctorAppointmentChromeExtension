const options = {
    type: "basic",
    title: "LiorS title",
    message: "some message",
    iconUrl: "..\\images\\get_started128.png",
    priority: 2
  };

chrome.runtime.onStartup.addListener(function () {
    main()
    setInterval(main, 1 * 1000); // little less than a minute
});



//chrome.notifications.create(options, callback);
/*chrome.notifications.create('test', {
    type: 'basic',
    iconUrl: '..\\images\\get_started128.png',
    title: 'Test Message',
    message: 'You are awesome!',
    priority: 2
});*/





function main() {
    console.log("main called");
    if (new Date().getMinutes() == 30){

    }
    //chrome.notifications.create(`my-notification-${Date.now()}`, options, function(id) { console.log("Last error:", chrome.runtime.lastError); });
}
