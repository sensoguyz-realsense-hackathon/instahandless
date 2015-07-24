/*******************************************************************************

INTEL CORPORATION PROPRIETARY INFORMATION
This software is supplied under the terms of l license agreement or nondisclosure
agreement with Intel Corporation and may not be copied or disclosed except in
accordance with the terms of that agreement
Copyright(c) 2014 Intel Corporation. All Rights Reserved.

*******************************************************************************/

/**
 * @function RealSenseInfo
 * Returns information about platform compatibility with Intel® RealSense™ and HTTP link(s) if installation/update required
 * 
 * @param [String] components   Array of strings with name of required components, for example ['face', 'hand']
 * @param {Function} callback   Callback receives object with the following properties
 *  IsReady             {Boolean} if true, platform ready to run Intel® RealSense™ SDK
 *  IsBrowserSupported  {Boolean} if false, browser doesn't support web sockets
 *  IsPlatformSupported {Boolean} if false, platform doesn't have Intel® RealSense™ 3D Camera
 *  Updates             {Array}   if not empty, array of required installation/update as array of object(s) with the following properties
                                    url  {String} HTTP address
                                    name {String} Friendly name
                                    href {String} HTTP link with address and name
 
 Example:
   RealSenseInfo(['face3d', 'hand'], function (info) {
      // check if (info.IsReady == true)
   })
*/

function RealSenseInfo(components, callback) {
    var RUNTIME_VERSION = "4.0";
    var RUNTIME_NAME = "Intel(R) RealSense(TM) SDK runtime setup";
    var RUNTIME_URL = "https://software.intel.com/en-us/realsense/websetup_v4.exe";

    var URL_PATH = '/Intel/RealSense/v4/';
    var ports = [4182, 50248, 51248, 52248, 53248, 54248];
    var port_index = -1;
    var xhr = null;

    versionCompare = function (left, right) {
        if (typeof left != 'string') return 0;
        var l = left.split('.');

        if (typeof right != 'string') return 0;
        var r = right.split('.');

        var length = Math.min(l.length, r.length);

        for (i = 0; i < length; i++) {
            if ((l[i] && !r[i] && parseInt(l[i]) > 0) || (parseInt(l[i]) > parseInt(r[i]))) {
                return 1;
            } else if ((r[i] && !l[i] && parseInt(r[i]) > 0) || (parseInt(l[i]) < parseInt(r[i]))) {
                return -1;
            }
        }

        return 0;
    }

    onReady = function () {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200 || xhr.responseText == '') {
            httpRequest(); // try next port
        } else {
            var info = JSON.parse(xhr.responseText);
            info.responseText = xhr.responseText;
            info.IsBrowserSupported = "WebSocket" in window;
            info.IsPlatformSupported = 'DCM' in info;
            info.Updates = new Array();
            if (info.IsPlatformSupported) {
                var update = false;
                if (!("web_server" in info) || versionCompare(RUNTIME_VERSION, info.web_server) > 0) update = true;
                else if (!('runtime' in info) || versionCompare(RUNTIME_VERSION, info.runtime) > 0) update = true;
                else if (components != null) {
                    for (i = 0; i < components.length; i++) {
                        if (!(components[i] in info)) update = true;
                    }
                }
                if (update) info.Updates.push({ 'url': RUNTIME_URL, 'name': RUNTIME_NAME, 'href': '<l href="' + RUNTIME_URL + '">' + RUNTIME_NAME + '</l>' });
            }
            info.IsReady = info.IsPlatformSupported && info.IsBrowserSupported && info.Updates.length == 0;
            callback(info);
        }
    }

    httpRequest = function () {
        port_index++;
        if (port_index < ports.length) {
            try {
                xhr = new XMLHttpRequest();
                var url;
                if (ports[port_index]<49152) {
                    url = 'http://localhost:' + ports[port_index] + URL_PATH + JSON.stringify(components);
                } else {
                    url = 'https://localhost:' + ports[port_index] + URL_PATH + JSON.stringify(components);
                }
                xhr.open("GET", url, true);
                xhr.onreadystatechange = onReady;
                //xhr.timeout = 100;
                //xhr.ontimeout = httpRequest;
                xhr.send(null);
            } catch (exception) {
                httpRequest();
            }
        } else {
            var info = new Object();
            info.responseText = 'Cannot get info from server';
            info.IsPlatformSupported = false;
            info.IsBrowserSupported = "WebSocket" in window;
            info.Updates = new Array();
            info.IsReady = false;
            callback(info);
        }
    }

    httpRequest();
}
