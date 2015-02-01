var guida = Alloy.createController("guida");
var info = Alloy.createController("info");
var rimedi = Alloy.createController("rimedi");
var calendario = Alloy.createController("calendario");

var currentView;

var openAnimation = Ti.UI.createAnimation({
    transform : Ti.UI.create2DMatrix().scale(1),
    duration : 250,
});

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
		Ti.UI.createAlertDialog({
			buttonNames : ["Ok"],
			message : "Informativa sulla privacy\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
		}).show();

		
		Ti.App.Properties.setBool("first_app_start", false);
	}
});

$.index.open();

Ti.App.addEventListener("vls:hideHomeButton", function(ea){
	$.homeButton.hide();
});

Ti.App.addEventListener("vls:showHomeButton", function(ea){
	$.homeButton.show();
});