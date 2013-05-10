/**
 * Creates a visual representation of a taxonomy tree for hosts and vectors.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {EnterThePIG.view.HostsTree}
 * @see EnterThePIG.store.Hosts
 * @see Ext.tree.Panel
 *
 * @extends Ext.tree.Panel
 * @xtype hoststree
 */
Ext.define('EnterThePIG.view.HostsTree', {
	extend: 'Ext.tree.Panel',
	alias : 'widget.hoststree',
	
	store: 'Hosts',
	rootVisible: true,
	autoScroll: true,
	
	/*
	viewConfig: {
		plugins: {
			ptype: 'tristatetreeplugin'
		}
	},
	columns: [{
		xtype: 'tristatetreecolumn',
		text: 'Name',
		flex: 1,
		dataIndex: 'text'
	}],
	*/
	
	tbar: {
		componentCls: 'p-toolbar-hosts',
		items: [{
			xtype: 'tbtext',
			text: '<b>Hosts and Vectors<\/b>'
		},
		'->',
		{
			xtype: 'button',
			itemId: 'deselAllHosts',
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
			text: '0 hosts selected',
			itemId: 'hcounter'
		}]
	},	// close bbar

	initComponent: function() {
		
		this.callParent(arguments);
	}
	
});

