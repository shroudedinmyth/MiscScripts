Array.prototype.lastIndexOf = function(searchElement, fromIndex) {
	var index = fromIndex !== null && fromIndex !== undefined && fromIndex > 0 && fromIndex < this.length ? fromIndex : this.length - 1;
	
	for (; index >= 0; index--) {
		if (this[index] === searchElement) {
			return index;
		}
	}
	
	return -1;
};

Array.prototype.filter = function(callback) {
	var filtered = [];
	for (var i = 0; i < this.length; i++) {
		if (callback(this[i], i, this))
			filtered.push(this[i]);
	}
	return filtered;
};