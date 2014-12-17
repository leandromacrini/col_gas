// 
//  EditDateOnlyPopup.js
//  VooDoc
//  
//  Created by Leandro Macrini on 2014-07-21.
//  Copyright 2014 Leandro Macrini. All rights reserved.
// 

var moment = require('lib/moment');
moment.lang('it');

function EditDateOnlyPopup(){
	var that = this;
	
	var UserData = require("/Model/UserData");
	
	this.me = Ti.UI.createView({
		top : '100%',
		height: '100%',
		left : 0,
		right : 0,
		zIndex : 130,
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
		this.container.backgroundColor = '#CCC';
	}

	this.pickerTime = Ti.UI.createPicker({
		type : Ti.UI.PICKER_TYPE_DATE,
		color : "#000",
		width : "100%",
		format24 : true
	});
	
	this.container.add(this.pickerTime);
	
	//footer
	this.footer = Ti.UI.createView({
		bottom : 0,
		height : 70,
		left : 0,
		right : 0,
		opacity : 0.75,
		backgroundColor : "#ccc"
	});
	this.me.add(this.footer);
	
	this.btnOk = Ti.UI.createButton({
		bottom : 10,
		left : 75,
		height : 50,
		width : 50,
		backgroundImage : "/graphics/buttons/btn-ok.png"
	});
	this.btnOk.addEventListener("singletap", function(e){
		that.close(true);
	});
	this.me.add(this.btnOk);
	
	this.btnCancel = Ti.UI.createButton({
		bottom : 10,
		right : 75,
		height : 50,
		width : 50,
		backgroundImage : "/graphics/buttons/btn-cancel.png"
	});
	this.btnCancel.addEventListener("singletap", function(e){
		that.close(false);
	});
	this.me.add(this.btnCancel);
	
	// functions
	this.open = function(parent, dateValue, callback){
		that.callback = callback;
		that.parent = parent;
		
		that.pickerTime.value = dateValue;
		
		parent.add(that.me);
		that.me.animate({ top : 0, duration : 150});
	};
	
	this.close = function(save){
		if(save){
			var value = that.pickerTime.value;

			if(that.callback) that.callback(value);
		} else {
			if(that.callback) that.callback(null);
		}
		that.me.animate({ top : "100%", duration : 150}, function(e){
			that.parent.remove(that.me);
		});
	};}

exports.EditDateOnlyPopup = EditDateOnlyPopup;