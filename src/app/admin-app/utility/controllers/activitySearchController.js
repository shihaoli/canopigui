angular.module('admin.app').controller('ActivitySearchController', 
        [ '$scope', '$log', '$filter', 'picklists', 'AdminJsonService', 'UiGridUtilService',
        function ($scope, $log, $filter, picklists, AdminJsonService, UiGridUtilService) {
            
	'use strict';
	
        var vm = this;
 
        init();
        
        function init() {
            
  	    initializeVMVariables();
 	    setupVMMethods();
            
        };
        
        function  initializeVMVariables() {

            vm.woTypeCurrentSelection = [];
                
            // sort the rule category values in ascending order
            vm.activityTypes = $filter('orderBy')(picklists.activityTypes, 'name');
            vm.woTypes = $filter('orderBy')(picklists.woTypes, 'name');
            
            vm.woTypeMultiselectPickList = vm.woTypes;
            
            vm.searchAccordionOpen = true;
            
            // set maxDate to today's date
            vm.maxDate = new Date();

            
        };
        
        function setupVMMethods() {
          
            vm.openActivitiesFromDate = function($event) {
              $event.preventDefault();
              $event.stopPropagation();

              vm.openedFromDate = true;   
            };
            
            vm.openActivitiesToDate = function($event) {
              $event.preventDefault();
              $event.stopPropagation();

              vm.openedToDate = true;
            };
            
            vm.gridOptionsActivityResultsTable = {
                enableRowSelection: true,
                enableCellEditOnFocus:true,
                enableGridMenu:true,
                //enableRowSelection: true,
                //enableRowHeaderSelection: false,
                enableHorizontalScrollbar: 1,
                multiSelect: false,
                rowHeight: 45,
                //showGridFooter:true,
                //enableFooterTotalSelected:true,
                enableSorting:false,
                exporterMenuPdf: false,
                exporterMenuCsv: false,
                gridMenuCustomItems: [
                    {
                      title: 'Hide Empty Columns',
                      action: function () {
                        vm.toggleEmptyColumns(); 
                      }
                    },
                    {
                      title: 'Reset Columns',
                      action: function () {
                        vm.taskSearch(); 
                      }
                    }
                ],    
            }; 
             
            
            vm.clear = function () {
                vm.userid = '';
                vm.activityType = '';
                vm.fromDate = '';
                vm.toDate = '';
            };
            
            
            vm.activitySearch = function () {
                
                vm.displayActivitesResults = true;
                
                AdminJsonService.getActivitySearchResults().then(function(data) {

                    vm.data = UiGridUtilService.extractTableCellValues(data.tableRows);
                    vm.gridOptionsActivityResultsTable.data = vm.data;

                    var colDefs = UiGridUtilService.extractColumnDefs(data.tableRows);
                    colDefs = UiGridUtilService.autoColWidth(colDefs, data.tableRows.rowMetaData);

                    vm.gridOptionsActivityResultsTable.columnDefs = colDefs;
                    vm.gridOptionsActivityResultsTable.exporterCsvFilename = 'activities.csv';
                    
                    //HIDE ID COLUMN
                    for (var i = 0; i < vm.gridOptionsActivityResultsTable.columnDefs.length; i++) {                      
                        if (vm.gridOptionsActivityResultsTable.columnDefs[i].id === 'id') {
                            vm.gridOptionsActivityResultsTable.columnDefs[i].enableHiding = false;
                            break;
                        }
                    }
                    

                });
            };
            
            
            /**
             * Workaround to filter on all columns
             * @todo Remove this when ui-grid provides it natively
             */
            vm.refreshData = function (filter) {
                vm.gridOptionsActivityResultsTable.data = vm.data;
                while (filter) {
                    var oSearchArray = filter.split(' ');
                    vm.gridOptionsActivityResultsTable.data = $filter('filter')(vm.gridOptionsActivityResultsTable.data, oSearchArray[0], undefined);
                    oSearchArray.shift();
                    filter = (oSearchArray.length !== 0) ? oSearchArray.join(' ') : '';
                }
            };

        };
        
        
}]);

