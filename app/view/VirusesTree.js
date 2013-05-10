/**
 * Creates a visual representation of a taxonomy tree for viruses.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {EnterThePIG.view.VirusesTree}
 * @see EnterThePIG.store.Viruses
 * @see Ext.tree.Panel
 *
 * @extends Ext.tree.Panel
 * @xtype virusestree
 */
Ext.define('EnterThePIG.view.VirusesTree', {
	extend: 'Ext.tree.Panel',
	alias : 'widget.virusestree',
	
	store: 'Viruses',
	rootVisible: true,
	autoScroll: true,
	
	tbar: {
		componentCls: 'p-toolbar-viruses',
		items: [{
			xtype: 'tbtext',
			text: '<b>Viruses<\/b>'
		},
		'->',
		{
			xtype: 'button',
			itemId: 'deselAllViruses',
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
			text: '0 viruses selected',
			itemId: 'vcounter'
		}]
	},	// close bbar

	initComponent: function() {
		
		this.callParent(arguments);
	}
	
});
