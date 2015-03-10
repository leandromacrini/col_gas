// 
//  AgreementView.js
//  Coliche Gassose
//  
//  Created by Leandro Macrini on 2015-03-05.
//  Copyright 2015 Leandro Macrini. All rights reserved.
//

var agreement = require("/legals/agreement").agreement;
function AgreementView(){
	var that = this;
	
	// components
	this.me = Ti.UI.createView({
		backgroundColor : "#FFF"
	});
	
	this.scroll = Ti.UI.createScrollView({
		top: 20,
		left: 10,
		right: 10,
		bottom : 60,
		layout : 'vertical',
		showVerticalScrollIndicator : true
	});
	this.me.add(this.scroll);
	
	for(var i = 0; i < agreement.length; i++){
		switch(agreement[i].type){
			case "title":
					this.scroll.add(Ti.UI.createLabel({
						text: agreement[i].text,
						textAlign : 'center',
						font:{ fontSize: 16, fontWeight: "bold"},
						color : '#000',
						bottom: 5
					}));
				break;
			case "content":
					this.scroll.add(Ti.UI.createLabel({
						text: agreement[i].text,
						textAlign : 'center',
						font:{ fontSize: 12, fontWeight: "normal"},
						color : '#000',
						bottom: 10
					}));
				break;
		}
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
		backgroundImage: "none",
		height : 50,
		font:{ fontSize: 24, fontWeight: "bold"},
		color : '#FFF',
		center: {x : "50%", y: "50%"},
		title : "ACCETTO"
	});
	this.btnOk.addEventListener("singletap", function(e){
		that.close();
	});
	this.footer.add(this.btnOk);
	
	this.open = function(parent){
		that.parent = parent;
		
		if(OS_IOS){
			// show me
			that.me.opacity = 0; //hack
			parent.add(this.me);
					
			that.me.animate({ opacity : 1, duration : 250});
		} else {
			parent.add(this.me);
		}
	};
	
	this.close = function(){
		//accept and register to server
		Ti.App.Properties.setBool("first_app_start", false);
		Alloy.Controllers.AsyncConnectionController.createUserData();
		Alloy.Controllers.PushNotificationController.registerForPushNotification();
		
		//verify values
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

exports.AgreementView = AgreementView;
