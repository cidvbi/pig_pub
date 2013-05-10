/**
 * Creates the data store for the eukaryotic pathogen taxonomy.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {EnterThePIG.store.Eupaths}
 * @see EnterThePIG.model.Taxon
 * @see Ext.data.TreeStore
 *
 * @extends Ext.data.TreeStore
 */
Ext.define('EnterThePIG.store.Eupaths', {
	extend: 'Ext.data.TreeStore',
	model: 'EnterThePIG.model.Taxon',
	
	defaultRootText: 'Eukaryotic pathogens',
	
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
			read: Connect.makeTreeRequest('eupaths')
		},
		reader: {
			type: 'json',
			successProperty: 'success'
		}
	}

	
});
