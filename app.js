/*
Ext.Loader.setConfig({
	enabled: true
});
Ext.Loader.setPath('Ext.ux', 'ext-4.1/src/ux');

Ext.require([
	'Ext.ux.tree.tristate.*'
]);
*/


/**
 * Initializes the Ext application and creates the parent Panel object that 
 * contains the app.
 *
 * @author Timothy Driscoll
 * @version 3.0
 * @see Ext
 * @see Ext.application
 * @see Ext.panel.Panel
 */
Ext.onReady(function() {
	
	var availSpace  ={h:800, w:1000};
	
	Ext.application({
		
		name: 'EnterThePIG',
		appFolder: 'app',
		
		//requires: ['Ext.ux.tree.tristate.*'],
		
		controllers: ['Entry'],
		
		launch: function() {
			
			_myAppGlobal=this;
			
			Ext.Ajax.defaultHeaders = {
				'Accept': 'application/json'
			};
			
			Ext.create('Ext.panel.Panel', {
				title: 'Pathogen Interaction Gateway',
				itemId: 'UI',
				componentCls: 'p-main-ui',
				layout: 'border',
				padding: 5,
				
				plain: true,
				renderTo: 'pig-container',
				width: availSpace.w,
				height: availSpace.h,
				
				items: [{
					xtype: 'entryfilters',
					region: 'north'
				},{
					xtype: 'panel',
					region: 'center',
					
					layout: {
						type: 'hbox',
						pack: 'start',
						align: 'stretch'
					},
					
					items: [{
						xtype: 'panel',
						flex: 1,
						layout: {
							type: 'vbox',
							align: 'stretch',
							pack: 'start'
						},
						margin: '10 10 10 10',
						border: 0,
						items:[{
							xtype: 'hoststree',
							rootVisible: true,
							margin: '0 0 20 0',
							flex: 2
						},{
							xtype: 'eupathstree',
							flex: 1
						}]
					},{
						xtype: 'bacteriatree',
						//componentCls: 'p-toolbar-bacteria',
						flex: 1,
						margin: '10 10 10 10'
					},{
						xtype: 'virusestree',
						flex: 1,
						margin: '10 10 10 10'
					}]
					
				}]
				
				/*
				tbar: {
					height: 40,
					items: [{
						xtype: 'textfield',
						name: 'keywordFilter',
						itemId: 'keywordText',
						emptyText: 'Search Interactions',
						width: 220,
						margin: '0 0 0 10'
					},{
						xtype: 'checkbox',
						itemId: 'btwnOnlyCheckbox',
						checked: false,
						boxLabel: 'Confine HPIs to Selected',
						margin: '0 30 0 30'
					},{
						xtype: 'checkbox',
						itemId: 'hpisOnlyCheckbox',
						checked: false,
						boxLabel: 'Host-Pathogen PPIs Only',
						margin: '0 30 0 0'
					},
					'->',
					{
						xtype: 'button',
						text: 'View 0 Interactions',
						itemId: 'viewInteractionsButton',
						cls:'p-btn-off',
						overCls:'p-btn-over',
						disabled: true,
						margin: '0 10 0 0'
					}]
				}
				*/
				
			});
			
		}	// close launch() function
	});	// close Ext.application() function
});	// close Ext.onReady() function

