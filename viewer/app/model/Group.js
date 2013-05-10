/**
 * This class defines the data model for organism groups.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {PIG.model.Group}
 * @see Ext.data.Model
 *
 * @extends Ext.data.Model
 */
Ext.define('PIG.model.Group', {
	extend: 'Ext.data.Model',
	
	fields: ['id','name','color','shape'],
	
	proxy: {
		type: 'ajax',
		api: {
			read: 'data/groups.json'
		},
		reader: {
			type: 'json',
			root: 'items',
			successProperty: 'success'
		}
	}

	
});

