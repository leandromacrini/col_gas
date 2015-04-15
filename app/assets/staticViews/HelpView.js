// 
//  HelpView.js
//  Coliche Gassose
//  
//  Created by Leandro Macrini on 2015-03-05.
//  Copyright 2015 Leandro Macrini. All rights reserved.
//
function HelpView(){
	var that = this;
	
	// components
	this.me = Ti.UI.createView({
		backgroundColor : "#f5866c"
	});
	
	this.scroll = Ti.UI.createScrollableView({
		top: 20,
		left: 10,
		right: 10,
		bottom : 60,
		showPagingControl : true,
		pagingControlColor : "#f5866c"
	});
	this.me.add(this.scroll);
	var views = [];
	for(var i = 1; i <= 10; i++){
		views.push(Ti.UI.createImageView({
			image: "/images/guida"+ i+".png",
			width : "100%"
		}));
	}
	this.scroll.views = views;

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
	
	this.open = function(parent, page){
		that.parent = parent;
		
		that.scroll.currentPage = page || 0;
		
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

exports.HelpView = HelpView;
