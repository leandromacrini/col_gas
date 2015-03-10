// 
//  GameController.js
//  VooDoc
//  
//  Created by Leandro Macrini on 2014-04-15.
//  Copyright 2014 Leandro Macrini. All rights reserved.
// 
//  Events:
//  onGameLoaded -> fired on game start

//DON'T USE "this" in a Singleton Context!

var platino = require('co.lanica.platino');
var _ = require("lib/underscore");
var moment = require('lib/moment');
moment.lang('it');

var BaseObserver = require('/Model/BaseObserver');
var UserData = require("/Model/UserData");
var PillAlert = require('/Model/PillAlert');

var DialogPopup = require("/View/DialogPopup").DialogPopup;
var DisclaimerPopup = require("/View/DisclaimerPopup").DisclaimerPopup;
var UserInfoPopup = require("/View/UserInfoPopup").UserInfoPopup;
var PillAlertPopup = require("/View/PillAlertPopup").PillAlertPopup;
var EditNamePopup = require("/View/EditNamePopup").EditNamePopup;
var HelpView = require("/View/HelpView").HelpView;
var EditView = require("/View/EditView").EditView;
var CalendarView = require("/View/CalendarView").CalendarView;
var AppointmentView = require("/View/AppointmentView").AppointmentView;

var LogController = require('/Controller/LogController');

var touching = false;
var timeout;

