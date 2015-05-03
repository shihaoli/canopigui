angular.module('canopi.service').service('HelperUtilService', function () {
	'use strict';
	
	this.isEmpty = function(str) {
		return !str || !/[^\s]+/.test(str);
	};
	
	
	this.getFormatDateString = function(theDate) {
            
		var month = theDate.getMonth()+1;
		var day = theDate.getDate();

		return (((''+month).length<2 ? '0' : '') + month + '/' +
		        ((''+day).length<2 ? '0' : '') + day + '/' + 
		        theDate.getFullYear());
	};
	
        // find end date (current date + durationInDays)
        this.getFormatEndDateString = function(theDate, durationInDays) {
		var d = new Date(theDate.getTime() + durationInDays * (1000 * 60 * 60 * 24)); 

		var month = d.getMonth()+1;
		var day = d.getDate();

		return (((''+month).length<2 ? '0' : '') + month + '/' +
		        ((''+day).length<2 ? '0' : '') + day + '/' + 
		        d.getFullYear());
	};
	
       
	
	this.getMessageAndType = function (message, type) {
		
	    /** Types: success, info, warning, error **/
	    var messageType = "info";
	    var messageIcon = "fa fa-info-circle";
		
	    if(type === "success") {
	        messageType = "alert alert-success";
	        messageIcon = "fa fa-check-circle fa-lg";
	    }
	    else if(type === "info") {
	        messageType = "alert alert-info";
	        messageIcon = "fa fa-info-circle fa-lg";
	    }
	    else if(type === "warning") {
	        messageType = "alert alert-warning";
	        messageIcon = "fa fa-exclamation-triangle fa-lg";
	    }
	    else if(type === "error") {
	        messageType = "alert alert-danger";
	        messageIcon = "fa fa-ban fa-lg";
	    }
	    
	    return {
	        "message": message,
	        "type": messageType,
	        "icon": messageIcon
	    };
	};
	
	//For Datatables to Trigger, pass the resultData object(The actual object to pass to datatable directive) 
	//and responseObject( which has the tableRows and it needs to processed)
	this.processResponseResultForDatatable = function(resultData, responseData) {
		resultData.tableDefinition={};
		resultData.loadTrigger = 0;
		resultData.tableDefinition=responseData.tableRows;
		resultData.loadTrigger++;
	};

});
