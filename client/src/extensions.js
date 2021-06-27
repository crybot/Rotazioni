
// check if an element exists in array using a comparer function
// comparer : function(currentElement)
// eslint-disable-next-line no-extend-native
Array.prototype.inArray = function(element) { 
  for(var i=0; i < this.length; i++) { 
    if(element === this[i]) return true; 
  }
  return false; 
}; 

// adds an element to the array if it does not already exist using a comparer 
// function
// eslint-disable-next-line no-extend-native
Array.prototype.pushIfNotPresent = function(element) { 
  if (!this.inArray(element)) {
    this.push(element);
  }
};
