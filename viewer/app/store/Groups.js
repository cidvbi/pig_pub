/**
 * Creates a data store for taxon groups.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {PIG.store.Groups}
 * @see PIG.model.Group
 * @see Ext.data.Store
 *
 * @extends Ext.data.Store
 */
Ext.define('PIG.store.Groups', {
	extend: 'Ext.data.Store',
	model: 'PIG.model.Group'
		
});

