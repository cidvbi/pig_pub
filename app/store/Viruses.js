/**
 * Creates the data store for the virus taxonomy.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {EnterThePIG.store.Viruses}
 * @see EnterThePIG.model.Taxon
 * @see Ext.data.TreeStore
 *
 * @extends Ext.data.TreeStore
 */
Ext.define('EnterThePIG.store.Viruses', {
	extend: 'Ext.data.TreeStore',
	model: 'EnterThePIG.model.Taxon',
	
	defaultRootText: 'Viruses',
	
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
			read: Connect.makeTreeRequest('viruses')
		},
		reader: {
			type: 'json',
			successProperty: 'success'
		}
	}

	
});
