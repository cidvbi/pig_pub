/**
 * Creates a GUI grid of interacting taxa.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {PIG.view.GridTTI}
 * @see PIG.store.TTIs
 * @see Ext.grid.Panel
 *
 * @extends Ext.grid.Panel
 * @xtype ttigrid
 */
Ext.define('PIG.view.GridTTI', {
	extend: 'Ext.grid.Panel',
	alias : 'widget.ttigrid',
	//title : 'Taxon-Taxon Interactions',

	title: ' ',
	header: {
		xtype: 'toolbar',
		height: 25,
		items: [{
			xtype: 'tbtext',
			itemId: 'gridTitleTTI',
			margin: '3 0 0 5',
			cls: 'grid_title',
			text: 'Taxon-Taxon Interactions'
		},
		'->',
		{
			xtype: 'tbtext',
			itemId: 'goHome',
			margin: '3 5 0 0',
			cls: 'go_home',
			text: '<a href="../">Revise query<\/a>'
		}]
	},
	
	store: 'TTIs',
	
	autoScroll: true,
	
	initComponent: function() {
		
		this.columns = [

			{
				dataIndex: 'taxon_a',
				header   : 'Taxon A',
				width    : 200,
				hidden   : false,
				renderer : function(value, metadata, record) {
					var link =Util.makeLinkTax(value,record.data['taxid_a']);
					return link;
				}
			},
			
			{
				dataIndex: 'group_a',
				header   : 'Group A',
				width    : 100,
				hidden   : false
			},
			
			{
				dataIndex: 'proteins_a',
				header   : 'Proteins A',
				width    : 80,
				hidden   : false
			},
			
			{
				dataIndex: 'taxon_b',
				header   : 'Taxon B',
				width    : 200,
				hidden   : false,
				renderer : function(value, metadata, record) {
					var link =Util.makeLinkTax(value,record.data['taxid_b']);
					return link;
				}
			},
			
			{
				dataIndex: 'group_b',
				header   : 'Group B',
				width    : 100,
				hidden   : false
			},
			
			{
				dataIndex: 'proteins_b',
				header   : 'Proteins B',
				width    : 80,
				hidden   : false
			},
			
			{
				dataIndex: 'count',
				header   : 'PPIs',
				width    : 90,
				hidden   : false
			}/*,

			{
				dataIndex: 'type_count',
				header   : 'Interaction Types',
				width    : 130,
				hidden   : false
			},

			{
				dataIndex: 'method_count',
				header   : 'Detection Methods',
				width    : 140,
				hidden   : false
			},

			{
				dataIndex: 'litref_count',
				header   : 'References',
				width    : 110,
				hidden   : false
			},
			
			{
				dataIndex: 'repository_count',
				header   : 'Repositories',
				width    : 100,
				hidden   : true
			}*/
			
		];
		
		this.callParent(arguments);
	}
	
});
