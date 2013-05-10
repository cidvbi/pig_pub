/**
 * Creates a GUI toolbar element for the interaction grid.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {PIG.view.GridToolbar}
 * @see Ext.toolbar.Toolbar
 *
 * @extends Ext.toolbar.Toolbar
 * @xtype piggridtb
 */
Ext.define('PIG.view.GridToolbar', {

	extend: 'Ext.toolbar.Toolbar',
	alias: 'widget.piggridtb',
	id: 'piggrid-bar', 
	
	items: [
	'->',
	{
		xtype: 'button',
		itemId: 'downloadMitabButton',
		text: 'Download MI-TAB',
		iconCls: 'p-btn-download',
		iconAlign: 'right',
		width: 115
	},{
		xtype: 'tbspacer', width: 4
	},{
		xtype: 'button',
		itemId: 'downloadTableButton',
		text: 'Download table',
		iconCls: 'p-btn-download',
		iconAlign: 'right',
		width: 105
	}]
	
});

