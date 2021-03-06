// 
//  EditTimePopup.js
//  Coliche Gassose
//  
//  Created by Leandro Macrini on 2014-12-21.
//  Copyright 2014 Leandro Macrini. All rights reserved.
// 

var moment = require('lib/moment');
moment.lang('it');

function EditTimePopup(){
	var that = this;
	
	this.me = Ti.UI.createView({
		top : 0,
		bottom : 0,
		left : 0,
		right : 0,
		backgroundColor : "#FFF"
	});
	
	this.container = Ti.UI.createView({
		top : 0,
		bottom : 70,
		left : 0,
		right : 0
	});
	this.me.add(this.container);
	
	//update visualization hack
	if(Ti.Platform.name === 'android') {
		this.container.backgroundColor = '#ccc';
	}

	this.pickerTime = Ti.UI.createPicker({
		type : Ti.UI.PICKER_TYPE_TIME,
		value : moment().toDate(),
		color : "#000",
		width : "100%",
		format24 : true
	});
	
	this.container.add(this.pickerTime);
		
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
		width : 100,
		font:{ fontSize: 24, fontWeight: "bold"},
		color : '#FFF',
		center: {x : "25%", y: "50%"},
		title 	: "OK"
	});
	this.btnOk.addEventListener("singletap", function(e){
		that.close(true);
	});
	this.footer.add(this.btnOk);
	
	this.btnClose = Ti.UI.createButton({
		backgroundImage: "none",
		height : 50,
		width : 150,
		font:{ fontSize: 24, fontWeight: "bold"},
		color : '#FFF',
		center: {x : "75%", y: "50%"},
		title 	: "ANNULLA"
	});
	this.btnClose.addEventListener("singletap", function(e){
		that.close(false);
	});
	this.footer.add(this.btnClose);
	
	// functions
	this.open = function(parent, dateValue, callback){
		that.callback = callback;
		
		that.parent = parent;
		
		if(dateValue) that.pickerTime.value = dateValue;
		
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
			var value = that.pickerTime.value;

			if(that.callback) that.callback(value);
		}
		
		if(OS_IOS){
			that.me.animate({ opacity : 0, duration : 150}, function(e){
				that.parent.remove(that.me);
			});
		} else {
			that.parent.remove(that.me);
		}
	};}

exports.EditTimePopup = EditTimePopup;