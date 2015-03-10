// 
//  PillReminderView.js
//  Coliche Gassose
//  
//  Created by Leandro Macrini on 2014-12-21.
//  Copyright 2014 Leandro Macrini. All rights reserved.
// 

var moment = require('lib/moment');
moment.lang('it');
var _ = require("lib/underscore");
function PillReminderView(){
	var that = this;
	
	var PillAlert = require('/models/PillAlert');
	var EditTimePopup = require('/staticViews/EditTimePopup').EditTimePopup;
	
	this.timePopup = new EditTimePopup();
	
	that.rimedio = 0;
	that.ripetizione = 0;
	
	this.optsRimedio = {
		options: PillAlert.RemedyNames,
		selectedIndex: 0,
		title: 'TIPO DI RIMEDIO?'
	};
	this.dialogRimedio = Ti.UI.createOptionDialog(that.optsRimedio);
	this.dialogRimedio.addEventListener('click', function(ea){
		that.rimedio = ea.index;
		that.lblPill.text = PillAlert.RemedyNames[that.rimedio];

	});
	
	this.optsRipetizione = {
		options: PillAlert.RemedyRepeats,
		selectedIndex: 0,
		title: 'TEMPO DI RIPETIZIONE?'
	};
	this.dialogRipetizione = Ti.UI.createOptionDialog(that.optsRipetizione);
	this.dialogRipetizione.addEventListener('click', function(ea){
		that.ripetizione = ea.index;
		that.lblCicle.text = PillAlert.RemedyRepeats[that.ripetizione];
	});
	
	// components
	this.me = Ti.UI.createView({
		backgroundColor : "#FFF"
	});
	
	this.scroll = Ti.UI.createScrollView({
		top: 0,
		bottom : 70,
		layout : 'vertical',
		scrollType: 'vertical'
	});
	this.me.add(this.scroll);
	
	this.scroll.add(Ti.UI.createLabel({
		top : 0,
		height : 50,
		left : 0,
		right : 0,
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
		color : "#FFF",
		font:{ fontSize: 34, fontWeight: "bold"},
		backgroundColor : "#662382",
		text : "RIMEDIO"
	}));
	
	this.scroll.add(Ti.UI.createLabel({
		top : 10,
		height : 30,
		left : 25,
		right : 25,
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,
		color : "#000",
		font:{ fontSize: 20, fontWeight: "bold"},
		text : "TIPOLOGIA"
	}));
	
	this.lblPill = Ti.UI.createLabel({
		top: 10,
		borderWidth: 2,
		borderColor: '#ccc',
		backgroundColor: '#FFF',
		color: '#777',
		font:{ fontSize: 18, fontWeight: "bold"},
		height : 30,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		left : 25,
		right : 25,
		text:"Terapia posizionale"
	});
	this.lblPill.addEventListener('singletap', function(ea){
		that.dialogRimedio.show();
	});
	this.lblPill.add(Ti.UI.createView({
		right: 0,
		backgroundColor: '#ccc',
		backgroundImage: "/images/ico-down.png",
		height : 30,
		width : 30
	}));
	this.scroll.add(this.lblPill);
	
	this.scroll.add(Ti.UI.createLabel({
		top : 10,
		bottom : 5,
		height : 30,
		left : 25,
		right : 0,
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,
		color : "#000",
		font : { fontSize: 20, fontWeight: "bold"},
		text : "DETTAGLI RIMEDIO"
	}));
	
	this.txbInfo = Ti.UI.createTextArea({
		borderWidth: 2,
		borderColor: '#ccc',
		backgroundColor: '#fff',
		color: '#777',
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		font:{ fontSize: 18, fontWeight: "bold"},
		height : 80,
		left : 25,
		right : 25,
		maxLength : 60
	});
	this.scroll.add(this.txbInfo);
	
	this.scroll.add(Ti.UI.createLabel({
		top : 10,
		height : 30,
		left : 25,
		right : 0,
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,
		color : "#000",
		font : { fontSize: 20, fontWeight: "bold"},
		text : "GIORNI"
	}));
	this.chkContainer = Ti.UI.createView({
		width : '257dp',
		height : '50dp',
		top : 5,
		layout : 'horizontal'
	});
	this.scroll.add(this.chkContainer);
	var font = { fontSize: 18, fontWeight: "bold"};
	this.chkContainer.add(Ti.UI.createLabel({ textAlign: 'center', font : font, width : '25dp', height : '25dp', left : 0, text : "L" }));
	this.chkContainer.add(Ti.UI.createLabel({ textAlign: 'center', font : font, width : '25dp', height : '25dp', left : "4dp", text : "M" }));
	this.chkContainer.add(Ti.UI.createLabel({ textAlign: 'center', font : font, width : '25dp', height : '25dp', left : "4dp", text : "M" }));
	this.chkContainer.add(Ti.UI.createLabel({ textAlign: 'center', font : font, width : '25dp', height : '25dp', left : "4dp", text : "G" }));
	this.chkContainer.add(Ti.UI.createLabel({ textAlign: 'center', font : font, width : '25dp', height : '25dp', left : "4dp", text : "V" }));
	this.chkContainer.add(Ti.UI.createLabel({ textAlign: 'center', font : font, width : '25dp', height : '25dp', left : "4dp", text : "S" }));
	this.chkContainer.add(Ti.UI.createLabel({ textAlign: 'center', font : font, width : '25dp', height : '25dp', left : "4dp", text : "D" }));
	
	this.chkContainer.add(Ti.UI.createLabel({ textAlign: 'center', font : font, width : '35dp', height : '25dp', left : "23dp", text : "Tutti" }));

	function toggle(ea) {
		if (ea.source.checked) {
			ea.source.backgroundImage = '/images/check-off.png';
			ea.source.checked = false;
		} else {
			ea.source.backgroundImage = '/images/check-on.png';
			ea.source.checked = true;
		}
		if(that.chkL.checked && that.chkMa.checked && that.chkMe.checked && that.chkG.checked && that.chkV.checked && that.chkS.checked && that.chkD.checked){
			that.chkAll.backgroundImage = '/images/check-on.png';
			that.chkAll.checked = true;
		} else {
			that.chkAll.backgroundImage = '/images/check-off.png';
			that.chkAll.checked = false;
		}
	}

	this.chkL = Ti.UI.createButton({
		backgroundImage : '/images/check-off.png',
		width : '25dp',
		height : '25dp',
		checked : false,
		left : 0,
		bottom : 0
	});
	this.chkL.addEventListener('singletap', toggle);
	this.chkContainer.add(this.chkL);

	this.chkMa = Ti.UI.createButton({
		backgroundImage : '/images/check-off.png',
		width : '25dp',
		height : '25dp',
		checked : false,
		left : "4dp",
		bottom : 0
	});
	this.chkMa.addEventListener('singletap', toggle);
	this.chkContainer.add(this.chkMa);
	
	this.chkMe = Ti.UI.createButton({
		backgroundImage : '/images/check-off.png',
		width : '25dp',
		height : '25dp',
		checked : false,
		left : "4dp",
		bottom : 0
	});
	this.chkMe.addEventListener('singletap', toggle);
	this.chkContainer.add(this.chkMe);
	
	this.chkG = Ti.UI.createButton({
		backgroundImage : '/images/check-off.png',
		width : '25dp',
		height : '25dp',
		checked : false,
		left : "4dp",
		bottom : 0
	});
	this.chkG.addEventListener('singletap', toggle);
	this.chkContainer.add(this.chkG);
	
	this.chkV = Ti.UI.createButton({
		backgroundImage : '/images/check-off.png',
		width : '25dp',
		height : '25dp',
		checked : false,
		left : "4dp",
		bottom : 0
	});
	this.chkV.addEventListener('singletap', toggle);
	this.chkContainer.add(this.chkV);
	
	this.chkS = Ti.UI.createButton({
		backgroundImage : '/images/check-off.png',
		width : '25dp',
		height : '25dp',
		checked : false,
		left : "4dp",
		bottom : 0
	});
	this.chkS.addEventListener('singletap', toggle);
	this.chkContainer.add(this.chkS);
	
	this.chkD = Ti.UI.createButton({
		backgroundImage : '/images/check-off.png',
		width : '25dp',
		height : '25dp',
		checked : false,
		left : "4dp",
		bottom : 0
	});
	this.chkD.addEventListener('singletap', toggle);
	this.chkContainer.add(this.chkD);
	
	this.chkAll = Ti.UI.createButton({
		backgroundImage : '/images/check-off.png',
		width : '25dp',
		height : '25dp',
		checked : false,
		left : "33dp",
		bottom : 0
	});
	this.chkAll.addEventListener('singletap', function(ea){
		var back = '/images/check-on.png';
		var checked = true;
		if (that.chkAll.checked) {
			back = '/images/check-off.png';
			checked = false;
		}
		
		that.chkL.backgroundImage = that.chkMa.backgroundImage = that.chkMe.backgroundImage = that.chkG.backgroundImage =
		that.chkV.backgroundImage = that.chkS.backgroundImage = that.chkD.backgroundImage = back;
		
		that.chkAll.backgroundImage = back;
		
		that.chkL.checked = that.chkMa.checked = that.chkMe.checked = that.chkG.checked = that.chkV.checked = that.chkS.checked = that.chkD.checked = checked;

		that.chkAll.checked = checked;
	});
	this.chkContainer.add(this.chkAll);
	
	this.scroll.add(Ti.UI.createLabel({
		top : 10,
		height : 30,
		left : 25,
		right : 0,
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,
		color : "#000",
		font : { fontSize: 20, fontWeight: "bold"},
		text : "RIPETIZIONE"
	}));
	
	this.lblCicle = Ti.UI.createLabel({
		top: 10,
		borderWidth: 2,
		borderColor: '#ccc',
		backgroundColor: '#FFF',
		color: '#777',
		font:{ fontSize: 18, fontWeight: "bold"},
		height : 30,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		left : 25,
		right : 25,
		text : "Per questa settimana"
	});
	this.lblCicle.addEventListener('singletap', function(ea){
		that.dialogRipetizione.show();
	});
	this.lblCicle.add(Ti.UI.createView({
		borderWidth: 2,
		borderColor: '#ccc',
		backgroundColor: '#ccc',
		backgroundImage: "/images/ico-down.png",
		height : 30,
		width : 30,
		right : 0
	}));
	this.scroll.add(this.lblCicle);
	
	this.scroll.add(Ti.UI.createLabel({
		top : 10,
		bottom : 5,
		height : 30,
		left : 25,
		right : 0,
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,
		color : "#000",
		font : { fontSize: 20, fontWeight: "bold"},
		text : "ORARI"
	}));
	
	this.btnAddTime = Ti.UI.createLabel({
		borderWidth: 2,
		borderColor: '#ccc',
		backgroundColor: '#FFF',
		height : 30,
		width : 30,
		bottom : 10,
		backgroundImage : "/images/ico-plus.png"
	});
	this.btnAddTime.addEventListener('singletap', function(ea){
		that.timePopup.open(that.me, that.date, function(value){
			that.addTime(value);
		});
	});
	this.scroll.add(this.btnAddTime);
	
	this.times = [];
	
	this.addTime = function(when) {
		
		var time = Ti.UI.createView({
			height : 40,
			left : 25,
			right : 25,
			bottom : 5,
			backgroundColor: 'transparent',
			when : when
		});
		
		time.add(Ti.UI.createLabel({
			borderWidth: 2,
			borderColor: '#ccc',
			backgroundColor: '#FFF',
			color: '#777',
			font: { fontSize: 20},
			height : 40,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			text : moment(when).format("[Alle ore ]HH:mm"),
			left : 0,
			right : 40
		}));
		
		var minus = Ti.UI.createLabel({
			height : 40,
			width : 40,
			right : 0,
			backgroundImage : "/images/ico-minus.png"
		});
		minus.addEventListener('singletap', function(ea){
			// remove from array e from scrollView
			that.scroll.remove(time);
			that.times.splice(that.times.indexOf(time), 1);
		});
		
		time.add(minus);
		that.times.push(time);
		that.scroll.add(time);
		//setTimeout(that.scroll.scrollToBottom, 100);
	};

	//footer
	this.footer = Ti.UI.createView({
		bottom : 0,
		height : 60,
		left : 0,
		right : 0,
		backgroundColor : "#f5866c"
	});
	this.me.add(this.footer);
	
	this.btnOk = Ti.UI.createButton({
		backgroundImage: "none",
		height : 50,
		font:{ fontSize: 24, fontWeight: "bold"},
		color : '#FFF',
		center: {x : "25%", y: "50%"},
		title : "CREA"
	});
	this.btnOk.addEventListener("singletap", function(e){
		that.close(true);
	});
	this.footer.add(this.btnOk);
	
	this.btnCancel = Ti.UI.createButton({
		backgroundImage: "none",
		height : 50,
		font:{ fontSize: 24, fontWeight: "bold"},
		color : '#FFF',
		center: {x : "75%", y: "50%"},
		title : "ANNULLA"
	});
	this.btnCancel.addEventListener("singletap", function(e){
		that.close(false);
	});
	this.footer.add(this.btnCancel);
	
	this.getSelectedDays = function(){
		var result = [];
		
		if(that.chkD.checked) result.push(0);
		if(that.chkL.checked) result.push(1);
		if(that.chkMa.checked) result.push(2);
		if(that.chkMe.checked) result.push(3);
		if(that.chkG.checked) result.push(4);
		if(that.chkV.checked) result.push(5);
		if(that.chkS.checked) result.push(6);
		
		return result;
	};
	
	this.getSelectedHours = function(){
		var result = [];
		
		_.each(that.times, function(time){
			result.push(time.when);
		});
		
		return result;
	};
	
	this.checkAndFire = function(checkbox, value){
		checkbox.checked = !value;
		checkbox.fireEvent('singletap');
	};
	
	this.open = function(parent){
		this.parent = parent;
		Ti.App.fireEvent("vls:hideHomeButton");
		
		//select all days
		this.checkAndFire(that.chkAll, false);
		
		//clear hours
		_.each(that.times, function(time){
			that.scroll.remove(time);
		});
		this.times = [];
		
		this.rimedio = 0;
		this.ripetizione= 0;
		this.lblPill.text = PillAlert.RemedyNames[that.rimedio];
		this.lblCicle.text = PillAlert.RemedyRepeats[that.ripetizione];
		
		//pre set now
		this.addTime(moment().toDate());
		
		//pre set today
		switch(moment().day()){
			case 1: //LUN
				this.checkAndFire(that.chkL, true);
				break;
			case 2: //MAR
				this.checkAndFire(that.chkMa, true);
				break;
			case 3: //MER
				this.checkAndFire(that.chkMe, true);
				break;
			case 4: //GIO
				this.checkAndFire(that.chkG, true);
				break;
			case 5: //VEN
				this.checkAndFire(that.chkV, true);
				break;
			case 6: //SAB
				this.checkAndFire(that.chkS, true);
				break;
			case 0: //DOM
				this.checkAndFire(that.chkD, true);
				break;
				
		}
		
		// show me
		if(OS_IOS){
			// show me
			that.me.opacity = 0; //hack
			parent.add(this.me);
					
			that.me.animate({ opacity : 1, duration : 250});
		} else {
			parent.add(this.me);
		}
	};
	
	this.close = function(save){
		//verify values
		
		if(save){
			// generate PillAlerts
			var result = PillAlert.createRecurrentPillAlert({
				PillId : that.rimedio,
				Info : that.txbInfo.value,
				Days : that.getSelectedDays(),
				Cycle : PillAlert.RemedyWeekValues[that.ripetizione],
				Hours : that.getSelectedHours()
			});
			
			if ( ! result ) {
				Ti.UI.createAlertDialog({
					buttonNames : ["Ok"],
					message : "I valori inseriti non sono validi!"
				}).show();
				return;
			}
		}
		
		Ti.App.fireEvent("vls:showHomeButton");
		that.me.animate({ opacity : 0, duration : 250}, function(e){
			that.parent.remove(that.me);
			if(save){
				var dialog = Ti.UI.createAlertDialog({
					cancel: 1,
				    buttonNames: ["Ok", "Crea ancora"],
				    message : "Tutti i rimedi sono stati creati correttamente"
				  });
				  dialog.addEventListener('click', function(e){
				    if (e.index === 1){
				      Ti.App.fireEvent("vls:addAnotherReminder");
				    }
				  });
				  dialog.show();
				  Ti.App.fireEvent("vls:updateCalendarView");
			}
		});
	};
}

exports.PillReminderView = PillReminderView;
