// 
//  BaseModel.js
//  Coliche Gassose
//  
//  Created by Leandro Macrini on 2014-12-08.
//  Copyright 2014 Leandro Macrini. All rights reserved.
// 

var BaseObserver = require('/models/BaseObserver');

/**
 * Base model with common properties
 * 
 * @param {String} table
 * @param {Number} id
 * @param {Boolean} toSync
 */
function BaseModel(table, id, toSync){
	if( ! table ) throw "Table must be set!";
	
	this.Table = table;
	this.ID = id || null;
	this.ToSync = toSync || 3;
	
	//make model observable
	BaseObserver.extend(this);
}

// ToSync = 1 To Syncronize
// ToSync = 2 Syncronizing
// ToSync = 3 Syncronized

/**
 * Set the model ToSync values
 * We do this at low level (without calling save) to avoid data override on send failure if the model was changed more times
 */
BaseModel.prototype.setToSync = function(value){
	if( this.ID ) {
		var db = Ti.Database.open('ColicheGassoseDB');
		db.execute('UPDATE '+this.Table+' SET to_sync=? WHERE id=?', value, this.ID);
		db.close();
	}
};

/**
 * Remove the record from the database and create the sync record in the deletes table
 */
BaseModel.prototype.delete = function(){
	var db = Ti.Database.open('ColicheGassoseDB');
	db.execute('BEGIN');
	db.execute('INSERT INTO deletes (record_id,record_table, to_sync) VALUES (?,?,1)', this.ID, this.Table);
	db.execute('DELETE FROM ' + this.Table + ' WHERE ID=?', this.ID);
	db.execute('COMMIT');
	db.close();
	
	//clear the id from instance
	this.ID = null;
};

/**
 * Initialize model and create database table
 */
function init(){
	var db = Ti.Database.open('ColicheGassoseDB');
	//db.file.setRemoteBackup(false);
	
	db.execute('CREATE TABLE IF NOT EXISTS deletes(id INTEGER PRIMARY KEY AUTOINCREMENT, record_id INTEGER, record_table TEXT, to_sync INTEGER);');
	
	db.close();
}

/**
 * Set the ToSync value into the "deletes" table
 */
function setDeletedToSync(id, table, value){
	var db = Ti.Database.open('ColicheGassoseDB');
	db.execute('BEGIN');
	db.execute("UPDATE deletes set to_sync=? WHERE id=? AND record_table=?",value, id, table);
	db.execute('COMMIT');
	db.close();
}

/**
 * Mark the deleted item as synced
 */
function resetSyncing(){
	var db = Ti.Database.open('ColicheGassoseDB');
	db.execute('BEGIN');
	db.execute("UPDATE appointments set to_sync=1 WHERE to_sync=2");
	db.execute("UPDATE pill_alerts set to_sync=1 WHERE to_sync=2");
	db.execute("UPDATE symptoms set to_sync=1 WHERE to_sync=2");
	db.execute("UPDATE userdata set to_sync=1 WHERE to_sync=2");
	db.execute("UPDATE deletes set to_sync=1 WHERE to_sync=2");
	db.execute('COMMIT');
	db.close();
}

exports.BaseModel = BaseModel;
exports.setDeletedToSync = setDeletedToSync;
exports.resetSyncing = resetSyncing;
exports.init = init;
