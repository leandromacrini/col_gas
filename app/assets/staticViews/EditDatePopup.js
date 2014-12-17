// 
//  EditDatePopup.js
//  Coliche Gassose
//  
//  Created by Leandro Macrini on 2014-12-13.
//  Copyright 2014 Leandro Macrini. All rights reserved.
// 

var moment = require('lib/moment');
moment.lang('it');

function EditDatePopup(){
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
	if(OS_IOS) {
		this.pickerDate = Ti.UI.createPicker({
			type : Ti.UI.PICKER_TYPE_DATE_AND_TIME,
			value : moment('today').toDate(),
			color : "#000",
			width : "100%",
			format24 : true
		});
	
		this.container.add(this.pickerDate);
	} else {
		this.container.layout = 'vertical';
		this.container.backgroundColor = '#CCC';
		
		this.pickerDate = Ti.UI.createPicker({
			type : Ti.UI.PICKER_TYPE_DATE,
			value : moment('tomorrow').toDate(),
			top : 0,
			color : "#000",
			width : "100%",
			format24 : true
		});
	
		this.container.add(this.pickerDate);

		this.pickerTime = Ti.UI.createPicker({
			type : Ti.UI.PICKER_TYPE_TIME,
			value : moment('tomorrow').toDate(),
			top : 0,
			color : "#000",
			width : "100%",
			format24 : true
		});
	
		this.container.add(this.pickerTime);
	}
		
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
		height : 50,
		width : 100,
		font:{ fontSize: 24, fontWeight: "bold"},
		color : '#FFF',
		title : "OK"
	});
	this.btnOk.addEventListener("singletap", function(e){
		that.close(true);
	});
	this.footer.add(this.btnOk);
	
	// functions
	this.open = function(parent, dateValue, callback){
		that.callback = callback;
		
		that.parent = parent;
		
		that.pickerDate.value = dateValue;
		
		if(OS_ANDROID) that.pickerTime.value = dateValue;
		
		parent.add(that.me);
		that.me.animate({ opacity : 1, duration : 150});
	};
	
	this.close = function(save){
		if(save){
			var value;
			if(Ti.Platform.name !== 'android')
				value = that.pickerDate.value;
			else {
				//on android we have 2 pickers
				value = moment({
					year : moment(that.pickerDate.value).year(),
					month : moment(that.pickerDate.value).month(),
					day : moment(that.pickerDate.value).date(),
					hour : moment(that.pickerTime.value).hour(),
					minute : moment(that.pickerTime.value).minute()
				}).toDate();
			}
			if(that.callback) that.callback(value);
		}
		that.me.animate({ opacity : 0, duration : 150}, function(e){
			that.parent.remove(that.me);
		});
	};}

exports.EditDatePopup = EditDatePopup;