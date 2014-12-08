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
	currentView = view;
	currentView.transform = Titanium.UI.create2DMatrix().scale(0);
	$.container.add(currentView);
	currentView.animate(openAnimation);
	$.homeButton.show();
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
	openSubView(calendario.getView());
}

function openGuida(ea){
	openSubView(guida.getView());
}

function openRimedi(ea){
	openSubView(rimedi.getView());
}

function openInfo(ea){
	openSubView(info.getView());
}

$.index.open();
