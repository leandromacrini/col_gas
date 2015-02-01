//includes
var SintomoView = require("/staticViews/SintomoView").SintomoView;
var AppuntamentoView = require("/staticViews/AppuntamentoView").AppuntamentoView;
var PillReminderView = require('/staticViews/PillReminderView').PillReminderView;
var PillReminderReadView = require('/staticViews/PillReminderReadView').PillReminderReadView;

var DayListView = require("/staticViews/DayListView").DayListView;

var PillAlert = require('/models/PillAlert');
var Appointment = require('/models/Appointment');
var Symptom = require('/models/Symptom');

var that = this; 

this.sintomoView = new SintomoView();
this.appuntamentoView = new AppuntamentoView();
this.alertView = new PillReminderView();
this.alertReadView = new PillReminderReadView();

this.dayListView = new DayListView();

// Taking Screen Width
var screenWidth = Ti.Platform.displayCaps.platformWidth - 20;
var smallDisplay = Ti.Platform.displayCaps.platformHeight / Ti.Platform.displayCaps.platformWidth <= 1.5 ? true : false;

var months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

//Bollean to avoid chained animations
var animating = false;
var animationDuration = 500;

// Tool Bar
var toolBar = Ti.UI.createView({
	top : smallDisplay? -80 : 0,
	height : 125,
	backgroundImage: "/images/calendario.png"
});

// Previous Button - Tool Bar
var prevMonth = Ti.UI.createButton({
	bottom : 15,
	left : 15,
	width : 12,
	height : 20,
	backgroundImage : "/images/arrow-back.png",
	backgroundSelectedImage : "none"
});

// Next Button - Tool Bar
var nextMonth = Ti.UI.createButton({
	bottom : 15,
	right : 15,
	width : 12,
	height : 20,
	backgroundImage : "/images/arrow-next.png",
	backgroundSelectedImage : "none"
});

// Month Title - Tool Bar
var monthTitle = Ti.UI.createLabel({
	bottom: 5,
	width : "100%",
	textAlign : 'center',
	font:{ fontSize: 30, fontWeight: "bold"},
	color : '#FFF'
});

toolBar.add(monthTitle);
toolBar.add(prevMonth);
toolBar.add(nextMonth);

// Tool Bar - Day's
var toolBarDays = Ti.UI.createView({
	top : smallDisplay? 45 : 125,
	height : 25,
	layout : 'horizontal',
	backgroundColor : "#FFF"
});

createDayLabel = function(day, holiday) {
	return Ti.UI.createLabel({
		left: 0,
		text : day,
		width : "14%", // ~ 100 / 7
		height : "100%",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font:{ fontSize: 12, fontWeight: "bold"},
		color : '#000'
	});
};

toolBarDays.add(createDayLabel("LUN"));
toolBarDays.add(createDayLabel("MAR"));
toolBarDays.add(createDayLabel("MER"));
toolBarDays.add(createDayLabel("GIO"));
toolBarDays.add(createDayLabel("VEN"));
toolBarDays.add(createDayLabel("SAB", true));
toolBarDays.add(createDayLabel("DOM", true));

// Adding Tool Bar Title View & Tool Bar Days View

// Function which compute the data associated with a day label
function computeDayData(dayLabel){
	var symptoms;
	var appointments;
	var alerts;
	
	var backgroundImage = "none";
	
	if(dayLabel.date){
		symptoms = Symptom.readSymptomsByDate(dayLabel.date);
		appointments = Appointment.readAppointmentByDate(dayLabel.date);
		alerts = PillAlert.readPillAlertsByDate(dayLabel.date);
		
		var type = "";
		
		if(appointments) type = "A";
		if(symptoms) type += "B";
		if(alerts) type += "C";
		
		switch(type){
			case "AB":
				backgroundImage = "/images/bk-vs.png";
				break;
			case "AC":
				backgroundImage = "/images/bk-vr.png";
				break;
			case "BC":
				backgroundImage = "/images/bk-sr.png";
				break;
			case "ABC":
				backgroundImage = "/images/bk-vsr.png";
				break;
			case "A":
				backgroundImage = "/images/bk-v.png";
				break;
			case "B":
				backgroundImage = "/images/bk-s.png";
				break;
			case "C":
				backgroundImage = "/images/bk-r.png";
				break;
		}
	}
	// change background only if needed because it's a slow UI operation
	if( _.size(symptoms) != _.size(dayLabel.symptoms) || _.size(appointments) != _.size(dayLabel.appointments) ||_.size(alerts) != _.size(dayLabel.alerts ))
		dayLabel.backgroundImage = backgroundImage;
	
	// erase
	dayLabel.symptoms = null;
	dayLabel.appointments = null;
	dayLabel.alerts = null;
	
	// set
	dayLabel.symptoms = symptoms;
	dayLabel.appointments = appointments;
	dayLabel.alerts = alerts;
};

