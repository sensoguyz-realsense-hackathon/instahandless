$(document).ready(function() {
	// ----------------------------------------------------------
	// This part of the script triggers when page is done loading
	console.log("Injected...");
	// ----------------------------------------------------------

	initApi();

	var sense;
	var imageSize;
	var handModule;
	var handConfiguration;

	var lastGestureDatetime;

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
		$("body").append("<div id='cam_status' style='font-size:20px; position: fixed;top: 0;right: 0;'>Cam enabled</div>");
	    return sense.StreamFrames();
	});

	function setStatus(msg) {
		$("#cam_status").text(msg);
	}

	function onHandData(mid, module, data) {
	    if (data.hands === undefined) return;


		var allowedGestures = [
				"thumb_up",
				"thumb_down",
				"swipe_down",
				"swipe_up"
		];

		for (g = 0; g < data.gestures.length; g++) {

			if (allowedGestures.indexOf(data.gestures[g].name) != -1) {
				console.log(data.gestures[g].name);

				if (lastGestureDatetime) {
					var currentDate = new Date();
					if ((currentDate - lastGestureDatetime) < 1000) {
						console.log(data.gestures[g].name + " - timeout");
						return;
					}
				}

                lastGestureDatetime = new Date();
            }


			switch(data.gestures[g].name) {
	            case 'swipe_up':
	                setStatus('up');
					api.nextPost();
					break;
				case 'thumb_up':
					setStatus("like");
					api.likeCurrentPost();
					break;
				case 'thumb_down':
					setStatus("dislike");
					api.dislikeCurrentPost();
					break;
				case 'swipe_down':
					setStatus('down');
	                //$(window).scrollTo('+=300px', 500, 'y');
					api.prevPost();
					break;
	            case 'swipe_left':
					setStatus('left');
	                window.history.go(-1);
	                break;
	            case 'swipe_right':
					setStatus('right');
	                window.history.go(1);
	                break;
				case 'tap':
					setStatus('tap');
					api.openProfile();
					break;
				case 'full_pinch':
				case 'fist':
					setStatus('fist');
	            default:
	                break;
	        }

		}
	}
});