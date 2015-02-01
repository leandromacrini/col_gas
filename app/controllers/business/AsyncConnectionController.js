

// 
//  AsyncConnectionController.js
//  VooDoc
//  
//  Created by Leandro Macrini on 2014-04-02.
//  Copyright 2014 Leandro Macrini. All rights reserved.
// 

var _ = require("/lib/underscore")._;

var LogController = require('/Controller/LogController');
var BaseObserver = require("/Model/BaseObserver");

var setDeletedToSync = require("/Model/BaseModel").setDeletedToSync;
var BaseModel = require("/Model/BaseModel");
var UserData = require("/Model/UserData");
var Pill = require("/Model/Pill");
var PillAlert = require("/Model/PillAlert");
var Appointment = require("/Model/Appointment");
var Symptom = require("/Model/Symptom");

/**
 * Make and call a HTTP Request with the given parameters
 *
 * @param {Object} parameters {URI, method, payload, loadingMsg, callback, errorCallback}
 */
var AsyncConnectionController = (function(){
	/*Common Singleton Elements*/
	var active = false;
	var name = "ConnectionController";
	var events = new Object();
	var DEMO_MODE = false;
	var intervalId = null;
	
	BaseObserver.extend(events);
	
	function init() {
		//check every 30 sec
		intervalId = setInterval(function(){
			asyncDataCheck();
		},10000);
		
		//clear all not completed syncs
		BaseModel.resetSyncing();
		
		//check now
		asyncDataCheck();
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
	
	function stop() {
		if(intervalId) clearInterval(intervalId);
	}
	
	function asyncDataCheck() {
		//demo?
		if( DEMO_MODE ) return;
		
		LogController.info("Async check started");
		
		//connection?
		if( ! Ti.Network.online ) return;
	
		
		//data?
		var appointmentsDel = Appointment.getRecordsDeleted();
		var appointmentsSync = Appointment.getRecordsToSync();
		
		var symptomsDel = Symptom.getRecordsDeleted();
		var symptomsSync = Symptom.getRecordsToSync();
		
		var pillAlertsDel = PillAlert.getRecordsDeleted();
		var pillAlertsSync = PillAlert.getRecordsToSync();
		
		var pillsDel = Pill.getRecordsDeleted();
		var pillsSync = Pill.getRecordsToSync();
		
		var userData = UserData.load();
		
		if( !appointmentsDel && !appointmentsSync &&
			!symptomsDel && !symptomsSync &&
			!pillAlertsDel && !pillAlertsSync &&
			!pillsDel && !pillsSync && userData.ToSync !== 1)
			return;
			
		// mark all the record to syncing
		if(pillsSync) _.invoke(pillsSync, "setToSync", 2);
		if(pillsDel) _.each(pillsDel, function(id){ setDeletedToSync(id, 'pills',2); });
		
		if(symptomsSync) _.invoke(symptomsSync, "setToSync", 2);
		if(symptomsDel) _.each(symptomsDel, function(id){ setDeletedToSync(id, 'symptoms',2); });
		
		if(appointmentsSync) _.invoke(appointmentsSync, "setToSync", 2);
		if(appointmentsDel) _.each(appointmentsDel, function(id){ setDeletedToSync(id, 'appointments', 2); });
		
		if(pillAlertsSync) _.invoke(pillAlertsSync, "setToSync", 2);
		if(pillAlertsDel) _.each(pillAlertsDel, function(id){ setDeletedToSync(id, 'pill_alerts',2); });
		
		var pillsSyncReduced = [];
		_.each(pillsSync, function(item){
			pillsSyncReduced.push(_.pick(item, "ID","Shape","Color","Name","Info","Deletable", "TemplateId"));
		});
		
		var symptomsSyncReduced = [];
		_.each(symptomsSync, function(item){
			symptomsSyncReduced.push(_.pick(item, "ID","Type","Intensity","When"));
		});
		
		var appointmentsSyncReduced = [];
		_.each(appointmentsSync, function(item){
			appointmentsSyncReduced.push(_.pick(item, "ID","Info","When"));
		});
		
		var pillAlertsSyncReduced = [];
		_.each(pillAlertsSync, function(item){
			pillAlertsSyncReduced.push(_.pick(item, "ID","PillID","When","ParentID","Taken","Asked"));
		});
		
		var payload = {
			Token : userData.DeviceToken,
			Key : "lsdkjhfpw397r2908rsa",
			SyncData : JSON.stringify({
				UserData: userData,
				Pills : { Send : pillsSyncReduced, Delete : pillsDel },
				Symptoms : { Send : symptomsSyncReduced, Delete : symptomsDel },
				Appointments : { Send : appointmentsSyncReduced, Delete : appointmentsDel },
				PillAlerts : { Send : pillAlertsSyncReduced, Delete : pillAlertsDel }
			})
		};
		
		// clear
		var pillsSyncReduced = null;
		var symptomsSyncReduced = null;
		var appointmentsSyncReduced = null;
		var pillAlertsSyncReduced = null;
		
		LogController.info("Async sending: "+ JSON.stringify(payload));
	
		httpRequest({
			URI : generateURI("SyncronizeData"),
			method : 'POST',
			payload : payload,
			errorCallback : function(error) {
				LogController.error("asyncDataCheck: Server ERROR: " + error);
				
				// mark all the record to resync
				if(pillsSync) _.invoke(pillsSync, "setToSync", 1);
				if(pillsDel) _.each(pillsDel, function(id){ setDeletedToSync(id, 'pills',1); });
				
				if(symptomsSync) _.invoke(symptomsSync, "setToSync", 1);
				if(symptomsDel) _.each(symptomsDel, function(id){ setDeletedToSync(id, 'symptoms',1); });
				
				if(appointmentsSync) _.invoke(appointmentsSync, "setToSync", 1);
				if(appointmentsDel) _.each(appointmentsDel, function(id){ setDeletedToSync(id, 'appointments', 1); });
				
				if(pillAlertsSync) _.invoke(pillAlertsSync, "setToSync", 1);
				if(pillAlertsDel) _.each(pillAlertsDel, function(id){ setDeletedToSync(id, 'pill_alerts',1); });
			},
			callback : function(response) {
				LogController.info("asyncDataCheck: Server answer: " + JSON.stringify(response));
				
				// mark all the recors as synced
				if(pillsSync) _.invoke(pillsSync, "setToSync", 3);
				if(pillsDel) _.each(pillsDel, function(id){ setDeletedToSync(id, 'pills',3); });
				
				if(symptomsSync) _.invoke(symptomsSync, "setToSync", 3);
				if(symptomsDel) _.each(symptomsDel, function(id){ setDeletedToSync(id, 'symptoms',3); });
				
				if(appointmentsSync) _.invoke(appointmentsSync, "setToSync", 3);
				if(appointmentsDel) _.each(appointmentsDel, function(id){ setDeletedToSync(id, 'appointments',3); });
				
				if(pillAlertsSync) _.invoke(pillAlertsSync, "setToSync", 3);
				if(pillAlertsDel) _.each(pillAlertsDel, function(id){ setDeletedToSync(id, 'pill_alerts',3); });
				
				// store patient id received from server
				var userData = UserData.load();
				if(userData.PatientId !== response.PatientId){
					//registered into server for the first time, update data
					userData.PatientId = response.PatientId;
					userData.PatientPID = response.PatientPID;
					userData.save();
				} else {
					userData.setToSync(3);
				}
				
				// handle PillTemplates associated with my DoctorCode
				_.each(response.Templates, function(pillTemplate){
					// search the pill by tamplate ID
					var pill = Pill.readByTemplateId(pillTemplate.PillTemplateId);
					
					// or create a new one
					if( !pill ) pill = new Pill.Pill();
					
					// set values
					pill.Shape = pillTemplate.Shape;
					pill.Color = pillTemplate.Color;
					pill.Name = pillTemplate.Name;
					pill.Info = pillTemplate.Info;
					pill.TemplateId = pillTemplate.PillTemplateId;
					pill.Deletable = false;
					
					pill.save();
					LogController.info("Pill saved" + JSON.stringify(pill));
				});
				
				if(response.Templates && response.Templates.length > 0){
					var GameController = require('/Controller/GameController');
					GameController.openDialogPopup("Il tuo dottore ha aggiornato i farmaci");
				}
				
				LogController.info("Async check completed");
			} 
		});
		
		LogController.info("Async check started");
	};
	
	function httpRequest(parameters) {
	
		if ( ! parameters ) throw "Invalid operation!";
	
		var popup = null;
	
		//create a loadin popup if needed
		if (parameters.loadingMsg) {
			popup = Alloy.createController('LoadingPopup', {
				title : parameters.loadingMsg
			});
		}
		
		if (popup) popup.open();
		
		var client = Ti.Network.createHTTPClient({
			cache : false,
			autoRedirect : true,
			validatesSecureCertificate : false,
			onload : function(e) {
				if (popup) popup.close();
	
				if (parameters.callback) {
					//get the JSON root in response
					var content = JSON.parse(JSON.parse(this.responseText).d);
	
					if (content.Exception) {
						LogController.error("httpRequest: Connection Error - " + content.Exception);
						
						if (parameters.errorCallback) {
							parameters.errorCallback(content.Exception);
						} else {
							Ti.UI.createAlertDialog({
								buttonNames : ['OK'],
								message : content.Exception,
								title : 'Errore!'
							}).show();
						}
					} else {
						if (parameters.callback) parameters.callback(content.Response);
					}
				}
			},
			onerror : function(e) {
				if (popup) popup.close();
				
				//return KO
				LogController.error("httpRequest: Connection Error - " + e.error);
	
				if (parameters.errorCallback) {
					//call the error callback
					parameters.errorCallback("Impossibile connettersi al server, riprovare più tardi.");
				} else {
					//display a default error dialog
					Ti.UI.createAlertDialog({
						buttonNames : ['OK'],
						message : 'Impossibile connettersi al server, riprovare più tardi.',
						title : 'Errore!'
					}).show();
				}
			},
			timeout : 10000
		});
	
		//handle 'GET' method appending key/value to URI and removing payload
		if (parameters.method == 'GET' && parameters.payload) {
			var values = [];
			for (var key in payload) {
				values.push(key + '=' + payload[key]);
			}
			parameters.URI = parameters.URI + '?' + values.join('&');
			parameters.payload = null;
		}
	
		client.open(parameters.method, parameters.URI);
		client.setRequestHeader("Content-Type", "application/json");
		client.send(JSON.stringify(parameters.payload));
	};
	
	/**
	 * Generate a URI for Vettore.Web actions
	 *
	 * @param {String} server
	 * @param {String} action
	 */
	function generateURI(action) {
		var uri = 'https://www.voodoc.it/webservices/webservice.svc/';
		return uri + action;
	};
	
	return {
		events:events,
		verify:verify,
		activate:activate
	};
})();

module.exports = AsyncConnectionController;