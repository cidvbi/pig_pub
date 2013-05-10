/**
 * Creates a GUI element for interacting with the graph (group) legend.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {PIG.view.Legend}
 * @see PIG.store.Groups
 * @see Ext.view.View
 *
 * @extends Ext.view.View
 * @xtype piglegend
 */
Ext.define('PIG.view.Legend', {
	extend: 'Ext.view.View',
	alias: 'widget.piglegend',
	
	autoScroll: true,
	plain: true,
	
	layout: 'auto',
	cls: 'p-graph-legend',
	
	store: 'Groups',
	
	itemSelector: 'div.entry-wrap',

	tpl: [
		'<tpl for=".">',
			'<div class="entry-wrap" id="entry-{id}">',
				'<div class="thumb">',
					(!Ext.isIE6? '<img src="resources/images/legend/{shape}.{color}.png"  alt="{name}" title="{name}" height="20px" width="20px" />' : 
					'<div style="width:20px;height:20px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'resources/images/legend/{shape}.{color}.png\')"></div>'),
				'</div>',
				'<div class="title">{name}</div>',
			'</div>',
		'</tpl>'
	]
	
});

