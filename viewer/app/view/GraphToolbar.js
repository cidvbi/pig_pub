/**
 * Creates a GUI toolbar element for the interaction graph.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {PIG.view.GraphToolbar}
 * @see Ext.toolbar.Toolbar
 *
 * @extends Ext.toolbar.Toolbar
 * @xtype piggraphtb
 */
Ext.define('PIG.view.GraphToolbar', {

	extend: 'Ext.toolbar.Toolbar',
	alias: 'widget.piggraphtb',
	id: 'piggraph-bar', 
	
	items: [{
		xtype: 'tbtext',
		itemId: 'type-reporter',
		cls: 'p-graph-type',
		text: '',
		margin: '4 0 0 2'
	},
	'->',
	{
		xtype: 'tbtext',
		itemId: 'scope-reporter',
		text: '',
		margin: '4 4 0 0'
	}]
	
});

