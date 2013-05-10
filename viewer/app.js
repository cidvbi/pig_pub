
Ext.onReady(function() {
	
	availSpace = {'h':ViewerConfig.h, 'w':ViewerConfig.w};
	
	Ext.application({
		requires: ['Ext.panel.Panel'],
		
		name: 'PIG',
		appFolder: 'app',
		
		controllers: ['Interactions'],
		
		launch: function() {
			
			_myAppGlobal=this;
			
			Ext.create('Ext.panel.Panel', {
				//title: 'Pathogen Interaction Gateway',
				title: '',
				itemId: 'UI',
				layout: 'absolute', 
				padding: 5,
				
				renderTo: 'pig-container',
				width: availSpace.w,
				height: availSpace.h,
				
				defaults: {
					collapsible: false,
					floatable: false,
					draggable: false,
					resizable: false,
					closeable: false
				},
				
				items: [{
					//title: 'Data Filters',
					xtype:'pigfilters',
					cls: 'filter_panel',
					x: 5,
					y: 5,
					//height: parseInt(0.58*availSpace.h),
					height: parseInt(0.61*availSpace.h),
					minHeight: 300,
					width: parseInt(0.25*availSpace.w),
					maxWidth: 500,
					minWidth: 200,
					border: '2'
				},{
					xtype: 'panel',
					layout: 'border',
					x: parseInt(0.25*availSpace.w)+20,
					y: 5,
					height: parseInt(0.61*availSpace.h),
					minHeight: 300,
					width: parseInt(0.72*availSpace.w),
					minWidth: 600,
					items: [{
						xtype:'panel',
						cls: 'legend_panel',
						region: 'west',
						
						floatable: true,
						resizable: false,
						draggable: false,
						collapsible: true,
						collapsed: true,
						
						width: 200,
						closeAction: 'hide',
						/*
						collapseMode: 'placeholder',
						placeholder: {
							xtype: 'button',
							cls:'p-btn-off',
							overCls:'p-btn-over',
							text: 'Graph Legend',
							handler: function(){
								var p = Util.getController().getLegendPanel();
								if (p.isHidden())
									p.show();
								else
									p.collapse();
							}
						},
						*/
						
						title: 'Graph Legend',
						titleAlign: 'center',
						//titleCollapse: true,
						header: false,
						hideCollapseTool: true,
						animate: true,
						
						items: [{
							xtype: 'piglegend'
						}]
					},{
						xtype:'tabpanel',
						region: 'center',
						itemId:'graphTabs',
						activeTab: 1,
						tabBar: {
							items: [{
								xtype: 'tbfill'
							},{
								xtype: 'tbtext',
								itemId: 'goHome',
								margin: '3 5 0 0',
								cls: 'go_home',
								text: '<a href="' +ViewerConfig.homeUrl+ '">Revise query<\/a>'
							}]
						},
						
						items: [{
							itemId:'ttiTab',
							id: 'ttiTab',
							xtype: 'ttigraph'
						},{
							itemId:'ppiTab',
							id: 'ppiTab',
							xtype: 'ppigraph'
						}]
					}]
				},{
					xtype:'ppigrid',
					padding: '0,10,0,10',
					x: 5,
					y: parseInt(0.61*availSpace.h)+10,
					height: parseInt(0.35*availSpace.h),
					width: availSpace.w-20,
					minWidth: 800,
					minHeight: 50
				}]
					
			});
			
		}	// close launch() function
	});	// close Ext.application() function
});	// close Ext.onReady() function

var breakChain    =false;
var filterTrigger ='';
var suspendFilters=false;
var newbieLoad    =true;
