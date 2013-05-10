/**
 * Creates a GUI element for interacting with interaction type facets.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {PIG.view.TypeFilter}
 * @see Ext.form.Panel
 *
 * @extends Ext.form.Panel
 * @xtype typefilter
 */
Ext.define('PIG.view.TypeFilter', {
	extend: 'Ext.form.Panel',
	alias : 'widget.typefilter',
	
	//title: 'Types',
	
	autoScroll: true,
	plain: true,
	bodyPadding: '2 0 0 2',
	
	style: {
		fontSize: '9px'
	},

	items: [{
		xtype: 'checkboxgroup',
		vertical: true,
		columns: 1,
		defaults: {checked: true},
		items: [/*
			{ boxLabel: 'Item 1', name: 'rb', inputValue: '1' },
			{ boxLabel: 'Item 2', name: 'rb', inputValue: '2', checked: true },
			{ boxLabel: 'Item 3', name: 'rb', inputValue: '3' },
			{ boxLabel: 'Item 4', name: 'rb', inputValue: '4' },
			{ boxLabel: 'Item 5', name: 'rb', inputValue: '5' },
			{ boxLabel: 'Item 6', name: 'rb', inputValue: '6' }
		*/]
	}],
    
	tbar: [{
		xtype: 'tbtext',
		text: '<b>Interaction Types<\/b>'
	},
	'->',
	{
		xtype: 'button',
		cls:'p-btn-off',
		overCls:'p-btn-over',
		text: GlobalConfig.resetFacetLabel,
		name: 'resetAllTypesButton',
		itemId: 'resetAllTypesButton'
	}]

});
