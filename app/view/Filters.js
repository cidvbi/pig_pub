/**
 * Creates a GUI element for interacting with entry page filters.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {EnterThePIG.view.Filters}
 * @see Ext.panel.Panel
 *
 * @extends Ext.panel.Panel
 * @xtype entryfilters
 */
Ext.define('EnterThePIG.view.Filters', {
	extend: 'Ext.panel.Panel',
	alias : 'widget.entryfilters',
	
	autoScroll: true,
	plain: true,
	
	height: 100,
	
	layout: 'border',
	
	bodyPadding: '4 4 4 4',
	//bodyStyle: 'background: #f3f3e0',
	
	items: [{
		xtype: 'panel',
		region: 'center',
		border: 0,
		layout: {
			type: 'hbox',
			pack: 'start',
			align: 'stretch'
		},
		items: [{
			xtype: 'radiogroup',
			itemId: 'btwnOnlyRadios',
			fieldLabel: '<b>Show interactions involving<\/b>',
			labelAlign: 'top',
			columns: 1,
			vertical: true,
			margin: '0 90 0 20',
			items: [{
				boxLabel: 'Only selected organism(s).',
				name: 'btwnOnly',
				itemId: 'btwnOnlyTrue',
				inputValue: 'true',
				value: true
			},{
				boxLabel: 'Selected organism(s) with any others.',
				name: 'btwnOnly',
				itemId: 'btwnOnlyFalse',
				inputValue: 'false'
			}]
		},{
			xtype: 'radiogroup',
			itemId: 'hpisOnlyRadios',
			fieldLabel: '<b>Show interactions between<\/b>',
			labelAlign: 'top',
			columns: 1,
			vertical: true,
			margin: '0 0 0 0',
			items: [{
				boxLabel: 'Only host and pathogen (HP-PPIs).',
				name: 'hpisOnly',
				itemId: 'hpisOnlyTrue',
				inputValue: 'true',
				value: true
			},{
				boxLabel: 'Any organisms (PPIs).',
				name: 'hpisOnly',
				itemId: 'hpisOnlyFalse',
				inputValue:'false'
			}]
		}]
	},{
		xtype: 'panel',
		region: 'east',
		bodyPadding: 15,
		border: 0,
		layout: {
		type: 'vbox',
		pack: 'start'
		},
		items: [{
			xtype: 'textfield',
			name: 'keywordFilter',
			itemId: 'keywordText',
			emptyText: 'Filter interactions on keyword(s)',
			width: 220
		},{
			xtype: 'button',
			text: 'View 0 Interactions',
			itemId: 'viewInteractionsButton',
			cls:'p-btn-off',
			overCls:'p-btn-over',
			disabled: true,
			width: 150
		}]
	}]
});
