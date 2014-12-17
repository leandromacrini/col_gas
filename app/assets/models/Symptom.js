// 
//  Symptom.js
//  Coliche Gassose
//  
//  Created by Leandro Macrini on 2014-12-08.
//  Copyright 2014 Leandro Macrini. All rights reserved.
// 

var BaseModel = require('/models/BaseModel').BaseModel;
var _ = require("lib/underscore");
var moment = require('lib/moment');
moment.lang('it');

/**
 * @param {Boolean} pianto
 * @param {Boolean} rigurgito
 * @param {Boolean} agitazione
 * @param {Number} intensity
 * @param {Date} when
 * @param {Number} duration
 * @param {Number} toSync
 */
function Symptom(pianto, rigurgito, agitazione, intensity, when, duration, id, toSync) {
	_.extend(this, new BaseModel("symptoms", id, toSync));
	
	this.Pianto = pianto || 0;
	this.Rigurgito = rigurgito || 0;
	this.Agitazione = agitazione || 0;
	this.Intensity = intensity || 0;
	this.Duration = duration || 0;
	this.When = when ? moment(when).format("DDMMYYYY HH:mm") : null;
}

/**
 * Save the model into the DB and mark the record to sync with the server
 */
Symptom.prototype.save = function save(alreadySynced){
	this.ToSync = alreadySynced ? 3 : 1;
	
	var db = Ti.Database.open('ColicheGassoseDB');
	
	//create or update
	if( ! this.ID ) {
		db.execute('INSERT INTO symptoms (pianto, rigurgito, agitazione,intensity,when_date,duration, to_sync) VALUES (?,?,?,?,?,?,?)',
			this.Pianto, this.Rigurgito, this.Agitazione, this.Intensity, this.When, this.Duration, this.ToSync);
		this.ID = db.getLastInsertRowId( );
	} else {
		db.execute('UPDATE symptoms SET pianto=?, rigurgito=?, agitazione=?,intensity=?,when_date=?,to_sync=?, duration=? WHERE id=?',
			this.Pianto, this.Rigurgito, this.Agitazione, this.Intensity, this.When, this.ToSync, this.Duration, this.ID);
	}
	
	db.close();
};

var SymptomDurations = [
	'5 secondi',
	'10 secondi',
	'15 secondi',
	'30 secondi',
	'1 minuto',
	'Alcuni minuti'
];

var SymptomIntensity = [
	"Leggero",
	"Basso",
	"Medio",
	"Intenso",
	"Fortissimo"
];

/**
 * Initialize model and create database table
 */
function init(){
	var db = Ti.Database.open('ColicheGassoseDB');
	
	db.execute('CREATE TABLE IF NOT EXISTS symptoms(id INTEGER PRIMARY KEY AUTOINCREMENT, pianto INTEGER, rigurgito INTEGER, agitazione INTEGER, intensity INTEGER, when_date TEXT, duration INTEGER, to_sync INTEGER);');

	db.close();
}

/**
 * Return the deleted record from the deletes table for this model
 */
function getRecordsDeleted() {
	var result = null;
	
	var db = Ti.Database.open('ColicheGassoseDB');
	var recordsRS = db.execute("SELECT id from deletes where record_table = 'symptoms' AND to_sync = 1");
	
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
	var recordsRS = db.execute("SELECT * from symptoms where to_sync = 1");
	
	if(recordsRS.getRowCount()>0) result = [];
	
	while (recordsRS.isValidRow()) {
		result.push(new Symptom(
			recordsRS.fieldByName('pianto'),
			recordsRS.fieldByName('rigurgito'),
			recordsRS.fieldByName('agitazione'),
			recordsRS.fieldByName('intensity'),
			moment(recordsRS.fieldByName('when_date'),"DDMMYYYY HH:mm").toDate(),
			recordsRS.fieldByName('duration'),
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
 * Returns the Symptoms specified by id
 *
 * @param: {Number} id
 */
function read(id){
	var result = null;
	
	var db = Ti.Database.open('ColicheGassoseDB');
	var recordsRS = db.execute("SELECT * from symptoms where id=?",id);
	
	if(recordsRS.getRowCount()>0 && recordsRS.isValidRow()){
		result = new Symptom(
			recordsRS.fieldByName('pianto'),
			recordsRS.fieldByName('rigurgito'),
			recordsRS.fieldByName('agitazione'),
			recordsRS.fieldByName('intensity'),
			moment(recordsRS.fieldByName('when_date'),"DDMMYYYY HH:mm").toDate(),
			recordsRS.fieldByName('duration'),
			recordsRS.fieldByName('id'),
			recordsRS.fieldByName('to_sync')
		);		
	}
	
	recordsRS.close();
	db.close();
	
	return result;
}

/**
 * Read all the Symptoms of the passed "date"
 * @param {Date} date
 */
function readSymptomsByDate(date){
	var result = null;
	
	var db = Ti.Database.open('ColicheGassoseDB');
	var recordsRS = db.execute("SELECT * from symptoms where substr(when_date,0,8) = '" + moment(date).format("DDMMYYYY") +"'");
	
	if(recordsRS.getRowCount()>0) result = [];
	
	while (recordsRS.isValidRow()) {
		result.push(new Symptom(
			recordsRS.fieldByName('pianto'),
			recordsRS.fieldByName('rigurgito'),
			recordsRS.fieldByName('agitazione'),
			recordsRS.fieldByName('intensity'),
			moment(recordsRS.fieldByName('when_date'),"DDMMYYYY HH:mm").toDate(),
			recordsRS.fieldByName('duration'),
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
exports.readSymptomsByDate = readSymptomsByDate;
exports.Symptom = Symptom;
exports.SymptomDurations = SymptomDurations;
exports.SymptomIntensity = SymptomIntensity;
exports.init = init;