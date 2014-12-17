// 
//  BaseObserver.js
//  Coliche Gassose
//  
//  Created by Leandro Macrini on 2014-12-08.
//  Copyright 2014 Leandro Macrini. All rights reserved.
// 

exports.extend = function(child) {
	child.listeners = {};

	child.lastEvent = "";
	
	/**
	 * return the number of listeners subcrived to the "eventName" event
	 * @param {String} eventName
	 */
	child.getListenersCount = function(eventName){
		if(child.listeners[eventName])
			return child.listeners[eventName].lenght;
		else
			return 0;
	};

	/**
	 * Subscive a callback to eventName event
	 * @param {String} eventName
	 * @param {function(data)} callback
	 */
	child.addEventListener = function(eventName, callback) {
		child.listeners[eventName] = child.listeners[eventName] || [];
		child.listeners[eventName].push(callback);
	};

	/**
	 * Fire eventName event's listeners
	 * @param {String} eventName
	 * @param {Object} data
	 */
	child.fireEvent = function(eventName, data) {
		if (child.listeners[eventName] && child.listeners[eventName].blocked)
			return;

		var eventListeners = child.listeners[eventName] || [];
		for (var i = 0; i < eventListeners.length; i++) {
			if (eventListeners[i].call) {
				eventListeners[i].call(child, data);

			}
		}
	};

	child.removeEventListener = function(eventName, callback) {
		var eventListeners = child.listeners[eventName] || [];
		for (var i = 0; i < eventListeners.length; i++) {
			if (eventListeners[i] === callback) {
				eventListeners.splice(i, 1);
				return;
			}
		}
	};

	child.removeEvent = function(eventName) {
		child.listeners[eventName] = [];
	};
	child.disableEvent = function(eventName) {
		child.listeners[eventName].blocked = true;
	};
	child.enableEvent = function(eventName) {
		child.listeners[eventName].blocked = false;
	};
}; 