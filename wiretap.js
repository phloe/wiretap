(function (root, factory) {
	if (typeof exports === "object") {
		module.exports = factory();
	}
	else if (typeof define === "function" && define.amd) {
		define("wiretap", factory);
	}
	else {
		root.wiretap = factory();
	}
}(this, function () {

	function wrap (wiretap, name) {
	
		return function () {
			
			wiretap.tapes[wiretap.label].push({
				name: name,
				arguments: arguments
			});
			
			var ret = wiretap.methods[name].apply(this, arguments);
			
			return (ret === undefined) ? this : ret;
			
		};
		
	}
	
	var Wiretap = function (object, name, cleanup) {
	
		this.object = object;
		this.name = name || "[Object]";
		this.cleanup = cleanup || function () {
			return this;
		};
			
		this.label = 0;
		
		this.tapes = {
			0: []
		};
		
		this.methods = {};
		this.wrapped = {};
	
		for (var name in this.object) {
			if (typeof this.object[name] == "function") {
				this.methods[name] = this.object[name];
				this.wrapped[name] = wrap(this, name);
			}
		}
		
	};
	
	Wiretap.prototype = {
		
		record: function (label) {
	
			label = label || 0;
	
			if (label) {
				this.label = label;
				if (!(label in this.tapes)) {
					this.tapes[label] = [];
				}
			}
	
			for (var name in this.methods) {
				this.object[name] = this.wrapped[name];
			}
			
			return this;
			
		},
		
		stop: function (label) {
	
			for (var name in this.methods) {
				if (this.object.hasOwnProperty(name)) {
					this.object[name] = this.methods[name];	
				}
				else {
					delete this.object[name];
				}
			}
			
			this.label = 0;
			
			return this;
			
		},
		
		play: function (label) {
	
			label = label || 0;
	
			var item,
				i = 0,
				l = this.tapes[label].length;
				
			for (; i < l; i++) {
				item = this.tapes[label][i];
				this.methods[item.name].apply(this.object, item.arguments);
			}
			
			return this;
			
		},
		
		erase: function (label) {
			
			label = label || 0;
			
			this.tapes[label] = [];
			
			return this;
			
		},
		
		transcribe: function (label) {
			
			label = label || 0;
		
			var item,
				args,
				i = 0,
				l = this.tapes[label].length,
				j, k,
				output = [];
				
			for (; i < l; i++) {
				item = this.tapes[label][i];
				args = Array.prototype.slice.call(item.arguments);
				for (j = 0, k = args.length; j < k; j++) {
					args[j] = JSON.stringify(args[j]);
				}
				output.push(this.name + "." + item.name + "(" + args.join(", ") + ")");
			}
		
			return output.join("\n");
		}
		
	};
	

	return function (object, name, cleanup) {
	
		if (typeof name === "function") {
			cleanup = name;
			name = null;
		}
	
		return new Wiretap(object, name, cleanup);
		
	};

}));