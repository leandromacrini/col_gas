// Taking Screen Width
var screenWidth = Ti.Platform.displayCaps.platformWidth - 20;

var months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

//Bollean to avoid chained animations
var animating = false;
var animationDuration = 500;

// Tool Bar
var toolBar = Ti.UI.createView({
	top : 0,
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
	top : 125,
	height : 25,
	layout : 'horizontal',
	backgroundColor : "#FFF"
});

createDayLabel = function(day, holiday) {
	return Ti.UI.createLabel({
		left : '0',
		text : day,
		width : "14%", // ~ 100 / 7
		height : "100%",
		textAlign : 'center',
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


// Function which create day view template
dayView = function(e) {
	var label = Ti.UI.createButton({
		backgroundColor: "transparent",
		backgroundImage: "none",
		backgroundSelectedImage: "none",
		current : e.current,
		width : Math.floor(screenWidth / 7),
		height : Math.floor(screenWidth / 7),
		title : e.day,
		color : e.color,
		backgroundSelectedImage : '/images/today-circle-grey.png',
		selectedColor : '#8e959f',
		font:{ fontSize: 22, fontWeight: "bold"},
		date : e.date
	});
	return label;
};

// Calendar Main Function
var calView = function(a, b, c) {
	var nameOfMonth = months[b];

	//create main calendar view
	var mainView = Ti.UI.createView({
		width : screenWidth,
		height : screenWidth,
		top : 150
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
			color : date.getDay() ===0 || date.getDay() === 6 ? "red" : '#3a4756',
			current : 'yes',
			dayOfMonth : dayOfMonth,
			date : date
		});
		container.add(newDay);
		if (newDay.title == dayOfMonth && currentMonth && currentYear) {
			newDay.color = "green";
			newDay.backgroundImage='/images/today-circle.png';
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
		switch (e.source.current) {
			case "yes":
				//open popup
				/*var detail = Alloy.createController('DailySchedulesPopup', { 
				    date: e.source.date
				});*/
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

var prevCalendarView = null;
if (b == 0) {
	prevCalendarView = calView(a - 1, 11, c);
} else {
	prevCalendarView = calView(a, b - 1, c);
}
prevCalendarView.left = -screenWidth;

var nextCalendarView = null;
if (b == 0) {
	nextCalendarView = calView(a + 1, 0, c);
} else {
	nextCalendarView = calView(a, b + 1, c);
}
nextCalendarView.left = screenWidth;

var thisCalendarView = calView(a, b, c);

thisCalendarView.left = 0;

monthTitle.text = months[b] + ' ' + a;

// add everything to the window
$.container.add(toolBar);
$.container.add(toolBarDays);
$.container.add(thisCalendarView);
$.container.add(nextCalendarView);
$.container.add(prevCalendarView);

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
	bottom : -50
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

	//monthTitle.setTop(0);
	monthTitle.animate(titleDown);
	setTimeout(function() {
		monthTitle.text = months[b] + ' ' + a;
		if( ! OS_ANDROID ) monthTitle.animate(titleUp);
	}, animationDuration / 2);

	thisCalendarView.animate(slideNext);
	nextCalendarView.animate(slideReset);

	setTimeout(function() {
		thisCalendarView.left = -screenWidth;

		$.container.remove(prevCalendarView);
		prevCalendarView = null;

		//clean old view
		prevCalendarView = thisCalendarView;
		thisCalendarView = nextCalendarView;
		if (b == 11) {
			nextCalendarView = calView(a + 1, 0, c);
		} else {
			nextCalendarView = calView(a, b + 1, c);
		}
		nextCalendarView.left = screenWidth;
		$.container.add(nextCalendarView);

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

	monthTitle.animate(titleDown);
	setTimeout(function() {
		monthTitle.text = months[b] + ' ' + a;
		if( ! OS_ANDROID ) monthTitle.animate(titleUp);
	}, animationDuration / 2);

	thisCalendarView.animate(slidePrev);
	prevCalendarView.animate(slideReset);

	setTimeout(function() {
		thisCalendarView.left = screenWidth;

		//clean old view
		$.container.remove(nextCalendarView);
		nextCalendarView = null;

		nextCalendarView = thisCalendarView;
		thisCalendarView = prevCalendarView;
		if (b == 0) {
			prevCalendarView = calView(a - 1, 11, c);
		} else {
			prevCalendarView = calView(a, b - 1, c);
		}
		prevCalendarView.left = -screenWidth;
		$.container.add(prevCalendarView);

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

this.open = function() {
	// show me
	if(OS_IOS){
		$.calendario.transform = Titanium.UI.create2DMatrix().scale(0);
		var a = Ti.UI.createAnimation({
		    transform : Ti.UI.create2DMatrix().scale(1.1),
		    duration : 200,
		});
		a.addEventListener('complete', function(){
		    $.calendario.animate({
		        transform: Ti.UI.create2DMatrix(),
		        duration: 50
		    });
		});
		$.calendario.open();
		$.calendario.animate(a);
	} else {
		$.calendario.open();
	}
};

function close() {
	if(OS_IOS){
		$.mainContainer.opacity = "1"; //hack
		$.mainContainer.animate({ opacity : '0', duration : 250});
		setTimeout(function(){
			$.calendario.close();
		},250);
	} else {
		$.calendario.close();
	}
};
