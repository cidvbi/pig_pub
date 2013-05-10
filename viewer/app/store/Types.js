/**
 * Creates a data store for interaction types.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {PIG.store.Types}
 * @see PIG.model.Type
 * @see Ext.data.Store
 *
 * @extends Ext.data.Store
 */
Ext.define('PIG.store.Types', {
	extend: 'Ext.data.Store',
	model: 'PIG.model.Type'
});

