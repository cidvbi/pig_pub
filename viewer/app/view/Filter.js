/**
 * Creates a GUI element for interacting with facet filters.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {PIG.view.Filter}
 * @see PIG.view.TypeFilter
 * @see PIG.view.MethodFilter
 * @see Ext.panel.Panel
 *
 * @extends Ext.panel.Panel
 * @xtype pigfilters
 */
Ext.define('PIG.view.Filter', {
	extend: 'Ext.panel.Panel',
	alias : 'widget.pigfilters',
	
	autoScroll: true,
	plain: true,
	
	layout: 'auto',
	//align: 'stretch',
	//pack: 'start',
	
	//bodyPadding: '4 4 4 4',
	//bodyStyle: 'background: #f3f3e0',
	
	items:[/*{
			xtype: 'textfield',
			name: 'keywordFilter',
			itemId: 'keywordText',
			emptyText: 'Filter by keywords',
			margin: '5 0 15 0',
			width: '95%',
			height: 30
		},*/{
		xtype: 'methodfilter',
		width: '100%',
		margin: '0 0 27 0',
		minHeight: 150,
		height: parseInt(0.28*availSpace.h),
		flex: 1
	},{
		xtype: 'typefilter',
		width: '100%',
		margin: '5 0 0 0',
		minHeight: 150,
		height: parseInt(0.28*availSpace.h),
		flex: 1
	}]
	
	/*
	bbar: {
		height: 30,
		id: 'reporterBar',
		items: [{
			xtype: 'tbtext',
			itemId: 'updateReporter',
			text: '',
			cls: 'p-reporter-update',
			margin: '4 0 0 2'
		},
		'->',
		{
			xtype: 'button',
			text: 'Update View',
			itemId: 'updateViewButton',
			disabled: true,
			margin: '0 2 0 0'
		}]
	}
	*/
	
});