// Function which create day view template
dayView = function(e) {
	var label = Ti.UI.createButton({
		backgroundImage: "none",
		current : e.current,
		width : Math.floor(screenWidth / 7),
		height : Math.floor(screenWidth / 7),
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
		title : e.day,
		color : e.color,
		selectedColor : '#8e959f',
		font:{ fontSize: 22, fontWeight: "bold"},
		date : e.date
	});
	
	computeDayData(label);
	
	return label;
};

// Calendar Main Function
var calView = function(a, b, c) {
	var nameOfMonth = months[b];

	//create main calendar view
	var mainView = Ti.UI.createView({
		width : screenWidth,
		height : screenWidth,
		top : smallDisplay? 70 : 150
	});

	var container = Ti.UI.createView({
		width : Math.floor(screenWidth / 7) * 7,
		height : Math.floor(screenWidth / 7) * 7,
		layout : "horizontal"
	});
	mainView.add(container);

	//set the time
	var currentYear = new Date().getFullYear() === a;
	var currentMonth = new Date().getMonth() === b;
	var daysInMonth = 32 - new Date(a, b, 32).getDate();
	var dayOfMonth = new Date(a, b, c).getDate();
	var dayOfWeek = new Date(a, b, 1).getDay() - 1;
	var daysInLastMonth = 32 - new Date(a, b - 1, 32).getDate();
	var daysInNextMonth = (new Date(a, b, daysInMonth).getDay()) - 7;
	
	//sunday go to 6
	if(dayOfWeek < 0) dayOfWeek = 6;

	//set initial day number
	var dayNumber = daysInLastMonth - dayOfWeek + 1;

	//get last month's days
	for ( i = 0; i < dayOfWeek; i++) {
		container.add(new dayView({
			day : dayNumber,
			color : '#8e959f',
			current : 'prev',
			dayOfMonth : ''
		}));
		dayNumber++;
	};

	// reset day number for current month
	dayNumber = 1;

	//get this month's days
	for ( i = 0; i < daysInMonth; i++) {
		var date = new Date(a, b, dayNumber);
		
		var newDay = new dayView({
			day : dayNumber,
			color : date.getDay() ===0 || date.getDay() === 6 ? "#f5866c" : '#3a4756',
			current : 'yes',
			dayOfMonth : dayOfMonth,
			date : date
		});
		container.add(newDay);
		if (newDay.title == dayOfMonth && currentMonth && currentYear) {
			newDay.color = "#3af";
		}
		dayNumber++;
	}
	dayNumber = 1;

	//get remaining month's days
	for ( i = 0; i > daysInNextMonth; i--) {
		container.add(new dayView({
			day : dayNumber,
			color : '#8e959f',
			current : 'next',
			dayOfMonth : ''
		}));
		dayNumber++;
	};

	// this is the new "clicker" function, although it doesn't have a name anymore, it just is.

	container.addEventListener('click', function(e) {
		Ti.API.info('Container clicked: ' + JSON.stringify(e.source));
		switch (e.source.current) {
			case "yes":
				if(e.source.alerts || e.source.symptoms || e.source.appointments){
					//open popup
					that.dayListView.open($.calendario, {
						alerts : e.source.alerts,
						symptoms : e.source.symptoms,
						appointments : e.source.appointments,
						date : e.source.date
					});
				}
				break;
			case "prev":
				goPrev();
				break;
			case "next":
				goNext();
				break;
			default:
				break;
		}
	}); 


	return mainView;
};

// what's today's date?
var setDate = new Date();
a = setDate.getFullYear();
b = setDate.getMonth();
c = setDate.getDate();

// add the three calendar views to the window for changing calendars with animation later

that.prevCalendarView = null;
if (b == 0) {
	that.prevCalendarView = calView(a - 1, 11, c);
} else {
	that.prevCalendarView = calView(a, b - 1, c);
}
that.prevCalendarView.left = -screenWidth;

that.nextCalendarView = null;
if (b == 0) {
	that.nextCalendarView = calView(a + 1, 0, c);
} else {
	that.nextCalendarView = calView(a, b + 1, c);
}
that.nextCalendarView.left = screenWidth;

that.thisCalendarView = calView(a, b, c);

that.thisCalendarView.left = 0;

monthTitle.text = months[b] + ' ' + a;

// add everything to the window
$.container.add(toolBar);
$.container.add(toolBarDays);
$.container.add(that.thisCalendarView);
$.container.add(that.nextCalendarView);
$.container.add(that.prevCalendarView);

var slideNext = Titanium.UI.createAnimation({
	duration : animationDuration,
	left : -screenWidth
});

