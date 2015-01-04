// 
//  Appointment.js
//  Coliche Gassose
//  
//  Created by Leandro Macrini on 2014-12-08.
//  Copyright 2014 Leandro Macrini. All rights reserved.
// 

var BaseModel = require('models/BaseModel').BaseModel;
var _ = require("lib/underscore");
var moment = require('lib/moment');
moment.lang('it');

/**
 * Doctor appointment model
 * @param {String} info
 * @param {Date} when
 * @param {Boolean} toSync
 */
function Appointment(info, when, id, toSync){
	
	_.extend(this, new BaseModel("appointments", id, toSync));
	
	this.Info = info || "";
	this.When = when ? moment(when).format("DDMMYYYY HH:mm") : null;
}

/**
 * Save the model into the DB and mark the record to sync with the server
 */
Appointment.prototype.save = function save(alreadySynced){
	this.ToSync = alreadySynced ? 3 : 1;
	
	var db = Ti.Database.open('ColicheGassoseDB');
	
	//create or update
	if( ! this.ID ) {
		db.execute('INSERT INTO appointments (info,when_date,to_sync) VALUES (?,?,?)', this.Info, this.When, this.ToSync);
		this.ID = db.getLastInsertRowId( );
	} else {
		db.execute('UPDATE appointments SET info=?,when_date=?,to_sync=? WHERE id=?', this.Info, this.When, this.ToSync, this.ID);
	}
	
	db.close();
};

/**
 * Initialize model and create database table
 */
function init(){
	var db = Ti.Database.open('ColicheGassoseDB');
	db.execute('CREATE TABLE IF NOT EXISTS appointments(id INTEGER PRIMARY KEY AUTOINCREMENT, info TEXT, when_date TEXT, to_sync INTEGER);');
	db.close();
}

/**
 * Return the deleted record from the deletes table for this model
 */
function getRecordsDeleted() {
	var result = null;
	
	var db = Ti.Database.open('ColicheGassoseDB');
	var recordsRS = db.execute("SELECT id from deletes where record_table = 'appointments' AND to_sync = 1");
	
	if(recordsRS.getRowCount()>0) result = [];
	
	while (recordsRS.isValidRow()) {
		result.push(recordsRS.fieldByName('id'));
		recordsRS.next();
	}
	recordsRS.close();
	db.close();
	
	return result;
}

/**
 * Returns an array with the records that need to be synced 
 */
function getRecordsToSync(){
	var result = null;
	
	var db = Ti.Database.open('ColicheGassoseDB');
	var recordsRS = db.execute("SELECT * from appointments where to_sync = 1");
	
	if(recordsRS.getRowCount()>0) result = [];
	
	while (recordsRS.isValidRow()) {
		result.push(new Appointment(
			recordsRS.fieldByName('info'),
			moment(recordsRS.fieldByName('when_date'),"DDMMYYYY HH:mm").toDate(),
			recordsRS.fieldByName('id'),
			recordsRS.fieldByName('to_sync')
		));
		
		recordsRS.next();
	}
	recordsRS.close();
	db.close();
	
	return result;
}

/**
 * Returns the Appointment specified by id
 *
 * @param: {Number} id
 */
function read(id){
	var result = null;
	
	var db = Ti.Database.open('ColicheGassoseDB');
	var recordsRS = db.execute("SELECT * from appointments where id=?",id);
	
	if(recordsRS.getRowCount()>0 && recordsRS.isValidRow()){
		result = new Appointment(
			recordsRS.fieldByName('info'),
			moment(recordsRS.fieldByName('when_date'),"DDMMYYYY HH:mm").toDate(),
			recordsRS.fieldByName('id'),
			recordsRS.fieldByName('to_sync')
		);		
	}
	
	recordsRS.close();
	db.close();
	
	return result;
}

/**
 * Read all the Appointments of the passed "date"
 * @param {Date} date
 */
function readAppointmentByDate(date){
	var result = null;
	
	var db = Ti.Database.open('ColicheGassoseDB');
	var recordsRS = db.execute("SELECT * from appointments where when_date like'" + moment(date).format("DDMMYYYY") +"%'");
	
	if(recordsRS.getRowCount()>0) result = [];
	
	while (recordsRS.isValidRow()) {
		result.push(new Appointment(
			recordsRS.fieldByName('info'),
			moment(recordsRS.fieldByName('when_date'),"DDMMYYYY HH:mm").toDate(),
			recordsRS.fieldByName('id'),
			recordsRS.fieldByName('to_sync')
		));
		
		recordsRS.next();
	}
	recordsRS.close();
	db.close();
	
	return result;
}

exports.getRecordsDeleted = getRecordsDeleted;
exports.getRecordsToSync = getRecordsToSync;
exports.read = read;
exports.readAppointmentByDate = readAppointmentByDate;
exports.Appointment = Appointment;
exports.init = init;
