/**
 * Creates the data model for all taxonomy data.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {EnterThePIG.model.Taxon}
 * @see Ext.data.Model
 *
 * @extends Ext.data.Model
 */
Ext.define('EnterThePIG.model.Taxon', {
	extend: 'Ext.data.Model',
	fields: [
		//'id',
		'text',
		'taxid',
		'rollup',
		{ name: 'checked', type: 'boolean',  defaultValue: false, persist: true }
	]/*,
	
	idProperty: 'taxid'*/
	
});

