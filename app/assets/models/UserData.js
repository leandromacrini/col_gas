// 
//  UserData.js
//  Coliche Gassose
//  
//  Created by Leandro Macrini on 2014-12-08.
//  Copyright 2014 Leandro Macrini. All rights reserved.
// 

var BaseModel = require('/models/BaseModel').BaseModel;
var _ = require("lib/underscore");

/**
 * 
 * @param {Number} id
 * @param {String} name
 * @param {String} doctorCode
 * @param {String} doctorName
 * @param {Number} doctorCustom1
 * @param {Number} doctorCustom2
 * @param {Number} doctorCustom3
 * @param {Number} doctorCustom4
 * @param {Object} userInfo
 * @param {String} deviceToken
 * @param {Boolean} toSync
 */
function UserData(name, doctorCode, doctorName, doctorCustom1, doctorCustom2, doctorCustom3, doctorCustom4, userInfo, deviceToken, patientId, patientPID, id, toSync){
	
	_.extend(this, new BaseModel("userdata", id, toSync));
	
	this.Name = name || "";
	this.DoctorName = doctorName || null;
	this.DoctorCode = doctorCode || null;
	this.DoctorCustom1 = doctorCustom1 || 0;
	this.DoctorCustom2 = doctorCustom2 || 0;
	this.DoctorCustom3 = doctorCustom3 || 0;
	this.DoctorCustom4 = doctorCustom4 || 0;
	this.UserInfo = userInfo || {};
	this.DeviceToken = deviceToken || null;
	this.PatientId = patientId || null;
	this.PatientPID = patientPID || null;
}

/**
 * Save the model into the DB and mark the record to sync with the server
 */
UserData.prototype.save = function save(alreadySynced){
	this.ToSync = alreadySynced ? 3 : 1;
	
	var db = Ti.Database.open('ColicheGassoseDB');
	
	//create or update
	if( ! this.ID ) {
		db.execute('INSERT INTO userdata (patient_pid, patient_id,name,doctor_name,doctor_code,doctor_custom1,doctor_custom2,doctor_custom3,doctor_custom4,user_info,device_token,to_sync) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
			this.PatientPID, this.PatientId, this.Name, this.DoctorName, this.DoctorCode, this.DoctorCustom1, this.DoctorCustom2, this.DoctorCustom3, this.DoctorCustom4, JSON.stringify(this.UserInfo), this.DeviceToken, this.ToSync);
		this.ID = db.getLastInsertRowId( );
	} else {
		db.execute('UPDATE userdata SET patient_pid=?, patient_id=?, name=?,doctor_name=?,doctor_code=?,doctor_custom1=?,doctor_custom2=?,doctor_custom3=?,doctor_custom4=?,user_info=?,device_token=?,to_sync=? WHERE id=?',
			this.PatientPID, this.PatientId, this.Name, this.DoctorName, this.DoctorCode, this.DoctorCustom1, this.DoctorCustom2, this.DoctorCustom3, this.DoctorCustom4, JSON.stringify(this.UserInfo), this.DeviceToken, this.ToSync, this.ID);
	}
	
	db.close();
	
	//update observers
	Ti.App.fireEvent("voo:updateUserData", {userdata: this});
};

/**
 * Load model from DB
 */
function load(){
	var result = new UserData();
	
	var db = Ti.Database.open('ColicheGassoseDB');
	var recordsRS = db.execute("SELECT * from userdata limit 1");
	
	if(recordsRS.getRowCount()>0 && recordsRS.isValidRow()){
		
		result.ID = recordsRS.fieldByName('id');
		result.PatientId = recordsRS.fieldByName('patient_id');
		result.PatientPID = recordsRS.fieldByName('patient_pid');
		result.Name = recordsRS.fieldByName('name');
		result.DoctorName = recordsRS.fieldByName('doctor_name');
		result.DoctorCode = recordsRS.fieldByName('doctor_code');
		result.DoctorCustom1 = recordsRS.fieldByName('doctor_custom1');
		result.DoctorCustom2 = recordsRS.fieldByName('doctor_custom2');
		result.DoctorCustom3 = recordsRS.fieldByName('doctor_custom3');
		result.DoctorCustom4 = recordsRS.fieldByName('doctor_custom4');
		result.UserInfo = JSON.parse( recordsRS.fieldByName('user_info')) || {};
		result.DeviceToken = recordsRS.fieldByName('device_token');
		result.ToSync = recordsRS.fieldByName('to_sync');
	}
	
	recordsRS.close();
	db.close();
	
	//computed members
	result.DeviceOS = Ti.Platform.osname;
	result.DeviceOSVersion = Ti.Platform.version;
	
	return result;
};

/**
 * Initialize model and create database table
 */
function init(){
	var db = Ti.Database.open('ColicheGassoseDB');
	
	db.execute('CREATE TABLE IF NOT EXISTS userdata(id INTEGER PRIMARY KEY AUTOINCREMENT, patient_pid TEXT, patient_id INTEGER, name TEXT, doctor_name TEXT, doctor_code TEXT, doctor_custom1 INTEGER, doctor_custom2 INTEGER, doctor_custom3 INTEGER, doctor_custom4 INTEGER, device_token TEXT, to_sync INTEGER);');

	try{
		db.execute('ALTER TABLE userdata ADD COLUMN user_info TEXT');
	} catch (ex){
		//do nothing
		Ti.API.warn("Table userdata is already updated");
	}

	db.close();
}

UserData.Razze = {
	Caucasica: '1',
	Asiatica: '2',
	Africana: '3',
	Australiana: '4',
	Ispanica: '5'
};

UserData.Patologie = {
	Reflusso: '1',
	Stipsi: '2',
	Diarrea: '3',
	MorbodiCrohn: '4',
	RettocoliteUlcerosa: '5',
	Neoplasie: '6',
	Calcoli: '7',
	Epatite: '8'
};

exports.UserData = UserData;
exports.load = load;
exports.init = init;