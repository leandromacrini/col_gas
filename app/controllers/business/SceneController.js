// 
//  SceneController.js
//  VooDoc
//  
//  Created by Leandro Macrini on 2014-04-16.
//  Copyright 2014 Leandro Macrini. All rights reserved.
// 


var platino = require('co.lanica.platino');

var BaseObserver = require('/Model/BaseObserver');

var LogController = require('/Controller/LogController');

//DON'T USE "this" in a Singleton Context!

var SceneController = (function() {
	/*Common Singleton Elements*/
	var active = false;
	var name = "SceneController";
	var events = new Object();
	var DEMO_MODE = false;

	BaseObserver.extend(events);

	function init() {

	}

	function verify() {
		if (!active)
			throw String.format("%s is not active!", name);
	};

	function activate(demoMode) {
		DEMO_MODE = demoMode;
		active = true;
		init();
	};
	/*End Singleton Elements*/

	/**
	 * Create a Button from a sprite
	 * @param { r,g,b,w,h,x,y icon } param
	 */
	function createSceneButton(param) {
		var button = platino.createSprite({
			width : param.w,
			height : param.h,
			x : param.x,
			y : param.y,
			r : param.r,
			g : param.g,
			b : param.b
		});

		button.color(button.r, button.g, button.b);

		button.icon = platino.createSprite({
			width : param.w,
			height : param.h,
			image : param.icon
		});

		button.addChildNode(button.icon);

		button.addEventListener('touchstart', function(e) {
			button.color(button.r * 1.2, button.g * 1.2, button.b * 1.2);
		});

		button.addEventListener('touchend', function(e) {
			button.color(button.r, button.g, button.b);
		});

		return button;
	};

	return {
		events : events,
		activate:activate,
		createSceneButton : createSceneButton
	};
})();

module.exports = SceneController; 