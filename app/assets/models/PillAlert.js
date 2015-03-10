// 
//  PillAlert.js
//  Coliche Gassose
//  
//  Created by Leandro Macrini on 2014-12-08.
//  Copyright 2014 Leandro Macrini. All rights reserved.
// 

var _ = require("lib/underscore");
var moment = require('lib/moment');
moment.lang('it');

var BaseModel = require('/models/BaseModel').BaseModel;

/**
 * @param {Number} pillId
 * @param {Date} when
 * @param {Number} parentId
 * @param {Boolean} taken
 * @param {Boolean} asked
 * @param {String} info
 */
function PillAlert(pillId, when, parentId, taken, asked, info, id, toSync){
	_.extend(this, new BaseModel("pill_alerts", id, toSync));
	
	this.PillID = pillId || 0;
	this.When = when ? moment(when).toJSON() : null;
	this.ParentID = parentId || null;
	this.Taken = _.isUndefined(taken)? null : taken;
	this.Asked = _.isUndefined(asked)? null : taken;
	this.Info = info || "";
}

/**
 * Remove the record and any PillAlert in its series
 */
PillAlert.prototype.deleteSeries = function(){
	if(this.ParentID != null){
		//it's a child
		var parent = read(this.ParentID);
		
		//call deleteSeries on parent - it will delete me too
		if(parent)
			parent.deleteSeries();
		else
			this.delete(); //this should never happen
	} else {
		//may be a parent
		var pillAlerts = readPillAlertsByParentID(this.ID);
		
		//remove children
		if(pillAlerts) _.invoke(pillAlerts, "delete");
		
		//remove me
		this.delete();
	}
};

/**
 * Save the model into the DB and mark the record to sync with the server
 */
PillAlert.prototype.save = function save(alreadySynced){
	this.ToSync = alreadySynced ? 3 : 1;
	
	var db = Ti.Database.open('ColicheGassoseDB');
	
	//create or update
	if( ! this.ID ) {
		db.execute('INSERT INTO pill_alerts (pill_id,when_date,parent_id,taken,to_sync, asked, info) VALUES (?,?,?,?,?,?,?)',
			this.PillID, this.When, this.ParentID, this.Taken, this.ToSync, this.Asked, this.Info);
		this.ID = db.getLastInsertRowId( );
	} else {
		db.execute('UPDATE pill_alerts SET pill_id=?,when_date=?,parent_id=?,taken=?,to_sync=?, asked=?, info =? WHERE id=?',
			this.PillID, this.When, this.ParentID, this.Taken, this.ToSync, this.Asked, this.Info, this.ID);
	}
	
	db.close();
};

/**
 * Initialize model and create database table
 */
function init(){
	var db = Ti.Database.open('ColicheGassoseDB');
	
	db.execute('CREATE TABLE IF NOT EXISTS pill_alerts(id INTEGER PRIMARY KEY AUTOINCREMENT, pill_id INTEGER, when_date TEXT, parent_id INTEGER, taken INTEGER, to_sync INTEGER);');
	
	try{
		db.execute('ALTER TABLE pill_alerts ADD COLUMN info TEXT');
		db.execute('ALTER TABLE pill_alerts ADD COLUMN asked INTEGER');
	} catch (ex){
		//do nothing
		Ti.API.warn("Table pill_alerts is already updated");
	}
	
	db.close();
}

/**
 * Return the deleted record from the deletes table for this model
 */
