/**
 * This class defines the data model for interacting proteins.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {PIG.model.PPI}
 * @see Ext.data.Model
 *
 * @extends Ext.data.Model
 */
Ext.define('PIG.model.PPI', {
	extend: 'Ext.data.Model',
	fields: [
		'interactor_a',
		'annotation_a',
		'brc_id_a',
		'taxid_a',
		'taxon_a',
		'group_a',
		'interactor_b',
		'annotation_b',
		'brc_id_b',
		'taxid_b',
		'taxon_b',
		'group_b',
		'interaction_id',
		'method_name',
		'method_id',
		'type_id',
		'type_name',
		//'repository_id',
		//'repository_name',
		'litref'
	],
	
	autoLoad: false
	
});

