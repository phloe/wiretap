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
			
			wiretap.queue.push({
				name: name,
				arguments: arguments
			});
			
			var ret = wiretap.methods[name].apply(this, arguments);
			
			return (ret === undefined) ? this : ret;
			
		};
		
	}
	
	var Wiretap = function (object, name, reset) {
	
		this.object = object;
		this.name = name || "[Object]";
		this.reset = reset || null;
		
		this.queue = [];
		
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
		
		record: function record (label) {
	
			for (var name in this.methods) {
				this.object[name] = this.wrapped[name];
			}
			
			return this;
			
		},
		
		stop: function stop () {
	
			for (var name in this.methods) {
				if (this.object.hasOwnProperty(name)) {
					this.object[name] = this.methods[name];	
				}
				else {
					delete this.object[name];
				}
			}
			
			return this;
			
		},
		
		play: function () {
	
			var item,
				i = 0,
				l = this.queue.length;
				
			for (; i < l; i++) {
				item = this.queue[i];
				this.methods[item.name].apply(this.object, item.arguments);
			}
			
			return this;
			
		},
		
		erase: function () {
			
			this.queue = [];
			
			return this;
			
		},
		
		transcribe: function transcribe () {
		
			var item,
				i = 0,
				l = this.queue.length,
				output = [];
				
			for (; i < l; i++) {
				item = this.queue[i];
				output.push(this.name + "." + item.name + "(" + Array.prototype.join.call(item.arguments, ", ") + ")");
			}
		
			return output.join("\n");
		},
		
		reset: function () {
		
			if (this.reset) {
				this.reset();
			}
				
			return this;
			
		}
		
	};
	

	return function (object, name, reset) {
	
		if (typeof name === "function") {
			reset = name;
			name = null;
		}
	
		return new Wiretap(object, name, reset);
		
	};

}));