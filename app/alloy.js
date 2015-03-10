// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//

Alloy.Globals.blinkButton = function(ea){
	ea.source.opacity = 0;
	setTimeout(function(){
		ea.source.opacity = 1;
	}, 50);
};

//init libraries
var moment = require('/lib/moment');
moment.lang('it');

//init model and DB
require("/models/BaseModel").init();
	
require("/models/UserData").init();
require("/models/PillAlert").init();
require("/models/Appointment").init();
require("/models/Symptom").init();

//create "Singleton" managers
Alloy.Controllers = {};

Alloy.Controllers.LogController = require('/businessControllers/LogController');
Alloy.Controllers.AsyncConnectionController = require('/businessControllers/AsyncConnectionController');
Alloy.Controllers.PushNotificationController = require('/businessControllers/PushNotificationController');

Alloy.Controllers.LogController.activate(false);
Alloy.Controllers.AsyncConnectionController.activate(false);

Ti.UI.iPhone.appBadge = 0;
