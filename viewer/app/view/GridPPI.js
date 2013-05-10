/**
 * Creates a GUI grid of interaction pairs.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {PIG.view.GridPPI}
 * @see PIG.store.PPIs
 * @see Ext.grid.Panel
 *
 * @extends Ext.grid.Panel
 * @xtype ppigrid
 */
Ext.define('PIG.view.GridPPI', {
	extend: 'Ext.grid.Panel',
	alias : 'widget.ppigrid',
	//title : 'Protein-Protein Interactions',

	title: ' ',
	header: {
		xtype: 'toolbar',
		height: 25,
		items: [{
			xtype: 'tbtext',
			itemId: 'gridTitlePPI',
			margin: '3 0 0 5',
			cls: 'grid_title',
			text: 'Protein-Protein Interactions'
		},
		'->',
		{
			xtype: 'tbtext',
			itemId: 'statusMsg',
			margin: '3 5 0 0',
			text: '',
			cls: 'status_msg'
		}]
	},
	
	store: 'PPIs',
	
	autoScroll: true,
	
	initComponent: function() {
		
		this.columns = [

			{
				dataIndex: 'annotation_a',
				header   : 'Interactor A',
				width    : 150,
				renderer : function(value, metadata, record) {
					var link =Util.makeLinkBRC(value,record.data['brc_id_a']);
					if (GridConfig.colorCells)
						metadata.tdCls += 'grid-cell-' + record.data['group_a'].substr(0,2);
					return link;
				},
				hidden   : false
			},
			
			{
				dataIndex: 'interactor_a',
				width    : 90,
				header   : 'ID A',
				renderer : function(value, metadata, record) {
					var link =Util.makeLinkBRC(value,record.data['brc_id_a']);
					if (GridConfig.colorCells)
						metadata.tdCls += 'grid-cell-' + record.data['group_a'].substr(0,2);
					return link;
				},
				hidden   : true
			},
			
			{
				dataIndex: 'taxid_a',
				header   : 'Taxon ID A',
				width    : 75,
				hidden   : true
			},
			
			{
				dataIndex: 'taxon_a',
				header   : 'Taxon A',
				width    : 150,
				hidden   : false,
				renderer: function(value, metadata, record) {
					var link =Util.makeLinkTax(value,record.data['taxid_a']);
					if (GridConfig.colorCells)
						metadata.tdCls += 'grid-cell-' + record.data['group_a'].substr(0,2);
					return link;
				}
			},
			
			{
				dataIndex: 'annotation_b',
				header   : 'Interactor B',
				width    : 150,
				renderer : function(value, metadata, record) {
					var link =Util.makeLinkBRC(value,record.data['brc_id_b']);
					if (GridConfig.colorCells)
						metadata.tdCls += 'grid-cell-' + record.data['group_b'].substr(0,2);
					return link;
				},
				hidden   : false
			},
			
			{
				dataIndex: 'interactor_b',
				width    : 90,
				header   : 'ID B',
				renderer : function(value, metadata, record) {
					var link =Util.makeLinkBRC(value,record.data['brc_id_b']);
					if (GridConfig.colorCells)
						metadata.tdCls += 'grid-cell-' + record.data['group_b'].substr(0,2);
					return link;
				},
				hidden   : true
			},
			
			{
				dataIndex: 'taxid_b',
				header   : 'Taxon ID B',
				width    : 75,
				hidden   : true
			},
			
			{
				dataIndex: 'taxon_b',
				header   : 'Taxon B',
				width    : 150,
				hidden   : false,
				renderer: function(value, metadata, record) {
					var link =Util.makeLinkTax(value,record.data['taxid_b']);
					if (GridConfig.colorCells)
						metadata.tdCls += 'grid-cell-' + record.data['group_b'].substr(0,2);
					return link;
				}
			},
			
			
			{
				dataIndex: 'type_name',
				header   : 'Interaction Type',
				width    : 130,
				hidden   : false
			},

			{
				dataIndex: 'method_name',
				header   : 'Detection Method',
				width    : 140,
				hidden   : false
			},

			{
				dataIndex: 'litref',
				header: 'Reference',
				width: 110,
				renderer: function(value, metadata, record) {
					var str='';
					if (value=='' || value=='-') return "<i>none<\/i>";
					value.sort();
					value.reverse();
					for (var i=0; i<value.length; i++) {
						var link =Util.makeLinkLit(value[i]);
						str += link;
						if (i < value.length-1) str += '&nbsp;&nbsp;';
					}
					return str;
				}
			},
			
			{
				dataIndex: 'repository_name',
				header   : 'Repository',
				width    : 100,
				hidden   : true
			}
			
		];
		
		this.dockedItems=[{
			xtype: 'pagingtoolbar',
			store: 'PPIs',
			dock: 'bottom',
			displayInfo: true
		}];
	

		this.callParent(arguments);
	}
	
});
