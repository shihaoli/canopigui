'use strict';

describe('Testing partition', function(){
 
 
    beforeEach(module('canopi.filter'));
  
    it('should have a partition filter', inject(function($filter) {
        //Checking if filter is available.
        expect($filter('partition')).not.toBeNull();
    }));
    
    it('should partition data', inject(function($filter) {
        //Splitting the array into partitions of 2
        expect($filter('partition')([4,5,6,7,8,9], 2)).toEqual([[4,5],[6,7],[8,9]]);
        //Checking for partitions of 3 with remaining values
        expect($filter('partition')([4,5,6,7], 3)).toEqual([[4,5,6],[7]]);
        // Checking for null partitions
        expect($filter('partition')()).toEqual(null);
    }));

});