function getRecordsDeleted() {
	var result = null;
	
	var db = Ti.Database.open('ColicheGassoseDB');
	var recordsRS = db.execute("SELECT id from deletes where record_table = 'pill_alerts' AND to_sync = 1");
	
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
	var recordsRS = db.execute("SELECT * from pill_alerts where to_sync = 1 LIMIT 100");
	
	if(recordsRS.getRowCount()>0) result = [];
	
	while (recordsRS.isValidRow()) {
		result.push(new PillAlert(
			recordsRS.fieldByName('pill_id'),
			moment(recordsRS.fieldByName('when_date')).toDate(),
			recordsRS.fieldByName('parent_id'),
			recordsRS.fieldByName('taken'),
			recordsRS.fieldByName('asked'),
			recordsRS.fieldByName('info'),
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
 * Create all the reminders needed by the passed "dose"
 * @param {Dose} dose
 */
function createRecurrentPillAlert(dose){
	// dose.PillId;
	// dose.Info;
	// dose.Days  = [0,1,2,3,4,5,6]; // 0 = Monday
	// dose.Cycle = 1->48; // in weeks
	// dose.Hours = [datetime];
	
	var days = dose.Cycle * 7;
	
	var parentId = null;
	
	for(var i = 0; i < days ; i++){
		var now = moment();
		var alertDate = moment().add('days', i);
		
		var alerts = [];
		if(dose.Days.length == 0) return false;
		if(_.contains(dose.Days, alertDate.day())) {
			if(dose.Hours.length == 0) return false;
			_.each(dose.Hours, function(hour){
				var when = value = moment({
					year: moment(alertDate).year(),
					month: moment(alertDate).month(),
					day: moment(alertDate).date(),
					hour: moment(hour).hour(),
					minute: moment(hour).minute(),
					second : 0
				});
				
				var	alert = new PillAlert(
					dose.PillId,
					when.toDate(),
					parentId
				);
				
				// create only future reminder to avoid notification on today's past reminders 
				if(when.isBefore(moment())){
					alert.Taken = true;
					alert.asked = true;
				}
				
				alert.Info = dose.Info;
				
				alert.save();
				
				//if it's the first PillAlert save the parentId for next alerts in this series
				if( ! parentId ) parentId = alert.ID;
			});
		}
	}
	
	Ti.App.fireEvent('voo:RecurrentPillAlertsCreated');
	return true;
}

/**
 * Read all the PillAlerts of the passed "parentID"
 * @param {Date} date
 */
function readPillAlertsByParentID(parentID){
	var result = null;
	
	var db = Ti.Database.open('ColicheGassoseDB');
	var recordsRS = db.execute("SELECT * from pill_alerts where parent_id = ?", parentID);
	
	if(recordsRS.getRowCount()>0) result = [];
	
	while (recordsRS.isValidRow()) {
		result.push(new PillAlert(
			recordsRS.fieldByName('pill_id'),
			moment(recordsRS.fieldByName('when_date')).toDate(),
			recordsRS.fieldByName('parent_id'),
			recordsRS.fieldByName('taken'),
			recordsRS.fieldByName('asked'),
			recordsRS.fieldByName('info'),
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
 * Read all the PillAlerts linkt to passed PillID
 * @param {Date} date
 */
function readPillAlertsByPillID(pillID){
	var result = null;
	
	var db = Ti.Database.open('ColicheGassoseDB');
	var recordsRS = db.execute("SELECT * from pill_alerts where pill_id = ?", pillID);
	
	if(recordsRS.getRowCount()>0) result = [];
	
	while (recordsRS.isValidRow()) {
		result.push(new PillAlert(
			recordsRS.fieldByName('pill_id'),
			moment(recordsRS.fieldByName('when_date')).toDate(),
			recordsRS.fieldByName('parent_id'),
			recordsRS.fieldByName('taken'),
			recordsRS.fieldByName('asked'),
			recordsRS.fieldByName('info'),
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
 * Read all the PillAlerts of the passed "date"
 * @param {Date} date
 */
function readPillAlertsByDate(date){
	var result = null;
	
	var db = Ti.Database.open('ColicheGassoseDB');
	var recordsRS = db.execute("SELECT * from pill_alerts where when_date like'" + moment(date).format("YYYY-MM-DD") +"%'");
	
	if(recordsRS.getRowCount()>0) result = [];
	
	while (recordsRS.isValidRow()) {
		result.push(new PillAlert(
			recordsRS.fieldByName('pill_id'),
			moment(recordsRS.fieldByName('when_date')).toDate(),
			recordsRS.fieldByName('parent_id'),
			recordsRS.fieldByName('taken'),
			recordsRS.fieldByName('asked'),
			recordsRS.fieldByName('info'),
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
 * Returns the PillAlert specified by id
 *
 * @param: {Number} id
 */
function read(id){
	var result = null;
	
	var db = Ti.Database.open('ColicheGassoseDB');
	var recordsRS = db.execute("SELECT * from pill_alerts where id=?",id);
	
	if(recordsRS.getRowCount()>0 && recordsRS.isValidRow()){
		result = new PillAlert(
			recordsRS.fieldByName('pill_id'),
			moment(recordsRS.fieldByName('when_date')).toDate(),
			recordsRS.fieldByName('parent_id'),
			recordsRS.fieldByName('taken'),
			recordsRS.fieldByName('asked'),
			recordsRS.fieldByName('info'),
			recordsRS.fieldByName('id'),
			recordsRS.fieldByName('to_sync')
		);		
	}
	
	recordsRS.close();
	db.close();
	
	return result;
}

var RemedyNames = [
	"Terapia posizionale",
	"Massaggio",
	"Musica dolce",
	"Movimento",
	"Probiotici",
	"Altro rimedio"
];
var RemedyRepeats = [
	"Nessuna Ripetizione",
	"Per 2 settimane",
	"Per 3 settimane",
	"Per 4 settimane",
	"Per 2 mesi",
	"Per 4 mesi",
	"Per 6 mesi",
	"Per 12 mesi"
];
var RemedyWeekValues = [
	1,
	2,
	3,
	4,
	8,
	16,
	24,
	48
];
exports.RemedyRepeats = RemedyRepeats;
exports.RemedyNames = RemedyNames;
exports.RemedyWeekValues = RemedyWeekValues;

exports.getRecordsDeleted = getRecordsDeleted;
exports.getRecordsToSync = getRecordsToSync;
exports.createRecurrentPillAlert = createRecurrentPillAlert;
exports.readPillAlertsByDate = readPillAlertsByDate;
exports.readPillAlertsByParentID = readPillAlertsByParentID;
exports.readPillAlertsByPillID = readPillAlertsByPillID;
exports.read = read;
exports.PillAlert = PillAlert;
exports.init = init;