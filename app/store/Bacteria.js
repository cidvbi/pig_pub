/**
 * Creates the data store for the bacteria taxonomy.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {EnterThePIG.store.Bacteria}
 * @see EnterThePIG.model.Taxon
 * @see Ext.data.TreeStore
 *
 * @extends Ext.data.TreeStore
 */
Ext.define('EnterThePIG.store.Bacteria', {
	extend: 'Ext.data.TreeStore',
	model: 'EnterThePIG.model.Taxon',
	
	defaultRootText: 'Bacteria',
	
	sorters: [{
		property: 'leaf',
		direction: 'ASC'
	},{
		property: 'text',
		direction: 'ASC'
	}],
        
	proxy: {
		type: 'ajax',
		api: {
			read: Connect.makeTreeRequest('bacteria')
		},
		reader: {
			type: 'json',
			successProperty: 'success'
		}
	}

	
});
