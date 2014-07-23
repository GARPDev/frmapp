/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var pictureSource=1;   // picture source
var destinationType=1; // sets the format of returned value 
var gcmId = '';
var apnId = '';

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;

        var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iOS" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iOS" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
        var pushNotification = window.plugins.pushNotification;

        if(deviceType == "iOS") {
            pushNotification.register(app.successApnHandler, app.errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"app.onNotificationAPN"});        
        } else if(deviceType == "Android") {
            pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"43874697608","ecb":"app.onNotificationGCM"});
        }
    }, // result contains any message sent from the plugin call
    successApnHandler: function(result) {
        alert('APN Push Callback Success! Result = '+result)
        apnId = result;
    }, // result contains any message sent from the plugin call
    successHandler: function(result) {
        alert('GCM Push Callback Success! Result = '+result)
    },
    errorHandler:function(error) {
        alert('Push Registration Error: ' + error);
    },
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    console.log("Regid " + e.regid);
                    alert('GCM Registration id = '+e.regid);
                    gcmId = e.regid;
                }
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
              alert('GCM Push Message Recieved: '+e.message);
              
            break;
 
            case 'error':
              alert('GCM error = '+e.msg);
            break;
 
            default:
              alert('An unknown GCM event has occurred');
              break;
        }
    },
    onNotificationAPN: function(e) {
        console.log("On Notification");
        if (e.alert) {
            console.log("Alert " + e.alert);
            navigator.notification.alert(e.alert);
            alert('Alert Push Message Recieved: '+e.alert);
        }
        if (e.badge) {
            console.log("Badge number " + e.badge);
            var pushNotification = window.plugins.pushNotification;
            pushNotification.setApplicationIconBadgeNumber(app.successHandler, app.errorHandler, e.badge);
            alert('Badge Push Message Recieved: '+e.badge);
        }
        if (e.sound) {
            console.log("Sound passed in " + e.sound);
            var snd = new Media(e.sound);
            snd.play();
            alert('Sound Push Message Recieved: '+e.sound);            
        }
    }
};
