// 
//  DayListView.js
//  Coliche Gassose
//  
//  Created by Leandro Macrini on 2014-12-17.
//  Copyright 2014 Leandro Macrini. All rights reserved.
// 

var moment = require('lib/moment');
moment.lang('it');

function DayListView() {
	var that = this;
	
	var Appointment = require('/models/Appointment');
	var Pill = require('/models/Pill');
	var PillAlert  = require('/models/PillAlert'); 
	var Symptom = require('/models/Symptom');
	var UserData = require('/models/UserData');
	
	this.me = Ti.UI.createView({
		backgroundColor : "#FFF"
	});
	
	//components
	this.title = Ti.UI.createLabel({
		top : 0,
		height : 50,
		left : 0,
		right : 0,
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
		color : "#FFF",
		backgroundColor : "#FFE231",
		font:{ fontSize: 34, fontWeight: "bold"},
		text : "30 SETTEMBRE"
	});
	this.me.add(this.title);
		
	this.container = Ti.UI.createTableView({
		top: 60,
		bottom : 70,
		backgroundColor : "transparent",
		separatorColor : "#ccc",
		rowHeight : 80,
		separatorInsets: { left:10, right:10 }
	});
	
	this.container.addEventListener("click", function(ea){
		Ti.API.info('Row clicked: ' + JSON.stringify(ea.row));
		if(ea.row){
			if(ea.row.type === "symptom"){
				that.close(function(){
					Ti.App.fireEvent("vls:openSymptomDetail", { item : ea.row.item});
				});
			}
			if(ea.row.type === "appointment"){
				that.close(function(){
					Ti.App.fireEvent("vls:openAppointmentDetail", { item : ea.row.item});
				});
			}
			if(ea.row.type === "alert"){
				that.close(function(){
					Ti.App.fireEvent("vls:openAlertDetail", { item : ea.row.item});
				});
			}
			
			that.close();
		}
	});
	this.me.add(this.container);
	
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
		center: {x : "50%", y: "50%"},
		title : "CHIUDI"
	});
	this.btnOk.addEventListener("singletap", function(e){
		that.close();
	});
	this.footer.add(this.btnOk);
		
	// functions
	function createRow(title, subtitle, item, type){
		
		//case "alert"
		var backgroundColor = "#F0E6F5";
		var color = "#662382";
		var icon = "/images/ico-rimedi.png";
		
		switch(type){
			case "symptom" :
				backgroundColor = "#FFF3F4";
				color = "#E30513";
				icon = "/images/ico-intensity.png";
				break;
				
			case "appointment" :
				backgroundColor = "#e9f4ef";
				color = "#6DB799";
				icon = "/images/ico-visite.png";
				break;
		}
		
		var row = Ti.UI.createTableViewRow({
			item : item,
			type : type,
			height : 80
		});
		row.add(Ti.UI.createView({
			height : 70,
			backgroundColor : backgroundColor,
			borderRadius : 5
		}));
		row.add(Ti.UI.createLabel({
			text: title,
			color : color,
			wordWrap : false,
			font : { fontSize: 24, fontWeight: "bold"},
			top : 10,
			height : 40,
			left : 50,
			right : 10
		}));
		row.add(Ti.UI.createLabel({
			text: subtitle,
			color : "#777",
			wordWrap : false,
			font : { fontSize: 18, fontWeight: "bold"},
			bottom : 10,
			height : 28,
			left : 50,
			right : 10
		}));
		row.add(Ti.UI.createView({
			backgroundImage : icon,
			left : 0,
			width : 40,
			height : 40
		}));
		
		return row;
	}
	
	this.update = function(items) {
		var data = [];
		
		for(var i=0; items.alerts && i<items.alerts.length;i++){
			//var pill = Pill.read(items.alerts[i].PillID);
			data.push(createRow(
				PillAlert.RemedyNames[items.alerts[i].PillID],
				"Rimedio per le " + moment(items.alerts[i].When,"DDMMYYYY HH:mm").format("HH:mm"),
				items.alerts[i],
				"alert")
			);
		}
		
		for(var i=0; items.symptoms && i<items.symptoms.length;i++){
			data.push(createRow(
				"Episodio",
				Symptom.SymptomIntensity[items.symptoms[i].Intensity-1] + " alle " + moment(items.symptoms[i].When,"DDMMYYYY HH:mm").format("HH:mm"),
				items.symptoms[i],
				"symptom")
			);
		}
		
		for(var i=0; items.appointments && i<items.appointments.length;i++){
			var userData = UserData.load();
			data.push(createRow(
				"Vista medica",
				"Appuntamento ore " + moment(items.appointments[i].When,"DDMMYYYY HH:mm").format("HH:mm"),
				items.appointments[i],
				"appointment")
			);
		}
		
		that.container.data = data;
	};
	
	this.open = function(parent, data){
		
		Ti.App.fireEvent("vls:hideHomeButton");
		this.parent = parent;
		that.update(data);
		
		that.title.text = moment(data.date).format("DD MMMM YYYY");
		
		if(OS_IOS){
			// show me
			that.me.opacity = 0; //hack
			parent.add(this.me);
					
			that.me.animate({ opacity : 1, duration : 250});
		} else {
			parent.add(this.me);
		}
	};
	
	this.close = function(callback){
		Ti.App.fireEvent("vls:showHomeButton");
		if(OS_IOS){
			that.me.animate({ opacity : 0, duration : 250}, function(e){
				that.parent.remove(that.me);
				if(callback) callback();
			});
		} else {
			that.parent.remove(that.me);
			if(callback) callback();
		}
	};
}

exports.DayListView = DayListView;