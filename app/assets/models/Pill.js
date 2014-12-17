// 
//  Pill.js
//  Coliche Gassose
//  
//  Created by Leandro Macrini on 2014-12-08.
//  Copyright 2014 Leandro Macrini. All rights reserved.
// 

var BaseModel = require('/models/BaseModel').BaseModel;
var _ = require("lib/underscore");

/**
 * @param {Number} shape
 * @param {Number} color
 * @param {String} name
 * @param {String} info
 * @param {Boolean} toSync
 */
function Pill(shape, color, name, info, deletable, templateId, id, toSync){
	_.extend(this, new BaseModel("pills", id, toSync));
	
	this.Shape = shape || 0;
	this.Color = color || 0;
	this.Name = name || "";
	this.Info = info || "";
	this.TemplateId = templateId || null;
	this.Deletable = deletable===0? false : true;
}

/**
 * Save the model into the DB and mark the record to sync with the server
 */
Pill.prototype.save = function save(alreadySynced){
	this.ToSync = alreadySynced ? 3 : 1;
	
	var db = Ti.Database.open('ColicheGassoseDB');
	
	//create or update
	if( ! this.ID ) {
		db.execute('INSERT INTO pills (shape,color,name,info, template_id, to_sync, deletable) VALUES (?,?,?,?,?,?,?)',
			this.Shape, this.Color, this.Name, this.Info, this.TemplateId, this.ToSync, this.Deletable);
		this.ID = db.getLastInsertRowId( );
	} else {
		db.execute('UPDATE pills SET shape=?,color=?,name=?,info=?, template_id=?, to_sync=?,deletable=? WHERE id=?',
			this.Shape, this.Color, this.Name, this.Info, this.TemplateId, this.ToSync, this.Deletable, this.ID);
	}
	
	db.close();
};

/**
 * Enum for pills colors
 */
var PillColors = {
	Red : 	0,
	Green:	1,
	Blue: 	2,
	Violet:	3,
	White : 4,
	Black : 5
};

/**
 * Enum for pills shapes
 */
var PillShapes = {
	Shape0 : 0,
	Shape1 : 1,
	Shape2 : 2,
	Shape3 : 3,
	Shape4 : 4,
	Shape5 : 5
};

/**
 * Initialize model and create database table
 */
function init(){
	var db = Ti.Database.open('ColicheGassoseDB');
	
	db.execute('CREATE TABLE IF NOT EXISTS pills(id INTEGER PRIMARY KEY AUTOINCREMENT, shape INTEGER, color INTEGER, name TEXT, info TEXT, to_sync INTEGER, deletable INTEGER);');
	
	try{
		db.execute('ALTER TABLE pills ADD COLUMN template_id INTEGER');
	} catch (ex){
		//do nothing
		Ti.API.warn("Table pills is already updated");
	}

	db.close();
}

/**
 * Return the deleted record from the deletes table for this model
 */
function getRecordsDeleted() {
	var result = null;
	
	var db = Ti.Database.open('ColicheGassoseDB');
	var recordsRS = db.execute("SELECT id from deletes where record_table = 'pills' AND to_sync = 1");
	
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
	var recordsRS = db.execute("SELECT * from pills where to_sync = 1");
	
	if(recordsRS.getRowCount()>0) result = [];
	
	while (recordsRS.isValidRow()) {
		result.push(new Pill(
			recordsRS.fieldByName('shape'),
			recordsRS.fieldByName('color'),
			recordsRS.fieldByName('name'),
			recordsRS.fieldByName('info'),
			recordsRS.fieldByName('deletable'),
			recordsRS.fieldByName('template_id'),
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
 * Returns all the available Pills from the DB
 */
function readAll(){
	var result = [];
	
	var db = Ti.Database.open('ColicheGassoseDB');
	var recordsRS = db.execute("SELECT * from pills");
	
	while (recordsRS.isValidRow()) {
		result.push(new Pill(
			recordsRS.fieldByName('shape'),
			recordsRS.fieldByName('color'),
			recordsRS.fieldByName('name'),
			recordsRS.fieldByName('info'),
			recordsRS.fieldByName('deletable'),
			recordsRS.fieldByName('template_id'),
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
 * Returns the Pill specified by id
 *
 * @param: {Number} id
 */
function read(id){
	var result = null;
	
	var db = Ti.Database.open('ColicheGassoseDB');
	var recordsRS = db.execute("SELECT * from pills where id=?",id);
	
	if(recordsRS.getRowCount()>0 && recordsRS.isValidRow()){
		result = new Pill(
			recordsRS.fieldByName('shape'),
			recordsRS.fieldByName('color'),
			recordsRS.fieldByName('name'),
			recordsRS.fieldByName('info'),
			recordsRS.fieldByName('deletable'),
			recordsRS.fieldByName('template_id'),
			recordsRS.fieldByName('id'),
			recordsRS.fieldByName('to_sync')
		);		
	}
	
	recordsRS.close();
	db.close();
	
	return result;
}

/**
 * Returns a Pill specified by templateId
 *
 * @param: {Number} templateId
 */
function readByTemplateId(templateId){
	var result = null;
	
	var db = Ti.Database.open('ColicheGassoseDB');
	var recordsRS = db.execute("SELECT * from pills where template_id=?",templateId);
	
	if(recordsRS.getRowCount()>0 && recordsRS.isValidRow()){
		result = new Pill(
			recordsRS.fieldByName('shape'),
			recordsRS.fieldByName('color'),
			recordsRS.fieldByName('name'),
			recordsRS.fieldByName('info'),
			recordsRS.fieldByName('deletable'),
			recordsRS.fieldByName('template_id'),
			recordsRS.fieldByName('id'),
			recordsRS.fieldByName('to_sync')
		);		
	}
	
	recordsRS.close();
	db.close();
	
	return result;
}

exports.getRecordsDeleted = getRecordsDeleted;
exports.getRecordsToSync = getRecordsToSync;
exports.readAll = readAll;
exports.read = read;
exports.readByTemplateId = readByTemplateId;

exports.Pill = Pill;
exports.PillColors = PillColors;
exports.PillShapes = PillShapes;
exports.init = init;
