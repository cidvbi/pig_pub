/**
 * This class defines the data model for interacting taxa. Each 
 * entry is a pair of organisms with shared interactions.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {PIG.model.TTI}
 * @see Ext.data.Model
 *
 * @extends Ext.data.Model
 */
Ext.define('PIG.model.TTI', {
	extend: 'Ext.data.Model',
	fields: [
		'interactor_a',
		'annotation_a',
		'taxon_a',
		'taxid_a',
		'group_a',
		'count_a',
		'interactor_b',
		'annotation_b',
		'taxon_b',
		'taxid_b',
		'group_b',
		'count_b',
		'count',
		'interaction_id'/*,
		'type_count',
		'method_count',
		'litref_count',
		'repository_count'*/
	]
	
});

