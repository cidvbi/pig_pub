/**
 * Creates a data store for protein interactions.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {PIG.store.PPIs}
 * @see PIG.model.PPI
 * @see Ext.data.Store
 *
 * @extends Ext.data.Store
 */
Ext.define('PIG.store.PPIs', {
	extend: 'Ext.data.Store',
	model: 'PIG.model.PPI',
	
	/*
	listeners: {
		load: function(){
			console.log('loaded');
		}
	},
	*/
	
	proxy: {
		type: 'memory',
		enablePaging: 'true',
		reader: {
			type: 'json',
			totalProperty: 'totalRows',
			root: 'items'
			//successProperty: 'success'
		}
	},
	
	pageSize: ViewerConfig.maxPPI
	
});
