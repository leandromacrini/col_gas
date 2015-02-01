// 
//  SintomoView.js
//  Coliche Gassose
//  
//  Created by Leandro Macrini on 2014-12-13.
//  Copyright 2014 Leandro Macrini. All rights reserved.
// 

var moment = require('lib/moment');
moment.lang('it');
var dialogs = require('alloy/dialogs');

function AppuntamentoView() {
	var that = this;
	
	var Appointment = require('/models/Appointment');
	var EditDatePopup = require("/staticViews/EditDatePopup").EditDatePopup;
	
	this.editDate = new EditDatePopup();
	
	this.edited = false;
	this.setEdited = function(){
		that.edited = true;
		if(that.appointment){
			that.btnOk.title = "SALVA";
		}
	};
	
	this.date;
	this.note;
	
	this.me = Ti.UI.createView({
		backgroundColor : "#FFF"
	});
		
	this.contanier = Ti.UI.createScrollView({
		top: 0,
		bottom : 70
	});
	this.me.add(this.contanier);
	
	//components
	this.contanier.add(Ti.UI.createLabel({
		top : 0,
		height : 50,
		left : 0,
		right : 0,
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
		color : "#FFF",
		backgroundColor : "#6DB799",
		font:{ fontSize: 34, fontWeight: "bold"},
		text : "VISITA MEDICA"
	}));
	
	this.contanier.add(Ti.UI.createLabel({
		top : 60,
		height : 30,
		left : 25,
		right : 25,
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,
		color : "#000",
		font:{ fontSize: 20, fontWeight: "bold"},
		text : "DATA E ORA"
	}));
	
	this.lblDate = Ti.UI.createLabel({
		top: 100,
		borderWidth: 2,
		borderColor: '#ccc',
		backgroundColor: '#FFF',
		color: '#777',
		font:{ fontSize: 18, fontWeight: "bold"},
		height : 30,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		left : 25,
		right : 53
	});
	this.lblDate.addEventListener('singletap', function(ea){
		that.setEdited();
		that.editDate.open(that.me, that.date, function(value){
			that.date = value;
			that.lblDate.text = moment(value).format("DD/MM/YYYY[ alle ore ]HH:mm");
		});
	});
	
	this.contanier.add(this.lblDate);
	
	var ico1 = Ti.UI.createView({
		top: 100,
		borderWidth: 2,
		borderColor: '#ccc',
		backgroundColor: '#ccc',
		backgroundImage: "/images/ico-date.png",
		height : 30,
		width : 30,
		right : 25
	});
	ico1.addEventListener('singletap', function(ea){
		that.setEdited();
		that.editDate.open(that.me, that.date, function(value){
			that.date = value;
			that.lblDate.text = moment(value).format("DD/MM/YYYY[ alle ore ]HH:mm");
		});
	});
	
	this.contanier.add(ico1);
	
	this.contanier.add(Ti.UI.createLabel({
		top : 140,
		height : 30,
		left : 25,
		right : 0,
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,
		color : "#000",
		font:{ fontSize: 20, fontWeight: "bold"},
		text : "DETTAGLI E NOTE"
	}));
	this.txfNote = Ti.UI.createTextArea({
		borderWidth: 2,
		borderColor: '#ccc',
		backgroundColor: '#FFF',
		color: '#777',
		font: { fontSize: 20, fontWeight: "bold"},
		returnKeyType: Ti.UI.RETURNKEY_GO,
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		hintText : "Note per l'appuntamento",
		top: 170,
		height : 160,
		left : 25,
		right : 25
	});
	this.txfNote.addEventListener("change", function(){
		Ti.API.info('Info text changed');
		that.setEdited();
	});
	this.contanier.add(this.txfNote);
	
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
	
	this.btnDelete = Ti.UI.createButton({
		backgroundImage: "none",
		height : 50,
		font:{ fontSize: 24, fontWeight: "bold"},
		color : '#FFF',
		center: {x : "75%", y: "50%"},
		title : "ANNULLA"
	});
	this.btnDelete.addEventListener("singletap", function(e){
		if(that.appointment){
			dialogs.confirm({
				title: "Conferma richiesta",
				message: "Questa operazione non può essere annullata. Eliminare l'appuntamento?",
				yes: "Si",
				no: "No",
				callback : function(){
					that.close(false);
				}
			});
		} else {
			that.close(false);
		}
	});
	this.footer.add(this.btnDelete);
	
	// functions
	this.open = function(parent, appointment){
		
		Ti.App.fireEvent("vls:hideHomeButton");
		
		this.parent = parent;
		this.edited = false;
		
		//new or detail?
		if(appointment){
			Ti.API.info('Open appointment: ' + JSON.stringify(appointment));
			//buttons
			this.btnOk.title = "CHIUDI";
			this.btnDelete.title = "ELIMINA";
			
			//detail
			this.appointment = Appointment.read(appointment.ID);
			
			this.note = appointment.Info;
			this.date = moment(appointment.When, "DDMMYYYY HH:mm").toDate();
		} else {
			Ti.API.info('Open new appointment');
			
			//new always is edited
			this.edited = true;
			
			//buttons
			this.btnOk.title = "CREA";
			this.btnDelete.title = "ANNULLA";
			
			//new
			this.appointment = null;
			
			//default value
			this.note = "";
			this.date = moment().toDate();
		}
		
		//uodate values
		this.lblDate.text = moment(this.date).format("DD/MM/YYYY[ alle ore ]HH:mm");
		this.txfNote.value = this.note;
		
		// show me
		that.me.opacity = 0; //hack
		parent.add(this.me);
				
		that.me.animate({ opacity : 1, duration : 250});
	};
	
	this.close = function(save){
		if(save){
			//new or detail?
			if(this.appointment) {
				if(this.edited){
					//save detail
					this.appointment.When = moment(this.date).format("DDMMYYYY HH:mm");
					this.appointment.Info = this.txfNote.value;
					Ti.API.info('Save appointment: ' + JSON.stringify(this.appointment));
					this.appointment.save();
					Ti.App.fireEvent("vls:updateCalendarView");
				}
			} else {
				//create
				new Appointment.Appointment(this.txfNote.value, this.date).save();
				Ti.API.info('Create appointment: ' + JSON.stringify(this.appointment));
				Ti.App.fireEvent("vls:updateCalendarView");
			}
		} else if (this.appointment) {
			//it's a delete
			Ti.API.info('Delete appointment: ' + JSON.stringify(this.appointment));
			this.appointment.delete();
			Ti.App.fireEvent("vls:updateCalendarView");
		}
		
		Ti.App.fireEvent("vls:showHomeButton");
		that.me.animate({ opacity : 0, duration : 250}, function(e){
			that.parent.remove(that.me);
			if(save){
				//save
				if(that.appointment){
					if(that.edited){
						Ti.UI.createAlertDialog({
							buttonNames : ["Ok"],
							message : "L'appuntamento è stato salvato correttamente"
						}).show();
					}
				} else {
					if(that.edited){
						Ti.UI.createAlertDialog({
							buttonNames : ["Ok"],
							message : "L'appuntamento è stato creato correttamente"
						}).show();
					}
				}
			} else if(that.appointment) {
				//it's a delete
				Ti.UI.createAlertDialog({
							buttonNames : ["Ok"],
					message : "L'appuntamento è stato eliminato"
				}).show();
			}
		});
	};
}

exports.AppuntamentoView = AppuntamentoView;