var slideReset = Titanium.UI.createAnimation({
	duration : animationDuration,
	left : 0
});

var slidePrev = Titanium.UI.createAnimation({
	duration : animationDuration,
	left : screenWidth
});

var titleUp = Titanium.UI.createAnimation({
	duration : animationDuration / 2,
	bottom : 7,
	autoreverse : OS_ANDROID ? true : false //we have 2 different animation on iOS and Android
});

var titleDown = Titanium.UI.createAnimation({ //used only on iOS
	duration : animationDuration / 2,
	bottom : -50,
	autoreverse : OS_ANDROID ? true : false //we have 2 different animation on iOS and Android
});

var goNext = function() {
	if (animating)
		return;

	animating = true;

	if (b == 11) {
		b = 0;
		a++;
	} else {
		b++;
	}

	monthTitle.setBottom(7);
	monthTitle.animate(titleDown);
	setTimeout(function() {
		monthTitle.text = months[b] + ' ' + a;
		if( ! OS_ANDROID ) monthTitle.animate(titleUp);
	}, animationDuration / 2);

	that.thisCalendarView.animate(slideNext);
	that.nextCalendarView.animate(slideReset);

	setTimeout(function() {
		that.thisCalendarView.left = -screenWidth;

		$.container.remove(that.prevCalendarView);
		that.prevCalendarView = null;

		//clean old view
		that.prevCalendarView = that.thisCalendarView;
		that.thisCalendarView = that.nextCalendarView;
		if (b == 11) {
			that.nextCalendarView = calView(a + 1, 0, c);
		} else {
			that.nextCalendarView = calView(a, b + 1, c);
		}
		that.nextCalendarView.left = screenWidth;
		$.container.add(that.nextCalendarView);

		animating = false;
	}, animationDuration);
};

var goPrev = function() {
	if (animating)
		return;

	animating = true;

	if (b == 0) {
		b = 11;
		a--;
	} else {
		b--;
	}

	monthTitle.setBottom(7);
	monthTitle.animate(titleDown);
	setTimeout(function() {
		monthTitle.text = months[b] + ' ' + a;
		if( ! OS_ANDROID ) monthTitle.animate(titleUp);
	}, animationDuration / 2);

	that.thisCalendarView.animate(slidePrev);
	that.prevCalendarView.animate(slideReset);

	setTimeout(function() {
		that.thisCalendarView.left = screenWidth;

		//clean old view
		$.container.remove(that.nextCalendarView);
		that.nextCalendarView = null;

		that.nextCalendarView = that.thisCalendarView;
		that.thisCalendarView = that.prevCalendarView;
		if (b == 0) {
			that.prevCalendarView = calView(a - 1, 11, c);
		} else {
			that.prevCalendarView = calView(a, b - 1, c);
		}
		that.prevCalendarView.left = -screenWidth;
		$.container.add(that.prevCalendarView);

		animating = false;
	}, animationDuration);
};

// Previous Month Click Event
prevMonth.addEventListener('singletap', goPrev);
// Next Month Click Event
nextMonth.addEventListener('singletap', goNext);

// Slide handler
$.container.addEventListener("swipe", function(e) {
	if (e.direction == "right") goPrev();
	else if (e.direction == "left")  goNext();
});

// events handling
Ti.App.addEventListener("vls:updateCalendarView", function(ea){
	Ti.API.info('Updating calendar data');
	_.each(that.thisCalendarView.children[0].children,computeDayData);
	_.each(that.prevCalendarView.children[0].children,computeDayData);
	_.each(that.nextCalendarView.children[0].children,computeDayData); 
});

Ti.App.addEventListener("vls:openSymptomDetail", function(ea){
	Ti.API.info('Open detail for: ' + JSON.stringify(ea.item));
	that.sintomoView.open($.calendario, ea.item);
});

Ti.App.addEventListener("vls:openAppointmentDetail", function(ea){
	Ti.API.info('Open detail for: ' + JSON.stringify(ea.item));
	that.appuntamentoView.open($.calendario, ea.item);
});

Ti.App.addEventListener("vls:openAlertDetail", function(ea){
	that.alertReadView.open($.calendario, ea.item);
});

Ti.App.addEventListener("vls:addAnotherReminder", function(ea){
	that.alertView.open($.calendario);
});

this.open = function() {
	Ti.App.fireEvent("vls:updateCalendarView");
};

function openSintomo(ea){
	Alloy.Globals.blinkButton(ea);
	that.sintomoView.open($.calendario);
}

function openAvviso(ea){
	Alloy.Globals.blinkButton(ea);
	that.alertView.open($.calendario);
}

function openVisita(ea){
	Alloy.Globals.blinkButton(ea);
	that.appuntamentoView.open($.calendario);
}