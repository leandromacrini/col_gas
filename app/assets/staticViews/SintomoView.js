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

function SintomoView() {
	var that = this;
	
	var Symptom = require('/models/Symptom');
	var EditDatePopup = require("/staticViews/EditDatePopup").EditDatePopup;
	
	this.editDate = new EditDatePopup();
	
	this.edited = false;
	this.setEdited = function(){
		that.edited = true;
		if(that.symptom){
			that.btnOk.title = "SALVA";
		}
	};
	
	this.pianto;
	this.rigurgito;
	this.agitazione;
	this.date;
	this.duration;
	this.intensity;
	
	this.optsDurata = {
		options: Symptom.SymptomDurations,
		selectedIndex: 0,
		title: 'DURATA?'
	};
	this.dialogDurata = Ti.UI.createOptionDialog(that.optsDurata);
	this.dialogDurata.addEventListener('click', function(ea){
		that.duration = ea.index;
		that.lblDuration.text = Symptom.SymptomDurations[that.duration];

	});
	
	this.setIntensity = function(value){
		this.intensity = value;
		
		this.btnIntensity1.opacity = value > 0 ? 1 : 0.2;
		this.btnIntensity2.opacity = value > 1 ? 1 : 0.2;
		this.btnIntensity3.opacity = value > 2 ? 1 : 0.2;
		this.btnIntensity4.opacity = value > 3 ? 1 : 0.2;
		this.btnIntensity5.opacity = value > 4 ? 1 : 0.2;
	};

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
		backgroundColor : "#F00",
		font:{ fontSize: 34, fontWeight: "bold"},
		text : "SINTOMO"
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
		that.editDate.open(that.me, that.date, function(value){
			that.setEdited();
			that.date = value;
			that.lblDate.text = moment(value).format("DD/MM/YYYY[ alle ore ]HH:mm");
		});
	});
	
	this.contanier.add(this.lblDate);
	
	this.contanier.add(Ti.UI.createView({
		top: 100,
		borderWidth: 2,
		borderColor: '#ccc',
		backgroundColor: '#ccc',
		backgroundImage: "/images/ico-date.png",
		height : 30,
		width : 30,
		right : 25
	}));
	
	this.contanier.add(Ti.UI.createLabel({
		top : 140,
		height : 30,
		left : 25,
		right : 0,
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,
		color : "#000",
		font:{ fontSize: 20, fontWeight: "bold"},
		text : "PIANTO"
	}));
	this.chkPianto = Ti.UI.createSwitch({
		top: 140,
		right : 25
	});
	this.chkPianto.addEventListener('change', function(ea){
		that.setEdited();
		that.pianto = ea.value;
	});
	this.contanier.add(this.chkPianto);
	
	this.contanier.add(Ti.UI.createLabel({
		top : 180,
		height : 30,
		left : 25,
		right : 0,
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,
		color : "#000",
		font:{ fontSize: 20, fontWeight: "bold"},
		text : "RIGURGITO"
	}));
	this.chkRigurgito = Ti.UI.createSwitch({
		top: 180,
		right : 25
	});
	this.chkRigurgito.addEventListener('change', function(ea){
		that.setEdited();
		that.rigurgito = ea.value;
	});
	this.contanier.add(this.chkRigurgito);
	
	this.contanier.add(Ti.UI.createLabel({
		top : 220,
		height : 30,
		left : 25,
		right : 0,
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,
		color : "#000",
		font:{ fontSize: 20, fontWeight: "bold"},
		text : "AGITAZIONE"
	}));
	this.chkAgitazione = Ti.UI.createSwitch({
		top: 220,
		right : 25
	});
	this.chkAgitazione.addEventListener('change', function(ea){
		that.setEdited();
		that.agitazione = ea.value;
	});
	this.contanier.add(this.chkAgitazione);
	
	this.contanier.add(Ti.UI.createLabel({
		top : 260,
		height : 30,
		left : 25,
		right : 0,
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,
		color : "#000",
		font:{ fontSize: 20, fontWeight: "bold"},
		text : "DURATA"
	}));
	
	this.lblDuration = Ti.UI.createLabel({
		top: 300,
		borderWidth: 2,
		borderColor: '#ccc',
		backgroundColor: '#FFF',
		color: '#777',
		font:{ fontSize: 18, fontWeight: "bold"},
		height : 30,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		text : Symptom.SymptomDurations[this.duration],
		left : 25,
		right : 53
	});
	this.lblDuration.addEventListener('singletap', function(ea){
		that.setEdited();
		that.dialogDurata.show();
	});
	this.contanier.add(this.lblDuration);
	
	this.contanier.add(Ti.UI.createView({
		top: 300,
		borderWidth: 2,
		borderColor: '#ccc',
		backgroundColor: '#ccc',
		backgroundImage: "/images/ico-down.png",
		height : 30,
		width : 30,
		right : 25
		
	}));
	
	this.contanier.add(Ti.UI.createLabel({
		top : 350,
		height : 30,
		left : 25,
		right : 0,
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,
		color : "#000",
		font:{ fontSize: 20, fontWeight: "bold"},
		text : "INTENSITA'"
	}));
	
	this.btnIntensity1 = Ti.UI.createView({
		top: 380,
		backgroundImage: "/images/ico-intensity.png",
		height : 40,
		width : 40,
		center : {x : "15%", y : 0}
	});
	this.btnIntensity1.addEventListener('singletap', function(){
		that.setEdited();
		that.setIntensity(1);
	});
	
	this.btnIntensity2 = Ti.UI.createView({
		top: 380,
		backgroundImage: "/images/ico-intensity.png",
		height : 40,
		width : 40,
		center : {x : "32,5%", y : 0}
	});
	this.btnIntensity2.addEventListener('singletap', function(){
		that.setEdited();
		that.setIntensity(2);
	});
	
	this.btnIntensity3 = Ti.UI.createView({
		top: 380,
		backgroundImage: "/images/ico-intensity.png",
		height : 40,
		width : 40,
		center : {x : "50%", y : 0}
	});
	this.btnIntensity3.addEventListener('singletap', function(){
		that.setEdited();
		that.setIntensity(3);
	});
	
	this.btnIntensity4 = Ti.UI.createView({
		top: 380,
		backgroundImage: "/images/ico-intensity.png",
		height : 40,
		width : 40,
		center : {x : "67,5%", y : 0}
	});
	this.btnIntensity4.addEventListener('singletap', function(){
		that.setEdited();
		that.setIntensity(4);
	});
	
	this.btnIntensity5 = Ti.UI.createView({
		top: 380,
		backgroundImage: "/images/ico-intensity.png",
		height : 40,
		width : 40,
		center : {x : "85%", y : 0}
	});
	this.btnIntensity5.addEventListener('singletap', function(){
		that.setEdited();
		that.setIntensity(5);
	});
	
	if(OS_ANDROID){
		this.btnIntensity1.center = {x : "14%", y : 0};
		this.btnIntensity2.center = {x : "32%", y : 0};
		this.btnIntensity3.center = {x : "50%", y : 0};
		this.btnIntensity4.center = {x : "68%", y : 0};
		this.btnIntensity5.center = {x : "86%", y : 0};
	}
	
	this.contanier.add(this.btnIntensity1);
	this.contanier.add(this.btnIntensity2);
	this.contanier.add(this.btnIntensity3);
	this.contanier.add(this.btnIntensity4);
	this.contanier.add(this.btnIntensity5);
	
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
		if(that.symptom){
			dialogs.confirm({
				title: "Conferma richiesta",
				message: "Questa operazione non può essere annullata. Eliminare il sintomo?",
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
	this.open = function(parent, symptom){
		
		Ti.App.fireEvent("vls:hideHomeButton");
		
		this.parent = parent;
		this.edited = false;
		
		//new or detail?
		if(symptom){
			Ti.API.info('Open symptom: ' + JSON.stringify(symptom));
			//buttons
			this.btnOk.title = "CHIUDI";
			this.btnDelete.title = "ELIMINA";
			
			//detail
			this.symptom = Symptom.read(symptom.ID);
			
			this.pianto = symptom.Pianto;
			this.rigurgito = symptom.Rigurgito;
			this.agitazione = symptom.Agitazione;
			this.date = moment(symptom.When, "DDMMYYYY HH:mm").toDate(),
			this.duration = symptom.Duration;
			this.setIntensity(symptom.Intensity);
		} else {
			
			//new always is edited
			this.edited = true;
			
			Ti.API.info('Open new symptom');
			//buttons
			this.btnOk.title = "CREA";
			this.btnDelete.title = "ANNULLA";
			
			//new
			this.symptom = null;
			
			//default value
			this.pianto = false;
			this.rigurgito = false;
			this.agitazione = false;
			this.date = moment().toDate();
			this.duration = 0;
			this.setIntensity(1);
		}
		
		//uodate values
		this.chkPianto.value = !!this.pianto;
		this.chkRigurgito.value = !!this.rigurgito;
		this.chkAgitazione.value = !!this.agitazione;
		this.lblDate.text = moment(this.date).format("DD/MM/YYYY[ alle ore ]HH:mm");
		this.lblDuration.text = Symptom.SymptomDurations[this.duration];
		
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
		if(save){
			//new or detail?
			if(that.symptom) {
				if(that.edited){
					//save detail
					this.symptom.Pianto = this.pianto;
					this.symptom.Rigurgito = this.rigurgito;
					this.symptom.Agitazione = this.agitazione;
					this.symptom.When =  moment(this.date).format("DDMMYYYY HH:mm");
					this.symptom.Duration = this.duration;
					this.symptom.Intensity = this.intensity;
					Ti.API.info('Save symptom: ' + JSON.stringify(this.symptom));
					this.symptom.save();
					Ti.App.fireEvent("vls:updateCalendarView");
				}
			} else {
				//create
				var simpt = new Symptom.Symptom(this.pianto, this.rigurgito, this.agitazione, this.intensity,  this.date , this.duration);
				simpt.save();
				Ti.API.info('Create symptom: ' + JSON.stringify(simpt));
				Ti.App.fireEvent("vls:updateCalendarView");
			}
		} else if(this.symptom) {
			//it's a delete
			Ti.API.info('Delete symptom: ' + JSON.stringify(this.symptom));
			this.symptom.delete();
			Ti.App.fireEvent("vls:updateCalendarView");
		}
		
		Ti.App.fireEvent("vls:showHomeButton");
		
		var close = function(e){
			that.parent.remove(that.me);
			if(save){
				//save
				if(that.symptom){
					if(that.edited){
						Ti.UI.createAlertDialog({
							buttonNames : ["Ok"],
							message : "Il sintomo è stato salvato correttamente"
						}).show();
					}
				} else {
					if(that.edited){
						Ti.UI.createAlertDialog({
							buttonNames : ["Ok"],
							message : "Il sintomo è stato creato correttamente"
						}).show();
					}
				}
			} else if(that.symptom) {
				//it's a delete
				Ti.UI.createAlertDialog({
					buttonNames : ["Ok"],
					message : "Il sintomo è stato eliminato"
				}).show();
			}
		};
		if(OS_IOS){
			that.me.animate({ opacity : 0, duration : 250}, close);
		} else {
			close();
		}
		
	};
}
exports.SintomoView = SintomoView;