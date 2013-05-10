/**
 * Creates the data store for the host and vector taxonomy.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {EnterThePIG.store.Hosts}
 * @see EnterThePIG.model.Taxon
 * @see Ext.data.TreeStore
 *
 * @extends Ext.data.TreeStore
 */
Ext.define('EnterThePIG.store.Hosts', {
	extend: 'Ext.data.TreeStore',
	model: 'EnterThePIG.model.Taxon',
	
	defaultRootText: 'Hosts and Vectors',
	
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
			read: Connect.makeTreeRequest('hosts')
		},
		reader: {
			type: 'json',
			successProperty: 'success'
		}
	}

	
});
