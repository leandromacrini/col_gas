/**
 * @Author: Leandro Macrini
 * @Date: 01/10/2012
 * @Description: Log Controller
 */

var BaseObserver = require('/Model/BaseObserver');

//DON'T USE "this" in a Singleton Context!

var LogController = (function(){
	/*Common Singleton Elements*/
	var active = false;
	var name = "LogController";
	var events = new Object();
	var DEMO_MODE = false;
	
	BaseObserver.extend(events);
	
	function init() {
		
	}
	
	function verify(){
		if(!active) throw String.format("%s is not active!", name);
	};
	
	function activate(demoMode) {
		DEMO_MODE = demoMode;
		active = true;
		init();
	};
	/*End Singleton Elements*/
	
	/**
	 * @Description: Log a error 
	 * 
 	 * @param {String} message
	 */
	function error(message) {
		if(DEMO_MODE) return;
		verify();
		Ti.API.error(message);
		events.fireEvent("errorLogged");
	};

	/**
	 * @Description: Log a info 
	 * 
 	 * @param {String} message
	 */
	function info(message) {
		if(DEMO_MODE) return;
		verify();
		Ti.API.info(message);
		events.fireEvent("infoLogged");
	};
	
	/**
	 * @Description: Log a warning 
	 * 
 	 * @param {String} message
	 */
	function warning(message) {
		if(DEMO_MODE) return;
		verify();
		Ti.API.warn(message);
		events.fireEvent("warningLogged");
	};

	/**
	 * @Description: Log a debug message 
	 * 
 	 * @param {String} message
	 */
	function debug(message) {
		if(DEMO_MODE) return;
		verify();
		Ti.API.debug(message);
		events.fireEvent("debugLogged");
	};

	return {
		events:events,
		error:error,
		info:info,
		warning:warning,
		verify:verify,
		activate:activate,
		debug:debug,
	};
})();

module.exports = LogController;