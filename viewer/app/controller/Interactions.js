/**
 * The main controller class for the viewer application.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {PIG.controller.Interactions}
 * @see Ext.app.Controller
 *
 * @extends Ext.app.Controller
 */
Ext.define('PIG.controller.Interactions', {
	extend: 'Ext.app.Controller',

	views:  [
		'GridPPI',
		'GraphPPI',
		'GraphTTI',
		'Filter',
		'MethodFilter',
		'TypeFilter',
		'Legend'
	],
	stores: ['PPIs','TTIs','Types','Methods','Groups'],
	models: ['PPI','TTI','Type','Method','Group'],

	refs: [{
		selector: 'tabpanel[itemId="graphTabs"]',
		ref: 'graphs'
	},{
		selector: '[xtype="ppigrid"]',
		ref: 'gridPPI'
	},{
		selector: '[xtype="ppigrid"] > [xtype="pagingtoolbar"]',
		ref: 'gridPagingToolbar'
	},{
		selector: '[xtype="ppigraph"]',
		ref: 'GraphPPI'
	},{
		selector: '[xtype="ttigraph"]',
		ref: 'GraphTTI'
	},{
		selector: '[xtype="piglegend"]',
		ref: 'legend'
	},{
		selector: 'tbtext[itemId="statusMsg"]',
		ref: 'statusMsg'
	},{
		selector: '[xtype="pigfilters"]',
		ref: 'filters'
	},{
		selector: '[xtype="methodfilter"] > [xtype="checkboxgroup"]',
		ref: 'methodFilterBoxes'
	},{
		selector: '[xtype="methodfilter"] > [xtype="toolbar"] > [xtype="tbtext"]',
		ref: 'methodFilterHeader'
	},{
		selector: '[xtype="typefilter"] > [xtype="checkboxgroup"]',
		ref: 'typeFilterBoxes'
	},{
		selector: '[xtype="typefilter"] > [xtype="toolbar"] > [xtype="tbtext"]',
		ref: 'typeFilterHeader'
	}/*,{
		selector: '[xtype="pigfilters"] > [xtype="textfield"]',
		ref: 'keywordFilter'
	}*/],


	/**
	 * Sets up various listeners, and a Util reference to this controller object.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 */
	init: function() {
		console.log('Initialized PIG.');
		Util.setController(this);
		
		this.control({
			'ppigrid': {
				select: this.onGridSelect
			},
			'ppigrid > pagingtoolbar': {
				beforechange: this.requestNewPage
			},
			'methodfilter > checkboxgroup > checkbox': {
				change: this.onMethodFilterCheck
			},
			'typefilter > checkboxgroup > checkbox': {
				change: this.onTypeFilterCheck
			},
			'[itemId="resetAllMethodsButton"]': {
				click: this.clearAllMethodFilters
			},
			'[itemId="resetAllTypesButton"]': {
				click: this.clearAllTypeFilters
			}/*,
			'[itemId="downloadMitabButton"]': {
				click: this.downloadAsMitab
			},
			'[itemId="downloadTableButton"]': {
				click: this.downloadAsTable
			},
			'textfield[itemId="keywordText"]' : {
				change: function(e, newVal){
					//if (newVal.length < 1 || newVal.length > 4) this.activateCountTimer();
				}
			}*/
		});
	},
	
	/**
	 * Called when the class first launches.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 */
	onLaunch: function() {
		
		this.getPPIsStore().on({
			load: {fn: this.onPPIsLoad, scope: this, single: true}
		});
		this.getTTIsStore().on({
			load: {fn: this.onTTIsLoad, scope: this, single: true}
		});

		this.getMethodsStore().on({
			load: {fn: this.setMethodFilters, scope: this}
		});
		this.getTypesStore().on({
			load: {fn: this.setTypeFilters, scope: this}
		});

		this.populateGroups();
		this.requestData();
	},
	

	/**
	 * Requests the interaction data from the server. Handled via a callback 
	 * function to ensure order of operations is maintained.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 */
	requestData: function() {

		this.getFilters().setLoading(true);
		this.getGridPPI().setLoading(true);
		this.getGraphs().setLoading(true);

		Ext.Ajax.request({
			url: Connect.makeInteractionsRequestURL(ViewerConfig),
			params: {},
			disableCaching: false,
			headers: {
			'Accept': 'application/json'
			},
			success: function(response){
				var jsonStr = response.responseText;
				var json=Ext.JSON.decode(jsonStr);
				
				if (json.totalRows>ViewerConfig.maxPPI) this.getGraphPPI().maskable=true;
				
				this.populateStores(json);
			},
			scope: this
		});
	},
		
	/**
	 * Requests a new page of ppi data from the server and loads it into the PPI 
	 * grid. This bypasses the normal load procedure to allow display of a Loading 
	 * message and custom handling of changes to the graphs and filters. 
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 * @param {Ext.Toolbar} tb The parent Toolbar object.
	 * @param {number} page The new page of data to load.
	 * @return {boolean} True.
	 */
	requestNewPage: function(tb, page) {
		//console.log("requestNewPage fired!");
		
		// deselect all graph elements
		if (this.getGraphs().getActiveTab().getItemId()=='ppiTab' && !this.getGraphPPI().masked) {
			this.getGraphPPI().vis.deselect();
		} else {
			this.getGraphTTI().vis.deselect();
		}

		this.getGridPPI().setLoading(true);
		
		ViewerConfig.page=page;
		
		Ext.Ajax.request({
			url: Connect.makeNewPageRequestURL(ViewerConfig),
			params: {},
			disableCaching: false,
			headers: {
			'Accept': 'application/json'
			},
			success: function(response){
				// responseText should be in json format
				var jsonStr = response.responseText;
				//console.log(jsonStr);
				var json=Ext.JSON.decode(jsonStr);
				this.getPPIsStore().loadRawData(json);
				this.getGridPPI().setLoading(false);
			},
			scope: this
		});
		return true;
	},
	

	/**
	 * Populates the client-side data stores with the given json data.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 * @param {Object} json Interaction data in json format.
	 */
	populateStores: function(json) {
		//console.log(json);
		
		this.getGridPPI().setLoading(false);
		this.getFilters().setLoading(false);
		this.getGraphs().setLoading(false);

		if (filterTrigger != 'typeBoxes')
			this.populateTypes(json);
		if (filterTrigger != 'methodBoxes')
			this.populateMethods(json);
		filterTrigger='';
		
		this.populatePPIs(json);
		if (!newbieLoad)
			this.populateTTIs(json);
		newbieLoad=false;
	},
	
	/**
	 * Fills the Groups store with data according to the Store proxy, and creates 
	 * the graph legend.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 */
	populateGroups: function() {
		this.getGroupsStore().load({
				callback: function() {
					this.getLegend().show();
				},
				scope: this
		});
	},
	
	/**
	 * Fills the PPIs store using the given data. Replaces any existing data. Also 
	 * fills the TTI store after loading to ensure correct order of operations.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 * @param {Object} json Interaction data in json format.
	 */
	populatePPIs: function(json) {
		this.json=json;
		this.getPPIsStore().loadRawData(json);
	},
	
	/**
	 * Fills the TTIs store with the given data. Replaces any existing data.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 * @param {Object} json Interaction data in json format.
	 */
	populateTTIs: function(json) {
		
		// extract the taxa and pair up the counts
		var taxa ={};
		var sizes={};
		for (var i=0; i<json.facets.facet_pivot['taxon_a,taxon_b'].length; i++) {

			var nameTop =json.facets.facet_pivot['taxon_a,taxon_b'][i].value;
			var countTop=json.facets.facet_pivot['taxon_a,taxon_b'][i].count;

			if (!sizes.hasOwnProperty(nameTop)) sizes[nameTop]=0;
			sizes[nameTop] = sizes[nameTop]+countTop;

			for (var j=0; j<json.facets.facet_pivot['taxon_a,taxon_b'][i].pivot.length; j++) {

				var nameBot =json.facets.facet_pivot['taxon_a,taxon_b'][i].pivot[j].value;
				var countBot=json.facets.facet_pivot['taxon_a,taxon_b'][i].pivot[j].count;

				if (!sizes.hasOwnProperty(nameBot)) sizes[nameBot]=0;
				sizes[nameBot] = sizes[nameBot]+countBot;

				if (taxa.hasOwnProperty(nameTop)) {
					if (taxa[nameTop].hasOwnProperty(nameBot)) {
						taxa[nameTop][nameBot] = taxa[nameTop][nameBot] + countBot;
					} else {
						taxa[nameTop][nameBot] = countBot;
					}
				} else if (taxa.hasOwnProperty(nameBot)) {
					if (taxa[nameBot].hasOwnProperty(nameTop)) {
						taxa[nameBot][nameTop] = taxa[nameBot][nameTop] + countBot;
					} else {
						taxa[nameBot][nameTop] = countBot;
					}
				} else {
					taxa[nameTop]={};
					taxa[nameTop][nameBot]=countBot;
				}
			}
			
		}
		
		// extract taxids from pivot
		var taxids={};
		for (var i=0; i<json.facets.facet_pivot['taxon_a,taxid_a'].length; i++) {
			var taxon =json.facets.facet_pivot['taxon_a,taxid_a'][i].value;
			for (var j=0; j<json.facets.facet_pivot['taxon_a,taxid_a'][i].pivot.length; j++) {
				var taxid=json.facets.facet_pivot['taxon_a,taxid_a'][i].pivot[j].value;
				taxids[taxon]=taxid;
			}
		}
		for (var i=0; i<json.facets.facet_pivot['taxon_b,taxid_b'].length; i++) {
			var taxon =json.facets.facet_pivot['taxon_b,taxid_b'][i].value;
			for (var j=0; j<json.facets.facet_pivot['taxon_b,taxid_b'][i].pivot.length; j++) {
				var taxid=json.facets.facet_pivot['taxon_b,taxid_b'][i].pivot[j].value;
				taxids[taxon]=taxid;
			}
		}
		
		// extract groups from pivot
		var groups={};
		for (var i=0; i<json.facets.facet_pivot['taxon_a,group_a'].length; i++) {
			var taxon =json.facets.facet_pivot['taxon_a,group_a'][i].value;
			for (var j=0; j<json.facets.facet_pivot['taxon_a,group_a'][i].pivot.length; j++) {
				var group=json.facets.facet_pivot['taxon_a,group_a'][i].pivot[j].value;
				groups[taxon]=group;
			}
		}
		for (var i=0; i<json.facets.facet_pivot['taxon_b,group_b'].length; i++) {
			var taxon =json.facets.facet_pivot['taxon_b,group_b'][i].value;
			for (var j=0; j<json.facets.facet_pivot['taxon_b,group_b'][i].pivot.length; j++) {
				var group=json.facets.facet_pivot['taxon_b,group_b'][i].pivot[j].value;
				groups[taxon]=group;
			}
		}
		
		// convert the taxa into a json structure and load into the store
		var tJson=[];
		for (var t1 in taxa) {
			if (taxa.hasOwnProperty(t1)) {
				for (var t2 in taxa[t1]) {
					if (taxa[t1].hasOwnProperty(t2)) {
						tJson.push({
							'interactor_a'  : t1,
							'annotation_a'  : '',
							'taxon_a'       : t1,
							'taxid_a'       : taxids[t1],
							'group_a'       : groups[t1],
							'count_a'       : sizes[t1],
							'interactor_b'  : t2,
							'annotation_b'  : '',
							'taxon_b'       : t2,
							'taxid_b'       : taxids[t2],
							'group_b'       : groups[t2],
							'count_b'       : sizes[t2],
							'count'         : taxa[t1][t2],
							'interaction_id': taxids[t1] + '-' + taxids[t2]
						});
					}
				}
			}
		}
		
		//console.log(tJson);
		var ttisStore = this.getTTIsStore();
		ttisStore.loadRawData(tJson);
		
	},
	
	/**
	 * Fills the Methods store using the given data. Replaces any existing data.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 * @param {Object} json Interaction data in json format.
	 */
	populateMethods: function(json) {
		// extract the method facets and load
		var mJson=[];
		for (var i=0; i<json.facets.facet_pivot['method_id,method_name'].length; i++) {
			if (json.facets.facet_pivot['method_id,method_name'][i].count==0) continue;
			mJson.push({
				'id'   : json.facets.facet_pivot['method_id,method_name'][i].value,
				'name' : json.facets.facet_pivot['method_id,method_name'][i].pivot[0].value,
				'count': json.facets.facet_pivot['method_id,method_name'][i].count
			});
		}
		this.getMethodsStore().loadRawData(mJson);
	},
	
	/**
	 * Fills the Types store using the given data. Replaces any existing data.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 * @param {Object} json Interaction data in json format.
	 */
	populateTypes: function(json) {
		// extract the type facets and load
		var tJson=[];
		for (var i=0; i<json.facets.facet_pivot['type_id,type_name'].length; i++) {
			if (json.facets.facet_pivot['type_id,type_name'][i].count==0) continue;
			tJson.push({
				'id'   : json.facets.facet_pivot['type_id,type_name'][i].value,
				'name' : json.facets.facet_pivot['type_id,type_name'][i].pivot[0].value,
				'count': json.facets.facet_pivot['type_id,type_name'][i].count
			});
		}
		this.getTypesStore().loadRawData(tJson);
	},
	
	
	/**
	 * Called after the PPIs store is first loaded and inits the new PPI graph. 
	 * This callback is a singleton so as to avoid destructive Graph reloading when 
	 * changes are made to the underlying data stores. Successive changes are 
	 * handled by updateGraphView_PPI.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 */
	onPPIsLoad: function() {
		//console.log('onPPIsLoad fired!');
		
		this.updateStatusMsg();
		
		this.getPPIsStore().on({
			load: {fn: this.updateGraphView_PPI, scope: this}
		});

		this.getGridPPI().getSelectionModel().setSelectionMode('MULTI');
		
		if (!this.getGraphPPI().maskable) this.createGraph_PPI();

		this.populateTTIs(this.json);
	},
	
	/**
	 * Called after the TTIs store is first loaded and inits the new TTI graph. 
	 * This callback is a singleton so as to avoid destructive Graph reloading when 
	 * changes are made to the underlying data stores. Successive changes are 
	 * handled by updateGraphView_TTI.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 */
	onTTIsLoad: function() {
		//console.log('onTTIsLoad fired!');
		
		this.getTTIsStore().on({
			load: {fn: this.updateGraphView_TTI, scope: this}
		});
		
		this.getGraphs().setActiveTab(0);
		this.createGraph_TTI();
		
		this.getGraphs().on({
			beforetabchange: {fn: this.beforeGraphTabChange, scope: this},
			tabchange      : {fn: this.onGraphTabChange,     scope: this}
		});
		
	},

	
	/**
	 * Fired before a change in the active (visible) graph tab.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 * @param {Ext.tab.Panel} tabPanel The source tab panel.
	 * @param {Ext.Component} newCard The tab panel that will be activated.
	 * @param {Ext.Component} oldCard The tab panel that is currently active.
	 * @param {Object} opts Ext options.
	 */
	beforeGraphTabChange: function(tabPanel, newCard, oldCard, opts) {
		//console.log('beforeGraphTabChange fired!');
		
		if (oldCard.getItemId()=='ttiTab') {
			this.getGraphTTI().captureView();
		} else {
			if (!this.getGraphPPI().masked) {
				this.getGraphPPI().captureView();
			} else {
				this.getGraphPPI().unmask();
			}
		}
		
	},
	
	/**
	 * Fired once a new graph tab is activated (visible).
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 * @param {Ext.tab.Panel} tabPanel The source tab panel.
	 * @param {Ext.Component} newCard The tab panel that is now active.
	 * @param {Ext.Component} oldCard The tab panel that was previously active.
	 * @param {Object} opts Ext options.
	 */
	onGraphTabChange: function(tabPanel, newCard, oldCard, opts) {
		//console.log('onGraphTabChange fired!');
		
		if (newCard.getItemId()=='ppiTab' && this.getGraphPPI().maskable) 
			this.updateGraphView_PPI();
	},
	

	/**
	 * Creates a new PPI Graph. If the Graph is larger than the max allowable size, 
	 * shows a mask instead.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 */
	createGraph_PPI: function() {
		//console.log('createGraph_PPI fired!');
				
		// make sure we have a graph object to hold our graph
		var g = this.getGraphPPI();
		if (typeof g.vis == 'undefined' || g.vis==null) {
			console.log('FATAL: no vis defined in GraphPPI.');
			return;
		}
		
		// build a network from the underlying store
		var network = this.networkFromStore(this.getPPIsStore());
		if (typeof network == 'undefined') {
			console.log('FATAL: no network model defined in createGraph_PPI.');
			return;
		}
		g.networkModel.data.nodes=network.nodes;
		g.networkModel.data.edges=network.edges;

		// add some listeners to our PPI graph
		g.vis.ready(g.applyLayout);
		g.vis.addListener("click",           this.onGraphBackgroundClick);
		g.vis.addListener("select", "edges", this.onGraphEdgeSelect_PPI);
		//g.vis.addListener("select", "nodes", this.onGraphNodeSelect);


		// draw the graph vis
		g.vis.draw({
			network            :g.networkModel,
			layout             :g.layout,
			nodeLabelsVisible  :true,
			nodeTooltipsEnabled:true,
			edgeLabelsVisible  :false,
			edgeTooltipsEnabled:true,
			visualStyle        :g.styles
		});
		
	},
	
	/**
	 * Creates a new TTI Graph.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 */
	createGraph_TTI: function() {
		//console.log('createGraph_TTI fired!');
		
		// make sure we have a graph object to hold our graph
		var g = this.getGraphTTI();
		if (typeof g.vis == 'undefined' || g.vis==null) {
			console.log('FATAL: no vis defined in GraphTTI.');
			return;
		}
				
		// build a network from the underlying store
		var network = this.networkFromStore(this.getTTIsStore());
		if (typeof network == 'undefined') {
			console.log('FATAL: no network model defined in createGraph_TTI.');
			return;
		}
		g.networkModel.data.nodes=network.nodes;
		g.networkModel.data.edges=network.edges;
			

		// add some listeners to our TTI graph
		g.vis.ready(g.applyLayout);
		g.vis.addListener("click",           this.onGraphBackgroundClick);
		g.vis.addListener("select", "edges", this.onGraphEdgeSelect_TTI);
		//g.vis.addListener("select", "nodes", this.onGraphNodeSelect);
		
		// draw the graph vis
		g.vis.draw({
			network            :g.networkModel,
			layout             :g.layout,
			nodeLabelsVisible  :true,
			nodeTooltipsEnabled:false,
			edgeLabelsVisible  :true,
			edgeTooltipsEnabled:false,
			visualStyle        :g.styles
		});
		
	},
	
	/**
	 * Creates a new network model using data in the given store.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 * @param {Ext.data.Store} store The underlying data store.
	 * @return {Object} network The network nodes and edges.
	 */
	networkFromStore: function(store) {
		//console.log('networkFromStore fired!');		
		
		var network={nodes:[],edges:[]};
		
		// convert the Store to a network
		var nodeIds={};
		var storeSize = store.getCount();
		for (var i=0; i<storeSize; i++) {
			var edge ={scaledSize: GraphConfig.defaultEdgeWidth, count: 1};
			var nodes={
				a:{scaledSize: GraphConfig.defaultNodeSize, count: 1},
				b:{scaledSize: GraphConfig.defaultNodeSize, count: 1}
			};

			var record = store.getAt(i);
			for (var key in record.data) {
				if (!record.data.hasOwnProperty(key)) continue;
				if (key=='rownum' || key=='litref' || key=='id_in_repository') continue;

				var val    = record.data[key];
				var suffix = key.slice(-2);
				var prop   = key.slice(0,-2);

				if (suffix == "_a") {
					// set source node properties
				
					nodes.a[prop]=val;

					if (prop == "interactor") {
						edge["source"]=val;
						nodes.a["id"] =val;
					} else if (prop == 'count') {
						nodes.a["scaledSize"]=val/20;
					}
					
				} else if (suffix == "_b") {
					// set target node properties

					nodes.b[prop]=val;

					if (prop == "interactor") {
						edge["target"]=val;
						nodes.b["id"] =val;
					} else if (prop == 'count') {
						nodes.b["scaledSize"]=val/20;
					}
					
				} else {
					// set edge properties
					
					edge[key]=val;

					if (key == "interaction_id") {
						edge["id"]=val;
					} else if (key == "count") {
						edge["scaledSize"]=val/20;
					}
				}
			}
			
			// construct an edge label
			if (edge.hasOwnProperty('type_name')) {
				edge['label'] = edge['type_name'];
			} else {
				edge['label'] = edge.count+" PPI";
				if (edge.count>1) edge['label'] += 's';
			}

			// construct node labels
			var label    =nodes.a['annotation'];
			var taxAbbrev=nodes.a['taxon'];
			if (nodes.a['group'] != 'viruses') {
				var t=taxAbbrev.split(" ");
				var g=t.shift();
				if (g.substr(0,1)=='[') {
					g  =g.substr(1,1);
					taxAbbrev='['+ g.toUpperCase() +'.] '+ t.join(" ");
				} else {
					g  =g.substr(0,1);
					taxAbbrev=g.toUpperCase() +'. '+ t.join(" ");
				}
			}
			
			if (label=='') 
				label = nodes.a['taxon'];
			//else
			//	label += "\n" + taxAbbrev;
				
			nodes.a['label']=label;

			label    =nodes.b['annotation'];
			taxAbbrev=nodes.b['taxon'];
			if (nodes.b['group'] != 'viruses') {
				var t=taxAbbrev.split(" ");
				var g=t.shift();
				if (g.substr(0,1)=='[') {
					g  =g.substr(1,1);
					taxAbbrev='['+ g.toUpperCase() +'.] '+ t.join(" ");
				} else {
					g  =g.substr(0,1);
					taxAbbrev=g.toUpperCase() +'. '+ t.join(" ");
				}
			}
			
			if (label=='') 
				label = nodes.b['taxon'];
			//else
			//	label += "\n" + taxAbbrev;
				
			nodes.b['label']=label;

			
			// add the nodes and edge for this interaction to the network object
			network.edges.push(edge);
			if (!nodeIds.hasOwnProperty(nodes.a.id)) {
				network.nodes.push(nodes.a);
				nodeIds[nodes.a.id]=1;
			}
			if (!nodeIds.hasOwnProperty(nodes.b.id)) {
				network.nodes.push(nodes.b);
				nodeIds[nodes.b.id]=1;
			}
		}
		
		//console.log(network);
		return network;
	},


	/**
	 * Called when a row in the PPI grid is selected. Coordinates the selection 
	 * with both graphs.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 * @param {Ext.data.RowModel} selModel The selection model.
	 * @param {Ext.data.Model} record The selected record.
	 * @param {number} rowIndx The row index selected.
	 * @param {number} colIndx The column index selected.
	 * @param {Object} eOpts Ext options.
	 */
	onGridSelect: function(selModel, record, rowIndx, colIndx, eOpts) {
		//console.log('onGridSelect fired.');
		
		// discover the selection mode
		if (!GraphConfig.hasOwnProperty('selectMode')) 
			GraphConfig.selectMode='edges';
		if (GraphConfig.selectMode=='none') return;
		
		// set the target graph
		var graph=this.getGraphPPI();
		if (this.getGraphs().getActiveTab().getItemId()=='ppiTab' && graph.masked) return;
		if (this.getGraphs().getActiveTab().getItemId()=='ttiTab') graph=this.getGraphTTI();
		
		// preventing infinite bounceback between grid and graph select listeners
		breakChain=true;
		
		// make sure we address all currently selected rows in the grid
		var selectedInGrid = selModel.getSelection();
		
		var edgeKeys={};
		var edgeIds =[];
		var nodeIds =[];
		var nodeKeys={};
		
		// select graph edges
		if (GraphConfig.selectMode != 'nodes') {
			for (var i=0; i<selectedInGrid.length; i++) {
				var edgeId=selectedInGrid[i].get('interaction_id');
				if (this.getGraphs().getActiveTab().getItemId()=='ttiTab') {
					edgeId= selectedInGrid[i].get('taxid_a') + '-' + selectedInGrid[i].get('taxid_b');
					var edgeIdR= selectedInGrid[i].get('taxid_b') + '-' + selectedInGrid[i].get('taxid_a');
					if (!edgeKeys.hasOwnProperty(edgeIdR)) {
						edgeIds.push(edgeIdR);
						edgeKeys[edgeIdR]=1;
					}
				}
				if (!edgeKeys.hasOwnProperty(edgeId)) {
					edgeIds.push(edgeId);
					edgeKeys[edgeId]=1;
				}
			}
			
			graph.vis.deselect('edges');
			graph.vis.select('edges', edgeIds);
		}
		
		// select graph nodes
		if (GraphConfig.selectMode != 'edges') {
			for (var i=0; i<selectedInGrid.length; i++) {
				var ida=selectedInGrid[i].get('interactor_a');
				var idb=selectedInGrid[i].get('interactor_b');
				if (this.getGraphs().getActiveTab().getItemId()=='ttiTab') {
					ida=selectedInGrid[i].get('taxon_a');
					idb=selectedInGrid[i].get('taxon_b');
				}
				
				if (!nodeKeys.hasOwnProperty(ida)) {
					nodeIds.push(ida);
					nodeKeys[ida]=1;
				}
				if (!nodeKeys.hasOwnProperty(idb)) {
					nodeIds.push(idb);
					nodeKeys[idb]=1;
				}
			}

			graph.vis.deselect('nodes');
			graph.vis.select('nodes', nodeIds);
		}
		
	},
	
	/**
	 * Handles a mouse click on the graph background by deselecting all grid rows.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 */
	onGraphBackgroundClick: function() {
		//console.log('onGraphBackgroundClick fired!');
		
		var grid=Util.getController().getGridPPI();
		grid.suspendEvents(false);
		grid.getSelectionModel().suspendEvents(false);
		grid.getSelectionModel().deselectAll();
		grid.getSelectionModel().resumeEvents();
		grid.resumeEvents();
	},
	
	/**
	 * Handles the selection of PPI graph edges by selecting the corresponding 
	 * rows in the grid.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 * @param {Object} evt The event object passed from the graph.
	 */
	onGraphEdgeSelect_PPI: function(evt) {
		//console.log('onGraphEdgeSelect_PPI fired!');
		
		// discover the selection mode
		if (!GraphConfig.hasOwnProperty('selectMode')) 
			GraphConfig.selectMode='edges';
		if (GraphConfig.selectMode=='none') return;
		
		// preventing infinite bounceback between grid and graph select listeners
		if (breakChain) {
			breakChain=false;
			return;
		}
		
		var grid =Util.getController().getGridPPI();
		var store=Util.getController().getPPIsStore();
		var graph=Util.getController().getGraphPPI();
		
		// get all the selected edge (interaction) ids
		var selected=evt.target;
		var selectEdgeIds={};
		for (var i=0; i<selected.length; i++) {
			selectEdgeIds[selected[i].data.id]=1;
		}
		
		var gridKeys   ={};
		var gridRecords=[];
		
		//loop thru the selected edge ids and find the matching records in the PPI store
		for (var edgeId in selectEdgeIds) {
			if (!selectEdgeIds.hasOwnProperty(edgeId)) continue;
			
			var mca=store.query('interaction_id',edgeId,false,false,true);
			for (var i=0; i<mca.length; i++) {
				if (!gridKeys.hasOwnProperty(mca.items[i].data['interaction_id'])) {
					gridRecords.push(mca.items[i]);
					gridKeys[mca.items[i].data['interaction_id']]=1;
				}
			}
		}
		
		// if the select mode dictates, also select edge nodes in the graph
		var nodeKeys={};
		var nodeIds =[];
		if (GraphConfig.selectMode != 'edges') {
			for (var i=0; i<gridRecords.length; i++) {
				var ida=gridRecords[i].data['interactor_a'];
				if (!nodeKeys.hasOwnProperty(ida)) {
					nodeIds.push(ida);
					nodeKeys[ida]=1;
				}
				var idb=gridRecords[i].data['interactor_b'];
				if (!nodeKeys.hasOwnProperty(idb)) {
					nodeIds.push(idb);
					nodeKeys[idb]=1;
				}
			}
		}
		
		// suspend all events from grid
		grid.suspendEvents(false);
		grid.getSelectionModel().suspendEvents(false);
		
		// select all the interactions in the grid
		grid.getSelectionModel().deselectAll();
		grid.getSelectionModel().select(gridRecords);
		
		// also select the nodes in the graph(s), if appropriate
		if (nodeIds.length>0) graph.vis.select('nodes', nodeIds);
		
		// resume all events from the grid
		grid.getSelectionModel().resumeEvents();
		grid.resumeEvents();
		
	},
	
	/**
	 * Handles the selection of TTI graph edges by selecting the corresponding 
	 * rows in the grid.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 * @param {Object} evt The event object passed from the graph.
	 */
	onGraphEdgeSelect_TTI: function(evt) {
		//console.log('onGraphEdgeSelect_TTI fired!');
		
		// discover the selection mode
		if (!GraphConfig.hasOwnProperty('selectMode')) 
			GraphConfig.selectMode='edges';
		if (GraphConfig.selectMode=='none') return;
		
		// preventing infinite bounceback between grid and graph select listeners
		if (breakChain) {
			breakChain=false;
			return;
		}
		
		var grid =Util.getController().getGridPPI();
		var store=Util.getController().getPPIsStore();
		var graph=Util.getController().getGraphTTI();
		
		// get all the selected edge (interaction) ids
		var selected=evt.target;
		var selectEdgeIds={};
		for (var i=0; i<selected.length; i++) {
			selectEdgeIds[selected[i].data.id]=1;
		}
		
		var gridKeys   ={};
		var gridRecords=[];
		
		//loop thru the selected edge ids and find the matching records in the PPI store
		for (var edgeId in selectEdgeIds) {
			if (!selectEdgeIds.hasOwnProperty(edgeId)) continue;
			var taxids = edgeId.split('-');
			var mca=store.query('taxid_a',taxids[0],false,false,true);
			for (var i=0; i<mca.length; i++) {
				if (mca.items[i].data['taxid_b']==taxids[1]) {
					if (!gridKeys.hasOwnProperty(mca.items[i].data['interaction_id'])) {
						gridRecords.push(mca.items[i]);
						gridKeys[mca.items[i].data['interaction_id']]=1;
					}
				}
			}
			var mcaR=store.query('taxid_b',taxids[0],false,false,true);
			for (var i=0; i<mcaR.length; i++) {
				if (mcaR.items[i].data['taxid_a']==taxids[1]) {
					if (!gridKeys.hasOwnProperty(mcaR.items[i].data['interaction_id'])) {
						gridRecords.push(mcaR.items[i]);
						gridKeys[mcaR.items[i].data['interaction_id']]=1;
					}
				}
			}
		}
		
		// if the select mode dictates, also select edge nodes in the graph
		var nodeKeys={};
		var nodeIds =[];
		if (GraphConfig.selectMode != 'edges') {
			for (var i=0; i<gridRecords.length; i++) {
				var ida=gridRecords[i].data['taxon_a'];
				if (!nodeKeys.hasOwnProperty(ida)) {
					nodeIds.push(ida);
					nodeKeys[ida]=1;
				}
				var idb=gridRecords[i].data['taxon_b'];
				if (!nodeKeys.hasOwnProperty(idb)) {
					nodeIds.push(idb);
					nodeKeys[idb]=1;
				}
			}
		}
		
		// suspend all events from grid
		grid.suspendEvents(false);
		grid.getSelectionModel().suspendEvents(false);
		
		// select all the interactions in the grid
		grid.getSelectionModel().deselectAll();
		grid.getSelectionModel().select(gridRecords);
		
		// also select the nodes in the graph(s), if appropriate
		if (nodeIds.length>0) graph.vis.select('nodes', nodeIds);
		
		// resume all events from the grid
		grid.getSelectionModel().resumeEvents();
		grid.resumeEvents();
		
	},
	
	/**
	 * Handles a select event on a graph node.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 * @param {Object} evt The fired event Object.
	 */
	onGraphNodeSelect: function(evt) {
		console.log('onGraphNodeSelect fired!');
		console.log(evt);
	},
	

	/**
	 * Updates the detection method filter checkboxes to reflect data in the 
	 * MethodsStore. This function is called from a load listener attached to 
	 * the store.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 * @param {Ext.data.Store} store The store being loaded.
	 * @param {Ext.data.Model[]} records Array of loaded records.
	 * @param {boolean} successful Whether or not the load was successful.
	 * @param {Object} opts Listener options.
	 */
	setMethodFilters: function(store, records, successful, opts) {
		//console.log("setMethodFilters");
				
		var store = this.getMethodsStore();
		var mFilt = this.getMethodFilterBoxes();
		
		var checked={};
		var boxes=this.getMethodFilterBoxes().items.items;
		for (var i=0; i<boxes.length; i++) {
			if (boxes[i].getValue()) checked[boxes[i].inputValue]=1;
		}

		mFilt.removeAll();
		
		store.each(function(rec){
			var state=false;
			if (checked.hasOwnProperty(rec.get('id'))) state=true;
			mFilt.add({
				boxLabel: rec.get('name') +' ('+ rec.get('count') + ')',
				name:'methodBoxes',
				inputValue: rec.get('id'),
				checked: state
			});
		});
		
		// update the box title to show the total count
		var count=this.getMethodsStore().getTotalCount();
		this.getMethodFilterHeader().setText('<b>Detection Methods (' +count+ ')<\/b>');
	},
	
	/**
	 * Writes the interaction type filter checkboxes using current data in the 
	 * TypesStore. This function is called from a load listener attached to 
	 * the store.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 * @param {Ext.data.Store} store The store being loaded.
	 * @param {Ext.data.Model[]} records Array of loaded records.
	 * @param {boolean} successful Whether or not the load was successful.
	 * @param {Object} opts Listener options.
	 */
	setTypeFilters: function(store, records, successful, opts) {
		//console.log("setTypeFilters");

		var store = this.getTypesStore();
		var tFilt = this.getTypeFilterBoxes();

		var checked={};
		var boxes=this.getTypeFilterBoxes().items.items;
		for (var i=0; i<boxes.length; i++) {
			if (boxes[i].getValue()) checked[boxes[i].inputValue]=1;
		}
		tFilt.removeAll();

		store.each(function(rec){
			var state=false;
			if (checked.hasOwnProperty(rec.get('id'))) state=true;
			tFilt.add({
				boxLabel: rec.get('name') +' ('+ rec.get('count') + ')',
				name:'typeBoxes',
				inputValue: rec.get('id'),
				checked: state
			});
		});

		// update the box title to show the total count
		var count=this.getTypesStore().getTotalCount();
		this.getTypeFilterHeader().setText('<b>Interaction Types (' +count+ ')<\/b>');

	},
	
	/**
	 * Handle a detection method filter checkbox change event.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 * @param {Ext.form.Field.Checkbox} cbox The checkbox object.
	 * @param {Boolean} newVal The new value.
	 * @param {Boolean} oldVal The old value.
	 * @param {Object} options Configurable listener options.
	 */
	onMethodFilterCheck: function(cbox, newVal, oldVal, opts) {
		//console.log(cbox.inputValue+' in '+ cbox.name+ ' is now '+newVal);
		
		// suspendEvents won't work so using this kludge to handle a resetAll
		if (suspendFilters) return;
		
		// update ViewerConfig based on the selected checkboxes
		var mboxes    =this.getMethodFilterBoxes().items.items;
		var mChecked  =['eq'];
		var mUnchecked=['ne'];
		
		for (var i=0; i<mboxes.length; i++) {
			var checked=mboxes[i].checked;
			var val=mboxes[i].inputValue;
			if (checked) {
				mChecked.push(val);
			} else {
				mUnchecked.push(val);
			}
		}
		
		ViewerConfig.mids=mChecked;
		
		/*
		if (mUnchecked.length < mChecked.length) {
			ViewerConfig.mids=mUnchecked;
		} else {
			ViewerConfig.mids=mChecked;
		}
		*/
		
		if (mChecked.length>1) 
			filterTrigger=cbox.name;
		
		// reset page to 1 and request the new data
		ViewerConfig.page=1;
		this.requestData();
	},

	/**
	 * Handle an interaction type filter checkbox change event.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 * @param {Ext.form.Field.Checkbox} cbox The checkbox object.
	 * @param {Boolean} newVal The new value.
	 * @param {Boolean} oldVal The old value.
	 * @param {Object} options Configurable listener options.
	 */
	onTypeFilterCheck: function(cbox, newVal, oldVal, opts) {
		//console.log(cbox.inputValue+' in '+ cbox.name+ ' is now '+newVal);
		
		// suspendEvents won't work so using this kludge to handle a resetAll
		if (suspendFilters) return;

		// update ViewerConfig based on the selected checkboxes
		var tboxes    =this.getTypeFilterBoxes().items.items;
		var tChecked  =['eq'];
		var tUnchecked=['ne'];
		
		for (var i=0; i<tboxes.length; i++) {
			var checked=tboxes[i].checked;
			var val=tboxes[i].inputValue;
			if (checked) {
				tChecked.push(val);
			} else {
				tUnchecked.push(val);
			}
		}
		
		ViewerConfig.tids=tChecked;
		/*
		if (tUnchecked.length < tChecked.length) {
			ViewerConfig.tids=tUnchecked;
		} else {
			ViewerConfig.tids=tChecked;
		}
		*/
		
		if (tChecked.length>1) 
			filterTrigger=cbox.name;
		
		// reset grid page to 1 and request new data
		ViewerConfig.page=1;
		this.requestData();
	},

	/**
	 * Unchecks all detection method filter checkboxes and requests the new data.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 */
	clearAllMethodFilters: function() {
	
		// disable listeners first!
		this.getMethodFilterBoxes().suspendEvents(false);
		suspendFilters=true;

		var mboxes=this.getMethodFilterBoxes().items.items;
		for (var i=0; i<mboxes.length; i++) {
			mboxes[i].setValue(false);
		}
		ViewerConfig.mids=[];
		
		// now re-enable listeners
		this.getMethodFilterBoxes().resumeEvents();
		suspendFilters=false;

		// reset page to 1 and request new data
		ViewerConfig.page=1;
		this.requestData();
	},
	
	/**
	 * Unchecks all interaction type filter checkboxes and requests the new data.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 */
	clearAllTypeFilters: function() {
	
		// disable listeners first!
		this.getTypeFilterBoxes().suspendEvents(false);
		suspendFilters=true;
		
		var tboxes=this.getTypeFilterBoxes().items.items;
		for (var i=0; i<tboxes.length; i++) {
			tboxes[i].setValue(false);
		}
		ViewerConfig.tids=[];
		
		// now re-enable listeners
		this.getTypeFilterBoxes().resumeEvents();
		suspendFilters=false;

		// reset page to 1 and request new data
		ViewerConfig.page=1;
		this.requestData();
	},


	/**
	 * This function updates the PPI graph when new data is loaded; i.e., via a 
	 * facet filtering event. It also decides whether or not to view the PPI graph 
	 * or mask it, according to ViewerConfig.maxPPI.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 */
	updateGraphView_PPI: function() {
		//console.log('updateGraphView_PPI fired!');
		
		this.updateStatusMsg();

		// can only apply the changes to the vis if it is in the active tab
		if (this.getGraphs().getActiveTab().getItemId()=='ppiTab') {
		
			var store=this.getPPIsStore();
			var graph=this.getGraphPPI();
		
			if (graph.maskable) {
				// if the original data exceeds maxPPI, can only reset the PPI Graph each time
				if (store.getTotalCount()>ViewerConfig.maxPPI) {
					if (!graph.masked) {
						graph.reset();
						graph.mask();
					}
				} else {
					graph.unmask();
					this.createGraph_PPI();
				}
			} else {
				var bypass=graph.createVisualBypass(store);
				graph.vis.visualStyleBypass(null);
				graph.vis.visualStyleBypass(bypass);
			}
		}
		
	},
	
	/**
	 * This function updates the TTI graph when new data is loaded; i.e., via a 
	 * facet filtering event.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 */
	updateGraphView_TTI: function() {
		//console.log('updateGraphView_TTI fired!');

		// can only apply the changes to the vis if it is in the active tab
		if (this.getGraphs().getActiveTab().getItemId()=='ttiTab') {

			var store =this.getTTIsStore();
			var graph =this.getGraphTTI();

			var bypass=graph.createVisualBypass(store);
		
			graph.vis.visualStyleBypass(null);
			graph.vis.visualStyleBypass(bypass);
		}
		
	},
	

	/**
	 * This function updates the status message whenever new data is loaded.
	 *
	 * @author Timothy Driscoll
	 * @version 3.0
	 */
	updateStatusMsg: function() {
		var msg ='Showing <b>' + this.getPPIsStore().getTotalCount() + '<\/b> ';
		if (ViewerConfig.hpisOnly) msg += 'HP-';
		msg += 'PPIs, involving ';
		if (ViewerConfig.btwnOnly)
			msg += 'only ';
		else
			msg += 'any ';
		
		msg += 'selected organisms';
		this.getStatusMsg().setText(msg);
	},
	

	/*
	activateCountTimer: function() {
		clearTimeout(countTimer);
		countTimer=setTimeout(function(){
			var controller=_myAppGlobal.getController('Interactions');
			//console.log(controller);
			controller.getNewCount(controller);
		}, 500);
	},
	
	getNewCount: function(x) {
		var src=this;
		if (x) src=x;
		
		src.getUpdateViewButton().disable();
		src.getUpdateReporter().setText('<img src="resources/images/loading-animated-spokes.gif" width=12 height=12 />  PPIs on update');
		
		var keywds=escape(src.getKeywordFilter().getRawValue());
		
		Ext.Ajax.request({
			url: Connect.makeCountRequestURL({
				taxids  : ViewerConfig.taxids,
				keywds  : keywds,
				hpisOnly: ViewerConfig.hpisOnly,
				btwnOnly: ViewerConfig.btwnOnly,
				noMethod: ViewerConfig.noMethod,
				noType  : ViewerConfig.noType,
			}),
			params: {},
			disableCaching: false,
			headers: {
			'Accept': 'application/json'
			},
			success: function(response){
				// responseText should be in json format
				var jsonStr = response.responseText;
				var json=Ext.JSON.decode(jsonStr);
				//console.log(json);
				//if (json.totalRows>0 && json.totalRows != src.getPPIsStore().getTotalCount()) {
					src.getUpdateViewButton().enable();
					var label='PPIs';
					if (ViewerConfig.hpisOnly) label='HPIs';
					var updateStr=json.totalRows+ ' ' +label+ ' on update';
					src.getUpdateReporter().setText(updateStr);
				//} else {
				//	src.getUpdateViewButton().disable();
				//	src.getUpdateReporter().setText('');
				//}
			},
			scope: src
		});

	},
	*/
	
	
	downloadAsMitab: function() {
	},
	
	downloadAsTable: function() {
	}
	
});
