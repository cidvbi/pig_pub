/**
 * This class defines the data model for interaction detection methods.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {PIG.model.Method}
 * @see Ext.data.Model
 *
 * @extends Ext.data.Model
 */
Ext.define('PIG.model.Method', {
	extend: 'Ext.data.Model',
	
	fields: [
		'name',
		'id',
		'count'
	],
	
	idProperty: 'id',
	
	sorters: [{
		property : 'name',
		direction: 'ASC'
	}]
	
});


