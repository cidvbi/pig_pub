/**
 * Creates a data store for interacting taxa.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {PIG.store.TTIs}
 * @see PIG.model.TTI
 * @see Ext.data.Store
 *
 * @extends Ext.data.Store
 */
Ext.define('PIG.store.TTIs', {
	extend: 'Ext.data.Store',
	model: 'PIG.model.TTI'
		
});
