/**
 * Creates a data store for interaction detection methods.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {PIG.store.Methods}
 * @see PIG.model.Method
 * @see Ext.data.Store
 *
 * @extends Ext.data.Store
 */
Ext.define('PIG.store.Methods', {
	extend: 'Ext.data.Store',
	model: 'PIG.model.Method'
});

