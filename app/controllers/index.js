var guida = Alloy.createController("guida");
var info = Alloy.createController("info");
var rimedi = Alloy.createController("rimedi");
var calendario = Alloy.createController("calendario");

var AgreementView = require("/staticViews/AgreementView").AgreementView;
var HelpView = require("/staticViews/HelpView").HelpView;

var currentView;
var helpView = new HelpView();

var openAnimation = Ti.UI.createAnimation({
    transform : Ti.UI.create2DMatrix().scale(1),
    duration : 250,
});

function showHelpView(){
	helpView.open($.index);
};

function openSubView(view){
	currentView = view.getView();
	if(OS_IOS){
		currentView.transform = Titanium.UI.create2DMatrix().scale(0);
		$.container.add(currentView);
		currentView.animate(openAnimation);
	} else {
		$.container.add(currentView);
	}
	$.homeButton.show();
	view.open();
}

function closeSubView(){
	$.homeButton.hide();
	currentView.opacity = 1;
	currentView.animate({ opacity : 0, duration : 250});
	setTimeout(function(){
		$.container.remove(currentView);
		currentView = null;
	},250);	
}

function openCalendario(ea){
	openSubView(calendario);
}

function openGuida(ea){
	openSubView(guida);
}

function openRimedi(ea){
	openSubView(rimedi);
}

function openInfo(ea){
	openSubView(info);
}

$.index.addEventListener('open', function (ea) {
	var firstStart = Ti.App.Properties.getBool("first_app_start", true);
	if (firstStart) {
		// Disclaymer
		var dialog = new AgreementView();
		
		dialog.open($.index);
	} else {
		Alloy.Controllers.PushNotificationController.registerForPushNotification();
	}
});

$.index.open();

Ti.App.addEventListener("vls:hideHomeButton", function(ea){
	$.homeButton.hide();
});

Ti.App.addEventListener("vls:showHomeButton", function(ea){
	$.homeButton.show();
});