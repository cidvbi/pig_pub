/**
 * This class defines the data model for interaction types.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {PIG.model.Type}
 * @see Ext.data.Model
 *
 * @extends Ext.data.Model
 */
Ext.define('PIG.model.Type', {
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

