/**
 * Creates a visual representation of a taxonomy tree for bacteria.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {EnterThePIG.view.BacteriaTree}
 * @see EnterThePIG.store.Bacteria
 * @see Ext.tree.Panel
 *
 * @extends Ext.tree.Panel
 * @xtype bacteriatree
 */
Ext.define('EnterThePIG.view.BacteriaTree', {
	extend: 'Ext.tree.Panel',
	alias : 'widget.bacteriatree',
	
	store: 'Bacteria',
	
	rootVisible: true,
	autoScroll: true,
	
	tbar: {
		componentCls: 'p-toolbar-bacteria',
		items: [{
			xtype: 'tbtext',
			text: '<b>Bacteria<\/b>'
		},
		'->',
		{
			xtype: 'button',
			itemId: 'deselAllBacteria',
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
			text: '0 bacteria selected',
			itemId: 'bcounter'
		}]
	},	// close bbar

	initComponent: function() {
		this.callParent(arguments);
	}
	
});