var GameController = (function(){
	/*Enums*/
	SpillingValues = {
		None : 0,
		Spillone : 1,
		Termometro: 2,
		Sacchetto : 3,
		Palloncino: 4,
		CartaIgienica : 5,
		Peretta : 6
	};
	
	/*Common Singleton Elements*/
	var active = false;
	var name = "GameController";
	var events = new Object();
	var DEMO_MODE = false;
	var mainWindow;
	var mainGameView;
	var intervalId = null;
	var topGap = 0;
	var spilling = SpillingValues.None;
	var lastSyntom = {};
	
	//views
	var editNamePopup,helpView,dialogPopup, editView, calendarView, appointmentView;

	BaseObserver.extend(events);
	
	function init(callback) {
		//pushNotification
		var PushNotificationController = require('/Controller/PushNotificationController');
		PushNotificationController.registerForPushNotification();
		
		//init "singleton" components
		editNamePopup = new EditNamePopup();
		helpView = new HelpView();
		editView = new EditView();
		calendarView = new CalendarView();
		appointmentView = new AppointmentView();
		
		//init game view
		mainGameView = platino.createGameView();
		mainGameView.fps = 30;
		mainGameView.color(255, 255, 255);
		mainGameView.debug = DEMO_MODE;
		mainGameView.enableOnDrawFrameEvent = false;
		mainGameView.keepScreenOn = true;
	
		// Loads HomeScene.js as starting point to the app
		mainGameView.addEventListener('onload', function(e) {
			LogController.info("Main GameView Loaded");
	
			// Set target screen size
			mainGameView.TARGET_SCREEN = {
				width : 320,
				height : 480
			};
			// set screen size for your game (TARGET_SCREEN size)
			var screenScale = mainGameView.size.width / mainGameView.TARGET_SCREEN.width;
			mainGameView.screen = {
				width : mainGameView.size.width / screenScale,
				height : mainGameView.size.height / screenScale
			};
			
			mainGameView.touchScaleX = mainGameView.screen.width / Ti.Platform.displayCaps.platformWidth;
			mainGameView.touchScaleY = mainGameView.screen.height / Ti.Platform.displayCaps.platformHeight;
			
			topGap = mainGameView.size.height - mainGameView.TARGET_SCREEN.height;
			
			if(topGap > 50) {
				var topView = Ti.UI.createView({
					top: 0,
					left : 0,
					right : 0,
					height : topGap,
					backgroundColor : "#ededed"
				});
				
				topView.add(Ti.UI.createImageView({
					height : Math.floor( topGap/2 ),
					image : '/graphics/images/logo.png'
				}));
				
				mainWindow.add(topView);
			} else {
				topGap = 0;
			}

			var actionCheck = function(e){
				touching = true;
				
				var oldzone = lastSyntom.zone || -1;
				
				lastSyntom = checkZone(e.x, e.y);
				
				if(lastSyntom.zone !== oldzone){
					//abort old symptom if any  
					if(timeout){
						clearTimeout(timeout);
						timeout = null;
					}
					if(lastSyntom.zone !== -1){
						LogController.info('Start Syntom : ' + JSON.stringify(lastSyntom));
						events.fireEvent('startSyntom', lastSyntom);
					} else if(spilling != SpillingValues.None && oldzone !== -1){
						//abort spilling symptoms when moving outside doll
						events.fireEvent('abortSyntom');
					}
				}
			};

			mainGameView.addEventListener('touchstart', function(e){
				events.fireEvent('touchstart', e);
				actionCheck(e);
			});
			
			
			mainGameView.addEventListener('touchend', function(e){
				if(lastSyntom.zone && lastSyntom.zone !==-1 && spilling != SpillingValues.None) {
					//start now only spilling events
					events.fireEvent('confirmSyntom', lastSyntom);
					LogController.info('Confirm Syntom' + JSON.stringify(lastSyntom));
				}
				
				clearTouchData();
				events.fireEvent('touchend', e);
			});
			
			mainGameView.addEventListener('touchmove', function(e){
				events.fireEvent('touchmove', e);
				actionCheck(e);
			});

			mainGameView.start();
	
			var DollScene  = require("Scene/DollScene");

			// push loading scene and start the game
			pushScene(new DollScene( ));
			
			if(callback)callback();
		});

		mainWindow.add(mainGameView);
		
		//check every 60 sec
		intervalId = setInterval(function(){
			remindersCheck();
		},10000);
		
		//check now
		remindersCheck();
		
		LogController.info("GameController started");
	}
	
	function clearTouchData(){
		lastSyntom = {};
		spilling = SpillingValues.None;
		touching = false;
		if(timeout){
			clearTimeout(timeout);
			timeout = null;
		}
	}
	
	function verify(){
		if(!active) throw String.format("%s is not active!", name);
	}
	
	function activate(demoMode) {
		DEMO_MODE = demoMode;
		active = true;
		
		//init dialog popup (may need before doctor scene)
		dialogPopup = new DialogPopup();
		
		//init window
		mainWindow = Ti.UI.createWindow({
			backgroundColor: 'white',
			orientationModes: [Ti.UI.PORTRAIT],
			fullscreen: true,
			navBarHidden: true,
			exitOnClose : true
		});
		
		mainWindow.addEventListener("open", function() {
			var firstStart = Ti.App.Properties.getBool("first_app_start", true);
		
			if (firstStart) {
				
				//STEP 3 - Complete and start
				var storeAndInit = function(){
					Ti.App.Properties.setBool("first_app_start", false);
					init(function(){
						openHelpView();
					});
				};
				
				//STEP 2 - UserInfo
				var showUserInfo = function(){
					var userinfo = new UserInfoPopup();
					userinfo.open(storeAndInit);
				}
				
				//STEP 1 - Disclaymer
				var disclaymer = new DisclaimerPopup();
				var loop = function() {
					openDialogPopup("Per poter utilizzare l'app e' necessario accettare il contratto d'uso.", function() {
						disclaymer.open(storeAndInit, loop);
					});
				};
				disclaymer.open(showUserInfo, loop);
		
			} else {
				init();
			}
		});
		
		mainWindow.open();
	}
	
	function checkDeltaTime(deltaT, pillAlert){
		var when = moment(pillAlert.When,"DDMMYYYY HH:mm");
		var now = moment();
		
		if(deltaT < 0) {
			var diff = now.diff(when, 'minutes', true);
			if(diff > deltaT) return true;
		} else {
			if(when.add(deltaT, 'minutes').isBefore(now)) return true;
		}
		
		when = null;
		now = null;
		
		return false;
	}
	
	function remindersCheck(scene) {
		if( DEMO_MODE ) return;
		
		LogController.info("RemindersCheck check started");
		
		// get today's alerts
		var pillAlerts = PillAlert.readPillAlertsByDate(moment().toDate());
		
		// Second Notification check
		_.each(pillAlerts, function(pillAlert){
			if( pillAlert.Taken === null && checkDeltaTime(30, pillAlert)){
				openDialogPopup("Attenzione hai saltato un farmaco! (Se lo hai preso correggilo dal calendario)",function(){
					LogController.info("Pill Missed");
					Ti.App.fireEvent("voo:pillMissed");
				});
				pillAlert.Taken = false;
				pillAlert.save();
			}
		});
		
		// First Notification check
		_.each(pillAlerts, function(pillAlert) {
			if (!pillAlert.Asked && pillAlert.Taken === null && checkDeltaTime(-2, pillAlert)) {
				openPillAlertPopup(pillAlert);
				pillAlert.Asked = true;
				pillAlert.save();
			}
		});
	
		//old missed
	}

	function checkZone(ex, ey) {
		var gapY = mainGameView.screen.height - 480;
		
		var x = ex * mainGameView.touchScaleX;
		var y = ey * mainGameView.touchScaleY - gapY;
		var zone = -1;
		
		//zones
		if(spilling != SpillingValues.None){
			if( x>= 90 && x<130 && y>=295 && y<335 ) zone = 1;
			if( x>=130 && x<185 && y>=295 && y<335 ) zone = 2;
			if( x>=185 && x<225 && y>=295 && y<335 ) zone = 3;
			if( x>= 90 && x<130 && y>=335 && y<375 ) zone = 4;
			if( x>=130 && x<185 && y>=335 && y<375 ) zone = 5;
			if( x>=185 && x<225 && y>=335 && y<375 ) zone = 6;
			if( x>= 90 && x<130 && y>=375 && y<415 ) zone = 7;
			if( x>=130 && x<185 && y>=375 && y<415 ) zone = 8;
			if( x>=185 && x<225 && y>=375 && y<415 ) zone = 9;
		
			if( x>=130 && x<185 && y>=215 && y<295 ) zone = 11;
			
			//nel caso di trascinamento diverso dallo spillone la zona è il dolore che deve essere lanciato indipendentemente dal punto dove si è
			if(zone != -1 && spilling != SpillingValues.Spillone){
			switch(spilling){
				case SpillingValues.Termometro:
					zone = 10;
					break;
				case SpillingValues.Sacchetto:
					zone = 12;
					break;
				case SpillingValues.CartaIgienica:
					zone = 13;
					break;
				case SpillingValues.Peretta:
					zone = 14;
					break;
				case SpillingValues.Palloncino:
					zone = 15;
					break;
				}
			}
		}
				
		return {zone:zone, x:x, y:y};
	}
	/*End Singleton Elements*/
	
	function openPillAlertPopup(pillAlert, callback){
		LogController.info("Opening PillAlert Popup");
		var popup = new PillAlertPopup();
		popup.open(pillAlert, callback);
	}
	
	function pushScene(scene) {
		mainGameView.pushScene(scene);
	}
	
	function getMainWindow() {
		return mainWindow;
	}
	
	function getMainGameView() {
		return mainGameView;
	}
	
	function openDialogPopup(message, okCallback, cancelCallback){
		dialogPopup.open(message, okCallback, cancelCallback);
	}
	
	function closeDialogPopup(){
		dialogPopup.close();
	}
	
	function openEditNamePopup(){
		editNamePopup.open();
	}
	
	function closeEditNamePopup(){
		editNamePopup.close();
	}
	
	function openHelpView(){
		helpView.open();
	}
	
	function closeHelpView(){
		helpView.close();
	}
	
	function openCalendarView(){
		calendarView.open();
	}
	
	function closeCalendarView(){
		calendarView.close();
	}
	
	function openAppointmentView(){
		appointmentView.open();
	}
	
	function closeAppointmentView(){
		appointmentView.close();
	}
	
	function openEditView(){
		editView.open();
	}

	function closeEditView(){
		editView.close();
	}
	
	function resizeW(value){
		return Math.floor(value / mainGameView.touchScaleX); 
	}
	
	function resizeH(value){
		return Math.floor(value / mainGameView.touchScaleY); 
	}
	
	function getTopGap() {
		return topGap;
	}
	
	function font(size, bold){
		return {
			fontFamily:'Sweetness',
			fontSize : (size || 18) + 'dp',
			fontWeight : bold? "bold" : "normal"
		};
	}
	
	function setSpilling(value){
		spilling = value;
	}
	
	function getSpilling(){
		return spilling;
	}
	
	
	
	return {
		events:events,
		
		getMainWindow:getMainWindow,
		getMainGameView:getMainGameView,
		
		openPillAlertPopup : openPillAlertPopup,
		openDialogPopup : openDialogPopup,
		closeDialogPopup : closeDialogPopup,
		openEditNamePopup : openEditNamePopup,
		openHelpView : openHelpView,
		closeEditNamePopup : closeEditNamePopup,
		closeHelpView : closeHelpView,
		openEditView: openEditView,
		closeEditView : closeEditView,
		openCalendarView : openCalendarView,
		closeCalendarView : closeCalendarView,
		openAppointmentView : openAppointmentView,
		closeAppointmentView : closeAppointmentView,
		setSpilling : setSpilling,
		getSpilling : getSpilling,
		SpillingValues : SpillingValues,
		
		remindersCheck : remindersCheck,
		
		resizeW : resizeW,
		resizeH : resizeH,
		font : font,
		getTopGap : getTopGap,
		
		verify:verify,
		activate:activate
	};
})();

module.exports = GameController;