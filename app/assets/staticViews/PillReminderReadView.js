// 
//  PillReminderView.js
//  Coliche Gassose
//  
//  Created by Leandro Macrini on 2014-12-21.
//  Copyright 2014 Leandro Macrini. All rights reserved.
// 

var moment = require('lib/moment');
moment.lang('it');
var dialogs = require('alloy/dialogs');
function PillReminderReadView(){
	var that = this;
	
	var PillAlert = require('/models/PillAlert');
	
	// components
	this.me = Ti.UI.createView({
		backgroundColor : "#FFF"
	});
	
	this.scroll = Ti.UI.createScrollView({
		top: 0,
		bottom : 70,
		layout : 'vertical'
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
		right : 25
	});
	
	this.scroll.add(this.lblPill);
	
	this.scroll.add(Ti.UI.createLabel({
		top : 10,
		height : 30,
		left : 25,
		right : 25,
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,
		color : "#000",
		font:{ fontSize: 20, fontWeight: "bold"},
		text : "ORARIO"
	}));
	
	this.lblTime = Ti.UI.createLabel({
		top: 10,
		borderWidth: 2,
		borderColor: '#ccc',
		backgroundColor: '#FFF',
		color: '#777',
		font:{ fontSize: 18, fontWeight: "bold"},
		height : 30,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		left : 25,
		right : 25
	});
	
	this.scroll.add(this.lblTime);
	
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
		text : "INFORMAZIONI"
	}));
	
	this.lblInfo = Ti.UI.createLabel({
		borderWidth: 2,
		borderColor: '#ccc',
		backgroundColor: '#fff',
		color: '#777',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font:{ fontSize: 18, fontWeight: "bold"},
		height : 80,
		left : 25,
		right : 25
	});
	this.scroll.add(this.lblInfo);

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
		title : "CHIUDI"
	});
	this.btnOk.addEventListener("singletap", function(e){
		that.close(false);
	});
	this.footer.add(this.btnOk);
	
	this.btnCancel = Ti.UI.createButton({
		backgroundImage: "none",
		height : 50,
		font:{ fontSize: 24, fontWeight: "bold"},
		color : '#FFF',
		center: {x : "75%", y: "50%"},
		title : "ELIMINA"
	});
	this.btnCancel.addEventListener("singletap", function(e){
		dialogs.confirm({
				title: "Conferma richiesta",
				message: "Rimuovendo il reminder tutti gli eventuali reminder della serie saranno eliminati. Continuare?",
				yes: "Si",
				no: "No",
				callback : function(){
					that.close(true);
				}
			});

	});
	this.footer.add(this.btnCancel);
	
	this.open = function(parent, pillAlert){
		that.parent = parent;
		that.pillAlert = PillAlert.read(pillAlert.ID);
		
		Ti.API.info('Open pillAlert: ' + JSON.stringify(pillAlert));
		Ti.App.fireEvent("vls:hideHomeButton");
		
		that.lblPill.text = PillAlert.RemedyNames[pillAlert.PillID];
		that.lblTime.text = moment(pillAlert.When).format("[Alle ore ]HH:mm");
		that.lblInfo.text = pillAlert.Info;
		
		if(OS_IOS){
			// show me
			that.me.opacity = 0; //hack
			parent.add(this.me);
					
			that.me.animate({ opacity : 1, duration : 250});
		} else {
			parent.add(this.me);
		}
	};
	
	this.close = function(todelete){
		//verify values
		
		if(todelete){
			that.pillAlert.deleteSeries();
			that.pillAlert = null;
				
			Ti.App.fireEvent("vls:updateCalendarView");
		}
		
		Ti.App.fireEvent("vls:showHomeButton");
		
		if(OS_IOS){
			that.me.animate({ opacity : 0, duration : 250}, function(e){
				that.parent.remove(that.me);
			});
		} else {
			that.parent.remove(that.me);
		}
	};
}

exports.PillReminderReadView = PillReminderReadView;
