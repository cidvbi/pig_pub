/**
 * Creates a visual representation of a taxonomy tree for eukaryotic pathogens.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {EnterThePIG.view.EupathsTree}
 * @see EnterThePIG.store.Eupaths
 * @see Ext.tree.Panel
 *
 * @extends Ext.tree.Panel
 * @xtype eupathstree
 */
Ext.define('EnterThePIG.view.EupathsTree', {
	extend: 'Ext.tree.Panel',
	alias : 'widget.eupathstree',
	
	store: 'Eupaths',
	rootVisible: true,
	autoScroll: true,
	
	tbar: {
		componentCls: 'p-toolbar-eupaths',
		items: [{
			xtype: 'tbtext',
			text: '<b>Eukaryotic pathogens<\/b>'
		},
		'->',
		{
			xtype: 'button',
			itemId: 'deselAllEupaths',
			cls:'p-btn-off',
			overCls:'p-btn-over',
			text: GlobalConfig.resetTreeLabel
		}]
	},	// close tbar
	bbar: {
		componentCls: 'p-toolbar-bottom',
		items: [
		'->',
		{
			xtype: 'tbtext',
			text: '0 eukaryotic pathogens selected',
			itemId: 'ecounter'
		}]
	},	// close bbar

	initComponent: function() {
		
		this.callParent(arguments);
	}
	
});
