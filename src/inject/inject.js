$(document).ready(function() {
	// ----------------------------------------------------------
	// This part of the script triggers when page is done loading
	console.log("Hello. This message was sent from scripts/inject.js");
	// ----------------------------------------------------------
	window.scrollBy(0, 100);

	var sense;
	var imageSize;
	var handModule;
	var handConfiguration;

	PXCMSenseManager_CreateInstance().then(function (result) {
	    sense = result;
	    return sense.EnableHand(onHandData);
	}).then(function (result) {
	    handModule = result;
	    return sense.Init();
	}).then(function (result) {
	    return handModule.CreateActiveConfiguration();
	}).then(function (result) {
	    handConfiguration = result;
	    return handConfiguration.EnableAllAlerts();
	}).then(function (result) {
	    return handConfiguration.EnableAllGestures(false);
	}).then(function (result) {
	    return handConfiguration.ApplyChanges();
	}).then(function (result) {
	    return sense.QueryCaptureManager();
	}).then(function (capture) {
	    return capture.QueryImageSize(pxcmConst.PXCMCapture.STREAM_TYPE_DEPTH);
	}).then(function (result) {
	    imageSize = result.size;
	    return sense.StreamFrames();
	});

	function onHandData(mid, module, data) {
	    if (data.hands === undefined) return;
	    for (g = 0; g < data.gestures.length; g++) {
	        switch(data.gestures[g].name) {
	            case 'swipe_up':
	                console.log('up');
	                $(window).scrollTo('-=100px', 500, 'y');
	                break;
				case 'thumb_up':
					console.log("like");

					break;
				case 'swipe_down':
	                console.log('down');
	                $(window).scrollTo('+=300px', 500, 'y');
	                break;
	            case 'swipe_left':
	                console.log('left');
	                window.history.go(-1);
	                break;
	            case 'swipe_right':
	                console.log('right');
	                window.history.go(1);
	                break;
	            default:
	                break;
	        }
	    }
	}
});