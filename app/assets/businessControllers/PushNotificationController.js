//
//  PushNotificationController.js
//  Vettore.Mobile
//
//  Created by Leandro Macrini on 2013-05-24.
//  Copyright 2013 Leandro Macrini. All rights reserved.
//

var UserData = require("/models/UserData");

var LogController = require('/businessControllers/LogController');

var that = this;

var currentPushNotification = null;

function registerForPushNotification() {

	if (Titanium.Network.online) {
		if (Ti.Platform.osname === "android") {
			LogController.info('Register to Android Push Notification');
			androidRegistration();
		} else {
			LogController.info('Register to iOS Push Notification');
			iOsRegistration();
		}
	} else {
		errorCallback({
			'error' : 'NETWORK_ERROR'
		});
	}
};

var errorCallback = function(e) {
	LogController.error(String.format("Error during push notification registration: %s", e.error));
	var message;
	if (e.error == 'ACCOUNT_MISSING') {
		message = 'Nessun Google account trovato, configurarne uno per ricevere le notifiche push.';
		Titanium.UI.createAlertDialog({
			title : 'Attenzione',
			message : message,
			buttonNames : ['OK']
		}).show();
	}

};

var androidRegistration = function() {
	gcm = require('com.activate.gcm');
	try {
		gcm.registerC2dm({
			success : function(e) {
				var deviceToken = e.registrationId;
				LogController.info(String.format("Push Notification registration success with ID: %s", e.registrationId));
				
				var userData = UserData.load();
			
				userData.DeviceToken = e.registrationId;
				
				userData.save();
				userData = null;
			},
			error : errorCallback,
			callback : function(e) {
				LogController.info(String.format("Push Message reveived: %s", e.data.message));

				var intent = Ti.Android.createIntent({
					action : Ti.Android.ACTION_MAIN,
					flags : Ti.Android.FLAG_ACTIVITY_NEW_TASK | Ti.Android.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED,
					className : 'it.leonarts.voodoc/it.leonarts.voodoc.VoodocActivity',
					packageName : 'it.leonarts.voodoc/it.leonarts.voodoc'
				});
				intent.addCategory(Titanium.Android.CATEGORY_LAUNCHER);

				var pending = Ti.Android.createPendingIntent({
					activity : Ti.Android.currentActivity,
					intent : intent,
					type : Ti.Android.PENDING_INTENT_FOR_ACTIVITY,
					flags : Titanium.Android.FLAG_ACTIVITY_NEW_TASK
				});
				var notification = Ti.Android.createNotification({
					contentIntent : pending,
					contentTitle : e.data.title,
					contentText : e.data.message,
					tickerText : e.data.ticker,
					icon : Ti.App.Android.R.drawable.appicon
				});
				Ti.Android.NotificationManager.notify(1, notification);
			}
		});
	} catch(e) {
		errorCallback({
			'error' : 'INTERNAL_ERROR'
		});
	}
};

var iOsRegistration = function() {
	// Check if the device is running iOS 8 or later
	if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
		function registerForPush() {
	        Ti.Network.registerForPushNotifications({
	            success : function(e) {
					var deviceToken = e.deviceToken;
					LogController.info("iOS8 Registration success with ID:" + e.deviceToken);
					
					//invio il DeviceToken al server del Pumez! :D
					var userData = UserData.load();
					
					userData.DeviceToken = e.deviceToken;
					
					userData.save();
					userData = null;
				},
				error : errorCallback,
				callback : function(e) {
					LogController.info("Message reveived: " + e.data.alert);
					Ti.UI.iPhone.appBadge = 0;
				}
	        });
	        // Remove event listener once registered for push notifications
	        Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush); 
	    };
	 
		// Wait for user settings to be registered before registering for push notifications
	    Ti.App.iOS.addEventListener('usernotificationsettings', registerForPush);
	 
	    // Register notification types to use
	    Ti.App.iOS.registerUserNotificationSettings({
		    types: [
	            Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
	            Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
	            Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
	        ]
	    });
	} else {
		Ti.Network.registerForPushNotifications({
			types : [Ti.Network.NOTIFICATION_TYPE_BADGE, Ti.Network.NOTIFICATION_TYPE_ALERT, Ti.Network.NOTIFICATION_TYPE_SOUND],
			success : function(e) {
				var deviceToken = e.deviceToken;
				LogController.info("iOS Registration success with ID:" + e.deviceToken);
				
				//invio il DeviceToken al server del Pumez! :D
				var userData = UserData.load();
				
				userData.DeviceToken = e.deviceToken;
				
				userData.save();
				userData = null;
			},
			error : errorCallback,
			callback : function(e) {
				LogController.info("Message reveived: " + e.data.alert);
				Ti.UI.iPhone.appBadge = 0;
			}
		});
	}
};

exports.registerForPushNotification = registerForPushNotification;
