/**
 * Creates a GUI graph of taxon-taxon interactions.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {PIG.view.GraphTTI}
 * @see Ext.Component
 *
 * @extends Ext.Component
 * @xtype ttigraph
 */
Ext.define('PIG.view.GraphTTI', {
	extend: 'Ext.Component',
	alias: 'widget.ttigraph',

	autoScroll: true,
	cls: 'x-graph-view',
	
	contentEl: 'tti-graph-container',
	
	title: 'Taxon-Taxon Interaction (TTI) Graph',
	
	maskable: false,
	masked  : false,
	maskbox : '',
	
	vis: new org.cytoscapeweb.Visualization('tti-graph-container', {
		swfPath              : 'cytoscapeweb/swf/CytoscapeWeb',
		flashInstallerPath   : 'cytoscapeweb/swf/playerProductInstall',
		flashAlternateContent: 'Flash Player is required.'
	}),
	
	styles: {
		global: GraphConfig.global,
		nodes : GraphConfig.nodes,
		edges : GraphConfig.edges
	},
	
	layout: {
		name   : 'ForceDirected',
		options: {
			seed: 554671,
			maxTime: 5000,
			weightAttr: 'scaledSize',
			weightNorm: 'log'
		}
	},
	
	networkModel: {
		dataSchema: {
			nodes: [
				{name:'interactor', type:'string'},
				{name:'annotation', type:'string'},
				{name:'taxon', type:'string'},
				{name:'taxid', type:'number'},
				{name:'group', type:'string'},
				{name:'count', type:'number'},
				{name:'scaledSize', type:'number'},
				{name:'label', type:'string'}
			],
			edges: [
				{name:'interaction_id', type:'string'},
				{name:'count', type:'number'},
				{name:'scaledSize', type:'number'},
				{name:'label', type:'string'}
			]
		},
		data: {nodes:[], edges:[]}
	},
	
	visualStyleBypass: null,
	zoom: 1,
	
	selected: {edges:[], nodes:[]},
	
	initComponent: function() {
		//console.log('GraphTTI.initComponent fired!');
		this.callParent(arguments);
		//this.styles.nodes.labelFontStyle='italic';
	},
	
	/**
	 * Masks the graph.
	 * 
	 * @author Timothy Driscoll
	 * @version 3.0
	 */
	mask: function() {
		//console.log('GraphPPI.mask fired!');
		if (this.maskable && !this.masked) {
			this.masked=true;
			
			var count=Util.getController().getTTIsStore().getTotalCount();
			var max  =ViewerConfig.maxPPI;
			var msg  ='<b>Unable to show ' +count+ ' interactions; the current maximum is ' +max+ '.<\/b>'+
								'<br \/><br \/>'+
								'To reduce interactions, you can either:<br \/>'+
								'&nbsp;&nbsp;Apply additional filters from the menu on the left,<br \/>'+
								'&nbsp;&nbsp;<i>OR<\/i><br \/>'+
								'&nbsp;&nbsp;Return to the <a href="' +ViewerConfig.homeUrl+ '">PIG home page<\/a> and refine your selection.';
								
			//this.setLoading({msg: 'Too many interactions to view.'});
			this.maskbox = Ext.MessageBox.show({
				 msg: msg,
				 width:425,
				 height: 100,
				 modal: false
				 //wait:true,
				 //progressText: 'Saving...',
				 //waitConfig: {interval:200},
				 //icon:'ext-mb-download', //custom class in msg-box.html
				 //iconHeight: 50,
				 //animateTarget: 'mb7'
		 	});
		 	this.maskbox.alignTo(Ext.getCmp('ppiTab').el,'c-c');
		}
	},
	
	/**
	 * Removes an active mask.
	 * 
	 * @author Timothy Driscoll
	 * @version 3.0
	 */
	unmask: function() {
		//console.log('GraphPPI.unmask fired!');
		if (this.masked) {
			this.masked=false;
			//this.setLoading(false);
			this.maskbox.hide();
		}
	},
		
	/**
	 * Resets all visual elements of the graph.
	 * 
	 * @author Timothy Driscoll
	 * @version 3.0
	 */
	reset: function() {
		//console.log('GraphTTI.reset fired!');
		
		this.vis.removeElements();
		
		this.networkModel.data={nodes:[], edges:[]};
		this.layout={
			name   : 'ForceDirected',
			options: {seed: 554671}
		};
		this.visualStyleBypass=null;
		this.zoom=1;
		this.selected={edges:[], nodes:[]};
	},
	
	/**
	 * Captures the current visual state of the graph.
	 * 
	 * @author Timothy Driscoll
	 * @version 3.0
	 */
	captureView: function() {
		//console.log('GraphPPI.captureView fired!');

		var points=[];

		var nodes=this.vis.nodes();
		for (var i=0; i<nodes.length; i++) {
			var node=nodes[i];
			points.push({id: node.data.id, x: node.rawX, y: node.rawY});
		}

		this.layout={
			name: 'Preset',
			options: {
				fitToScreen: false,
				points: points
			}
		};
		
		this.zoom=this.vis.zoom();
		
		this.selected={edges:[], nodes:[]};

		var selNodes=this.vis.selected('nodes');
		for (var i=0; i<selNodes.length; i++) {
			var node=selNodes[i];
			this.selected.nodes.push(node.data.id);
		}
		
		var selEdges=this.vis.selected('edges');
		for (var i=0; i<selEdges.length; i++) {
			var edge=selEdges[i];
			this.selected.edges.push(edge.data.id);
		}
		
	},
	
	/**
	 * Constructs a visual style bypass object using the given data store. Edges 
	 * and nodes in the graph that are absent from the store are bypassed. Elements
	 * present in the store are resized and their visual styles updated.
	 * 
	 * @author Timothy Driscoll
	 * @version 3.0
	 * @param {Ext.Data.Store} store The data store to use to create the bypass.
	 * @return {Object} bypass The visualStyleBypass object.
	 */
	createVisualBypass: function(store) {
		//console.log('GraphTTI.createVisualBypass fired!');

		var edgesInStore={};
		var nodesInStore={};
		
		var bypass= {
			nodes:{},
			edges:{}
		};
		
		var bypassVis= {
			opacity: 0.1,
			labelFontSize: 1,
			hoverOpacity: 0.1,
			hoverBorderColor: '#333333'
		};
		
		// get all the edge and node ids in the interaction store
		for (var i=0; i<store.getCount(); i++) {
			var record = store.getAt(i);
			edgesInStore[record.data['interaction_id']]=record.data['count'];
			nodesInStore[record.data['interactor_a']]  =record.data['count_a'];
			nodesInStore[record.data['interactor_b']]  =record.data['count_b'];
		}
		
		var fullBypass=false;
		
		var items2update=[];
		
		var edges=this.vis.edges();
		for (var i=0; i<edges.length;i++) {
			var e=edges[i];
			if (edgesInStore.hasOwnProperty(e.data.id)) {
				e.data.scaledSize=edgesInStore[e.data.id];
				e.data.label=edgesInStore[e.data.id] + ' PPI';
				if (edgesInStore[e.data.id].length > 1) e.data.label += 's';
			} else {
				e.data.scaledSize=1;
				bypass.edges[e.data.id]=bypassVis;
				fullBypass=true;
			}
			items2update.push(e);
		}
		
		var nodes=this.vis.nodes();
		for (var i=0; i<nodes.length;i++) {
			var n=nodes[i];
			if (nodesInStore.hasOwnProperty(n.data.id)) {
				n.data.scaledSize=nodesInStore[n.data.id];
				items2update.push(n);
			} else {
				bypass.nodes[n.data.id]=bypassVis;
				fullBypass=true;
			}
		}
		
		// update data and visual style for partial bypasses
		if (items2update.length > 0) this.vis.updateData(items2update);
		
		// apply the full bypass
		if (fullBypass) {
			this.visualStyleBypass=bypass;
			return bypass;
		} else {
			this.visualStyleBypass=null;
			return null;
		}
	},

	/**
	 * Applies the stored layout, zoom, selections, and visual style bypass to 
	 * the vis. Fired from a ready listener on the vis.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 */
	applyLayout: function() {
		//console.log('GraphTTI.applyLayout fired!');

		var self=Util.getController().getGraphTTI();

		if (self.layout.name!='Preset') return;

		//console.log(self.vis.edges());
		self.createVisualBypass(Util.getController().getTTIsStore());
		
		self.vis.zoom(self.zoom);
		self.vis.layout(self.layout);
		self.vis.visualStyleBypass(self.visualStyleBypass);
		self.vis.select('edges', self.selected.edges);
		self.vis.select('nodes', self.selected.nodes);
		//self.selected.nodes=[];
		//self.selected.edges=[];
	}
	
});
