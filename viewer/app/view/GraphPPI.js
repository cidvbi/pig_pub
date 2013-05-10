/**
 * Creates a GUI graph of protein-protein interactions.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {PIG.view.GraphPPI}
 * @see Ext.Component
 *
 * @extends Ext.Component
 * @xtype ppigraph
 */
Ext.define('PIG.view.GraphPPI', {
	extend: 'Ext.Component',
	alias: 'widget.ppigraph',
	
	autoScroll: true,
	cls: 'x-graph-view',
	
	contentEl: 'ppi-graph-container',
	
	title: 'Protein-Protein Interaction (PPI) Graph',
	
	maskable: false,
	masked  : false,
	maskbox : '',
	
	vis: new org.cytoscapeweb.Visualization('ppi-graph-container', {
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
			maxTime: 5000
		}
	},
	
	networkModel: {
		dataSchema: {
			nodes: [
				{name:'interactor', type:'string'},
				{name:'annotation', type:'string'},
				{name:'brc_id', type:'string'},
				{name:'taxid', type:'number'},
				{name:'taxon', type:'string'},
				{name:'group', type:'string'},
				{name:'count', type:'number'},
				{name:'scaledSize', type:'number'},
				{name:'label', type:'string'}
			],
			edges: [
				{name:'interaction_id', type:'string'},
				{name:'method_id', type:'string'},
				{name:'method_name', type:'string'},
				{name:'type_id', type:'string'},
				{name:'type_name', type:'string'},
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
		//console.log('GraphPPI.initComponent fired!');
		this.callParent(arguments);
	},
	
	/**
	 * Masks the graph, usually in cases where too many nodes are in the network.
	 * 
	 * @author Timothy Driscoll
	 * @version 3.0
	 */
	mask: function() {
		//console.log('GraphPPI.mask fired!');
		if (this.maskable && !this.masked) {
			this.masked=true;
			
			var count=Util.getController().getPPIsStore().getTotalCount();
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
		//console.log('GraphPPI.reset fired!');
		
		//this.vis.removeElements();

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
	 * Constructs a visual style bypass object using the given data store.
	 * 
	 * @author Timothy Driscoll
	 * @version 3.0
	 * @param {Ext.Data.Store} store The data store to use to create the bypass.
	 * @return {Object} bypass The visualStyleBypass object.
	 */
	createVisualBypass: function(store) {
		//console.log('GraphPPI.createVisualBypass fired!');

		var edges2ignore={};
		var nodes2ignore={};
		
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
			edges2ignore[record.data['interaction_id']]=1;
			nodes2ignore[record.data['interactor_a']]  =1;
			nodes2ignore[record.data['interactor_b']]  =1;
		}
		
		var found=false;
		var edges=this.networkModel.data.edges;
		for (var i=0; i<edges.length;i++) {
			if (!edges2ignore.hasOwnProperty(edges[i].id)) {
				bypass.edges[edges[i].id]=bypassVis;
				found=true;
			}
		}
		
		var nodes=this.networkModel.data.nodes;
		for (var i=0; i<nodes.length;i++) {
			var node=nodes[i];
			if (!nodes2ignore.hasOwnProperty(nodes[i].id)){
				bypass.nodes[nodes[i].id]=bypassVis;
				found=true;
			}
		}
		
		if (found) {
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
		//console.log('GraphPPI.applyLayout fired!');
		
		var self=Util.getController().getGraphPPI();
		
		if (self.layout.name!='Preset') return;

		self.createVisualBypass(Util.getController().getPPIsStore());

		self.vis.zoom(self.zoom);
		self.vis.layout(self.layout);
		self.vis.visualStyleBypass(self.visualStyleBypass);
		self.vis.select('edges', self.selected.edges);
		self.vis.select('nodes', self.selected.nodes);
		//self.selected.nodes=[];
		//self.selected.edges=[];
	}
	
});
