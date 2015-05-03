'use strict';

angular.module('admin.app').controller('MobilityOrdersController',
    ['$scope', '$templateCache', 'uiGridExporterConstants', '$log', '$q', '$interval', 'orderPicklists', 'AdminJsonService', 'UiGridUtilService', 'MessagesService',
        function ($scope, $templateCache, uiGridExporterConstants, $log, $q, $interval, orderPicklists, AdminJsonService, UiGridUtilService, MessagesService) {

            // Revert templateCache
            $templateCache.put('ui-grid/selectionRowHeader',
                "<div class=\"ui-grid-disable-selection\"><div class=\"ui-grid-cell-contents\"><ui-grid-selection-row-header-buttons></ui-grid-selection-row-header-buttons></div></div>"
            );

            var vm = this;

            init();


            function init() {

                initializeVMVariables();
                
                // For New WO Template
                setupUiGridForNewWOTemplate();

                // For Order Search
                setupUiGridForSearchResults();
                setupUiGridForSelectedWO();
                setupUiGridForTaskList();
                setupUiGridForAddTask();
                setupUiGridForUDA();
                setupUiGridForLinks();

                setupVMMethods();
            }


            function initializeVMVariables() {

                vm.poTypeCurrentSelection = [];
                vm.woTypeCurrentSelection = [];
                
                vm.poTypeMultiselectPickList = orderPicklists.poTypes;
                vm.woTypeMultiselectPickList = orderPicklists.woTypes;
            
                vm.displayNewWOTemplateTableFlag = false;
                vm.displayChildTablesForNewWOTemplateFlag = false;
                
                vm.displaySearchResultsTableFlag = false;
                vm.displayOrderDetailsFlag = false;

                // this object will be populated in
                // orderPicklists => { poTypes, woTypes }
                vm.addWoTemplateButtonDisabled = true;
                vm.searchButtonDisabled = true;
                vm.clearButtonDisabled = true;

                vm.searchAccordionOpen = true;
                vm.searchResultsOpen = true;
                vm.orderPicklists = orderPicklists;
                vm.poType = orderPicklists.poTypes;
                vm.woType = orderPicklists.woTypes;

                //TOP TABLE 1
                vm.gridOptionsSearchResults = {};

                //Selected WO
                vm.gridOptionsSelectedWO = {};

                //MIDDLE TABLE 2
                vm.gridOptionsTaskListTable = {};
                //BOTTOM TABLE 3
                vm.gridOptionsUDATable = {};

                vm.isLoading = true;

                vm.testit = function () {
                    $log.debug("Test it ...");
                }

                vm.uiGridExporterConstants = uiGridExporterConstants;

            }



            function setupUiGridForNewWOTemplate() {
                
                vm.gridOptionsNewWOTemplateTable = {
                    enableCellEditOnFocus: true,
                    enableRowSelection: true,
                    enableHorizontalScrollbar: 0,
                    rowEditWaitInterval: -1,
                    multiSelect: false,
                    rowHeight: 45,
                    enableSorting: false,
                    enableGridMenu: true,
                    enableHiding: false,
                    exporterCsvFilename : 'newWOTemplate.csv',
                    exporterMenuPdf: false,
                    onRegisterApi: function (gridApi) {
                        vm.gridApiNewWOTemplate = gridApi;
                        // Register events
                        gridApi.edit.on.beginCellEdit($scope, beginCellEdit);
                        gridApi.edit.on.afterCellEdit($scope, afterCellEdit);
           
                        gridApi.rowEdit.on.saveRow($scope, saveRow);
                        gridApi.selection.on.rowSelectionChanged($scope, rowSelectionChangedNewWOTemplate);
                        //saving inline edited rows
                        //gridApi.rowEdit.on.saveRow($scope, saveRow);
                    }
                };

                // Handle grid events
                function beginCellEdit(rowEntity) {
                   // vm.gridApi.selection.clearSelectedRows();
                   // vm.gridApi.selection.selectRow(rowEntity);

                    // Save row for undo
                    vm.undoRow = angular.copy(rowEntity);
                    vm.isEditing = true;
                }

                function afterCellEdit(rowEntity) {
                    vm.isEditing = false;
                }

                function rowSelectionChangedNewWOTemplate(row) {
                    vm.selectedRowNewWOTemplate = row.isSelected ? row.entity : false;
                    displayChildTablesForNewWOTemplate(row.entity.woType);
                }
                
                
                function displayChildTablesForNewWOTemplate(woType) {
                    
                    // set up the child tables for New WO Tempalte
                    setupUiGridForNewTaskList(woType);
                    setupUiGridForNewUDA(woType);
                    setupUiGridForNewLinks(woType);
                    
                    // display new tables with empty data
                    vm.displayNewTaskListTable();
                    vm.displayNewUDATable();
                    vm.displayNewLinksTable();

                    // enable the display of the child tables
                    vm.displayChildTablesForNewWOTemplateFlag = true;
                }


                function saveRow(rowEntity) {
                     $log.debug("Saving row");
                }

                vm.displayNewWOTemplateTable = function() {
    
                    AdminJsonService.getWoTemplateColumnDefs().then(function (data) {
      
                        var tableData = data.tableRows;

                        var colDefs = UiGridUtilService.extractColumnDefs(tableData);

                        colDefs = UiGridUtilService.autoColWidth(colDefs, tableData.rowMetaData);

                        vm.gridOptionsNewWOTemplateTable.columnDefs = colDefs;
       
                        vm.gridOptionsNewWOTemplateTable.data = UiGridUtilService.extractTableCellValues(tableData);

                        vm.gridOptionsNewWOTemplateTable.exporterCsvFilename = 'newWOTemplate.csv';

                        vm.displayNewWOTemplateTableFlag = true;
                        
                        //HIDE ID COLUMN
                        for (var i = 0; i < vm.gridOptionsNewWOTemplateTable.columnDefs.length; i++) {                      
                            if (vm.gridOptionsNewWOTemplateTable.columnDefs[i].id === 'id') {
                                vm.gridOptionsNewWOTemplateTable.columnDefs[i].enableHiding = false;
                                break;
                            }
                        }
                    });
                }


                // TODO: define all the functions needed for New WO Template add/update operations
                vm.newWOTemplate = {

                    saveNewWOTemplate: function () {
                        if (vm.selectedRowNewWOTemplate) {
                            vm.selectedIndex = vm.gridOptionsNewWOTemplateTable.data.lastIndexOf(vm.selectedRowNewWOTemplate);
                            vm.gridOptionsNewWOTemplateTable.data.splice(vm.selectedIndex + 1, 0, {});
                        }
                        else {
                            var newItem = {};
                            vm.gridOptionsNewWOTemplateTable.data.push(newItem);
                       }
                    },

                    updatNewWOTemplate: function () {

                    },

                    cancel: function () {

                    },
                  
        
                    addNewWOTemplate: function () {
                                            
                        if (vm.selectedRowNewWOTemplate) {
                            vm.selectedIndex = vm.gridOptionsNewWOTemplateTable.data.lastIndexOf(vm.selectedRowNewWOTemplate);
                            vm.gridOptionsNewWOTemplateTable.data.splice(vm.selectedIndex + 1, 0, {});
                            vm.gridApiNewWOTemplate.core.refreshRows().then(function () {
                                vm.selectedIndex = vm.selectedIndex+1;
                                vm.gridApiNewWOTemplate.core.scrollTo(vm.gridOptionsNewWOTemplateTable.data[vm.selectedIndex], vm.gridOptionsNewWOTemplateTable.columnDefs[0]);
                                //Alternate to scrollTo - same behavior for now
                                //vm.gridApi.cellNav.scrollToFocus( vm.gridOptions.data[vm.selectedIndex], vm.gridOptions.columnDefs[0]);                        
                                vm.gridApiNewWOTemplate.selection.selectRow(vm.gridOptionsNewWOTemplateTable.data[vm.selectedIndex]); 
                            }); 
                        }
                        else {
                            vm.gridOptionsNewWOTemplateTable.data.push({"woType": "", "woDescription": ""});
                            vm.gridApiNewWOTemplate.core.refreshRows().then(function () {
                                var lastRowIndex = vm.gridOptionsNewWOTemplateTable.data.length-1;
                                vm.gridApiNewWOTemplate.core.scrollTo(vm.gridOptionsNewWOTemplateTable.data[lastRowIndex], vm.gridOptionsNewWOTemplateTable.columnDefs[0]);
                                //Alternate to scrollTo - same behavior for now
                                //vm.gridApi.cellNav.scrollToFocus(vm.gridOptions.data[lastRowIndex], vm.gridOptions.columnDefs[0]);
                                vm.gridApiNewWOTemplate.selection.selectRow(vm.gridOptionsNewWOTemplateTable.data[lastRowIndex]); 
                            });
                        }
                    },
                    
                    removeNewWOTemplate: function () {
                       vm.gridOptionsNewWOTemplateTable.data.splice(vm.gridOptionsNewWOTemplateTable.data.lastIndexOf(vm.selectedRowNewWOTemplate), 1);
                    },
                    
                    export:function(){
                        vm.gridApiNewWOTemplateexporter.csvExport(vm.uiGridExporterConstants.ALL, vm.uiGridExporterConstants.ALL);
                    }
                  
                };
            }

      
      
      
            function setupUiGridForNewTaskList(woType) {
                
                vm.gridOptionsNewTaskListTable = {
                    enableCellEditOnFocus: true,
                    enableRowSelection: true,
                    //enableRowHeaderSelection: false,
                    enableHorizontalScrollbar: 0,
                    rowEditWaitInterval: -1,                    
                    multiSelect: false,
                    rowHeight: 45,
                    enableSorting: false,
                    enableGridMenu: true,
                    enableHiding: false,
                    data: [],
                    exporterCsvFilename : 'newTaskList.csv',
                    exporterMenuPdf: false,
                    onRegisterApi: function (gridApi) {
                        vm.gridApiNewTaskList = gridApi;
                        gridApi.selection.on.rowSelectionChanged($scope, rowSelectionChangedNewTaskList);
                        //saving inline edited rows
                        //gridApi.rowEdit.on.saveRow($scope, saveRow);
                    }
                };

                
                
                function rowSelectionChangedNewTaskList(row) {
                    vm.selectedRowNewTaskList = row.entity;

                }
                
                
                vm.displayNewTaskListTable = function() {
    
                    AdminJsonService.getTaskListColumnDefs().then(function (data) {
      
                        var tableData = data.tableRows;

                        vm.gridOptionsNewTaskListTable.data = UiGridUtilService.extractTableCellValues(tableData);

                        var colDefs = UiGridUtilService.extractColumnDefs(tableData);

                        colDefs = UiGridUtilService.autoColWidth(colDefs, tableData.rowMetaData);

                        vm.gridOptionsNewTaskListTable.columnDefs = colDefs;
     
                        vm.gridOptionsNewTaskListTable.exporterCsvFilename = 'newTaskList.csv';
                        
                        //HIDE ID COLUMN
                        for (var i = 0; i < vm.gridOptionsNewTaskListTable.columnDefs.length; i++) {                      
                            if (vm.gridOptionsNewTaskListTable.columnDefs[i].id === 'id') {
                                vm.gridOptionsNewTaskListTable.columnDefs[i].enableHiding = false;
                                break;
                            }
                        }

                    });
                }
                
                
                vm.newTasklist = {

                    moveSelectedUp: function () {

                        vm.selectedIndex = vm.gridOptionsNewTaskListTable.data.lastIndexOf(vm.selectedRowNewTaskList);
                        if (vm.previousIndex > -1) {

                            vm.previousIndex = vm.selectedIndex - 1;
                            vm.nextIndex = vm.selectedIndex + 1;

                            vm.previousRowData = vm.gridOptionsNewTaskListTable.data[vm.previousIndex];

                            vm.nextRowData = vm.gridOptionsNewTaskListTable.data[vm.nextIndex];

                            vm.gridOptionsNewTaskListTable.data[vm.previousIndex] = vm.gridOptionsNewTaskListTable.data[vm.selectedIndex];
                            vm.gridOptionsNewTaskListTable.data[vm.selectedIndex] = vm.previousRowData;
                            vm.selectedIndex = vm.selectedIndex - 1;

                            vm.checkStart();
                            vm.checkEnd();
                        }

                        else {

                        }
                        //vm.gridApiNewTaskList.cellNav.scrollToFocus(vm.selectedRow);

                    },

                    moveSelectedDown: function () {

                        vm.selectedIndex = vm.gridOptionsTaskListTable.data.lastIndexOf(vm.selectedRowTaskList);

                        if (vm.nextIndex !== vm.gridOptionsTaskListTable.data.length) {

                            vm.previousIndex = vm.selectedIndex - 1;
                            vm.nextIndex = vm.selectedIndex + 1;

                            vm.previousRowData = vm.gridOptionsTaskListTable.data[vm.previousIndex];

                            vm.nextRowData = vm.gridOptionsTaskListTable.data[vm.nextIndex];

                            vm.gridOptionsTaskListTable.data[vm.nextIndex] = vm.gridOptionsTaskListTable.data[vm.selectedIndex];
                            vm.gridOptionsTaskListTable.data[vm.selectedIndex] = vm.nextRowData;
                            vm.selectedIndex = vm.selectedIndex + 1;

                            vm.checkEnd();
                            vm.checkStart();
                        }
                        else {
                            //vm.nextIndex = vm.selectedIndex+1;
                        }
                        //vm.gridApiTaskList.cellNav.scrollToFocus(vm.selectedRow);
                    },

                    addTask: function () {
                        MessagesService.clearMessages();
                        
                        AdminJsonService.getTasks(woType).then(function (data) {

                            var tableData = data.tableRows;

                            vm.gridOptionsAddTaskSelectTable.data = UiGridUtilService.extractTableCellValues(tableData);
                            var colDefs = UiGridUtilService.extractColumnDefs(tableData);
                            colDefs = UiGridUtilService.autoColWidth(colDefs, tableData.rowMetaData);
                            vm.gridOptionsAddTaskSelectTable.columnDefs = colDefs;

                        });
                    },

                    removeTask: function () {

                        // Remove an item
                        vm.gridOptionsNewTaskListTable.data.splice(vm.gridOptionsNewTaskListTable.data.lastIndexOf(vm.selectedRowNewTaskList), 1);

                    },

                    saveTasks: function () {

                    },

                    cancel: function () {

                    },
                    
                    recalcTaskSequence: function () {
                        
                        // this is a new task list with the re-sequenced tasks
                        var sequencedData = [];
                        var sequenceNumber = 10; // start with 10 (incremented by 10)
                       
                        var rowData;
                        
                        for (var i=0; i < vm.gridOptionsNewTaskListTable.data.length; i++) {
                            rowData = angular.copy(vm.gridOptionsNewTaskListTable.data[i]);
                            if (rowData.taskParallelToPrevious === "YES") {
                                rowData.taskSequence = sequenceNumber.toString();
                            }
                            else {
                                // the sequence should start with 10 for the table
                                if (i > 0) {
                                    sequenceNumber += 10;
                                }
                                rowData.taskSequence = sequenceNumber.toString();
                            }
                            
                            sequencedData.push(rowData);
                        }
                
                        // update data with newly calculated task sequence numbers 
                        vm.gridOptionsNewTaskListTable.data = sequencedData;
                    },

                    export: function () {
                        vm.gridApiNewTaskList.exporter.csvExport(vm.uiGridExporterConstants.ALL, vm.uiGridExporterConstants.ALL);
                    },
                    
                    addToNewTaskList: function() {
                        MessagesService.clearMessages();
                        var rowData;
                        var selectedRow = vm.gridApiAddTask.selection.getSelectedRows()[0];
                        var selectedRowExists = false;
                        if(!(selectedRow.taskCode === 'PLAN')) {
                            for (var i=0; i < vm.gridOptionsNewTaskListTable.data.length; i++) {
                                rowData = angular.copy(vm.gridOptionsNewTaskListTable.data[i]);
                                if (rowData.taskCode === selectedRow.taskCode) {
                                    selectedRowExists = true;
                                }
                            }
                        }
                        if(!selectedRowExists) {
                            vm.gridOptionsNewTaskListTable.data.push(vm.gridApiAddTask.selection.getSelectedRows()[0]);
                            $("#addTaskModal").modal('hide');
                        } else {
                            MessagesService.addMessage('Task Code ['+ selectedRow.taskCode + '] is already added to list', "warning");
                        }
                    }
                };
            }
            
            
            
            function setupUiGridForNewUDA(woType) {
                
                vm.gridOptionsNewUDATable = {
                    enableCellEditOnFocus: true,
                    enableRowSelection: true,
                    //enableRowHeaderSelection: false,
                    enableHorizontalScrollbar: 0,
                    rowEditWaitInterval: -1,                    
                    multiSelect: false,
                    rowHeight: 45,
                    enableSorting: false,
                    data: "",
                    enableGridMenu: true,
                    enableHiding: false,
                    exporterCsvFilename : 'newUDA.csv',
                    exporterMenuPdf: false,
                    onRegisterApi: function (gridApi) {
                        vm.gridApiNewUDA = gridApi;
                        gridApi.selection.on.rowSelectionChanged($scope, rowSelectionChangedNewUDA);
                        //saving inline edited rows
                        //gridApi.rowEdit.on.saveRow($scope, saveRow);
                    }
                };

                
                
                function rowSelectionChangedNewUDA(row) {
                    vm.selectedRowNewUDA = row.entity;

                }
                
                
                vm.displayNewUDATable = function() {
    
                    AdminJsonService.getUDAColumnDefs().then(function (data) {
      
                        var tableData = data.tableRows;

                        vm.gridOptionsNewUDATable.data = UiGridUtilService.extractTableCellValues(tableData);

                        var colDefs = UiGridUtilService.extractColumnDefs(tableData);

                        colDefs = UiGridUtilService.autoColWidth(colDefs, tableData.rowMetaData);

                        vm.gridOptionsNewUDATable.columnDefs = colDefs;
     
                        vm.gridOptionsNewUDATable.exporterCsvFilename = 'newUDA.csv';
                        
                        //HIDE ID COLUMN
                        for (var i = 0; i < vm.gridOptionsNewUDATable.columnDefs.length; i++) {                      
                            if (vm.gridOptionsNewUDATable.columnDefs[i].id === 'id') {
                                vm.gridOptionsNewUDATable.columnDefs[i].enableHiding = false;
                                break;
                            }
                        }

                    });
                }
                
                
                vm.newUda = {

                    saveUDA: function () {
                        if (vm.selectedRowNewUDA) {
                            vm.selectedIndex = vm.gridOptionsNewUDATable.data.lastIndexOf(vm.selectedRowNewUDA);
                            vm.gridOptionsNewUDATable.data.splice(vm.selectedIndex + 1, 0, {});
                        }
                        else {
                            vm.gridOptionsNewUDATable.data.push({"name": ""});
                        }
                    },

                    updatUDA: function () {

                    },

                    cancel: function () {

                    },

                    addUDA: function () {
                        if (vm.selectedRowNewUDA) {
                            vm.selectedIndex = vm.gridOptionsNewUDATable.data.lastIndexOf(vm.selectedRowNewUDA);
                            vm.gridOptionsNewUDATable.data.splice(vm.selectedIndex + 1, 0, {});
                            vm.gridApiNewUDA.core.refreshRows().then(function () {
                                vm.selectedIndex = vm.selectedIndex+1;
                                vm.gridApiNewUDA.core.scrollTo(vm.gridOptionsNewUDATable.data[vm.selectedIndex], vm.gridOptionsNewUDATable.columnDefs[0]);
                                //Alternate to scrollTo - same behavior for now
                                //vm.gridApiNewUDA.cellNav.scrollToFocus( vm.gridOptions.data[vm.selectedIndex], vm.gridOptions.columnDefs[0]);                        
                                vm.gridApiNewUDA.selection.selectRow(vm.gridOptionsNewUDATable.data[vm.selectedIndex]); 
                            });
                        }
                        else {
                            vm.gridOptionsNewUDATable.data.push({"name": ""});
                            vm.gridApiNewUDA.core.refreshRows().then(function () {
                                var lastRowIndex = vm.gridOptionsNewUDATable.data.length-1;
                                vm.gridApiNewUDA.core.scrollTo(vm.gridOptionsNewUDATable.data[lastRowIndex], vm.gridOptionsNewUDATable.columnDefs[0]);
                                //Alternate to scrollTo - same behavior for now
                                //vm.gridApiNewUDA.cellNav.scrollToFocus(vm.gridOptionsNewUDATable.data[lastRowIndex], vm.gridOptionsNewUDATable.columnDefs[0]);
                                vm.gridApiNewUDA.selection.selectRow(vm.gridOptionsNewUDATable.data[lastRowIndex]); 
                            });
                        }
                    },
                    export:function(){
                        vm.gridApiNewUDA.exporter.csvExport(vm.uiGridExporterConstants.ALL, vm.uiGridExporterConstants.ALL);
                    }
                  
                };
            }
            
            
            
            
            function setupUiGridForNewLinks(woType) {
                
                vm.gridOptionsNewLinksTable = {
                    enableCellEditOnFocus: true,
                    enableRowSelection: true,
                    //enableRowHeaderSelection: false,
                    enableHorizontalScrollbar: 0,
                    rowEditWaitInterval: -1,                    
                    multiSelect: false,
                    rowHeight: 45,
                    enableSorting: false,
                    enableGridMenu: true,
                    data: "",
                    enableHiding: false,
                    exporterCsvFilename : 'newLinks.csv',
                    exporterMenuPdf: false,
                    onRegisterApi: function (gridApi) {
                        vm.gridApiNewUDA = gridApi;
                        gridApi.selection.on.rowSelectionChanged($scope, rowSelectionChangedNewLinks);
                        //saving inline edited rows
                        //gridApi.rowEdit.on.saveRow($scope, saveRow);
                    }
                };

                
                
                function rowSelectionChangedNewLinks(row) {
                    vm.selectedRowNewLinks = row.entity;

                }
                
                
                vm.displayNewLinksTable = function() {
    
                    AdminJsonService.getLinksColumnDefs().then(function (data) {
      
                        var tableData = data.tableRows;

                        vm.gridOptionsNewLinksTable.data = UiGridUtilService.extractTableCellValues(tableData);

                        var colDefs = UiGridUtilService.extractColumnDefs(tableData);

                        colDefs = UiGridUtilService.autoColWidth(colDefs, tableData.rowMetaData);

                        vm.gridOptionsNewLinksTable.columnDefs = colDefs;
     
                        vm.gridOptionsNewLinksTable.exporterCsvFilename = 'newLinks.csv';
                        
                        //HIDE ID COLUMN
                        for (var i = 0; i < vm.gridOptionsNewLinksTable.columnDefs.length; i++) {                      
                            if (vm.gridOptionsNewLinksTable.columnDefs[i].id === 'id') {
                                vm.gridOptionsNewLinksTable.columnDefs[i].enableHiding = false;
                                break;
                            }
                        }

                    });
                }
                
                
                vm.newLinks = {

                    saveLink: function () {
                        if (vm.selectedRowNewLinks) {
                            vm.selectedIndex = vm.gridOptionsNewLinksTable.data.lastIndexOf(vm.selectedRowNewLinks);
                            vm.gridOptionsNewLinksTable.data.splice(vm.selectedIndex + 1, 0, {});
                        }
                        else {
                            vm.gridOptionsNewLinksTable.data.push({"name": "", "url": ""});
                        }
                    },

                    updatLink: function () {

                    },

                    cancel: function () {

                    },

                    addLink: function () {
                        if (vm.selectedRowLinks) {
                            vm.selectedIndex = vm.gridOptionsNewLinksTable.data.lastIndexOf(vm.selectedRowNewLinks);
                            vm.gridOptionsNewLinksTable.data.splice(vm.selectedIndex + 1, 0, {});
//                            vm.gridApiNewLinks.core.refreshRows().then(function () {
//                                vm.selectedIndex = vm.selectedIndex+1;
//                                vm.gridApiNewLinks.core.scrollTo(vm.gridOptionsNewLinksTable.data[vm.selectedIndex], vm.gridOptionsNewLinksTable.columnDefs[0]);
//                                //Alternate to scrollTo - same behavior for now
//                                //vm.gridApiNewLinks.cellNav.scrollToFocus( vm.gridOptionsNewLinksTable.data[vm.selectedIndex], vm.gridOptionsNewLinksTable.columnDefs[0]);                        
//                                vm.gridApiNewLinks.selection.selectRow(vm.gridOptionsNewLinksTable.data[vm.selectedIndex]); 
//                            }); 
                        }
                        else {
                            vm.gridOptionsNewLinksTable.data.push({"name": "", "url": ""});
//                            vm.gridApiNewLinks.core.refreshRows().then(function () {
//                                var lastRowIndex = vm.gridOptionsNewLinksTable.data.length-1;
//                                vm.gridApiNewLinks.core.scrollTo(vm.gridOptionsNewLinksTable.data[lastRowIndex], vm.gridOptionsNewLinksTable.columnDefs[0]);
//                                //Alternate to scrollTo - same behavior for now
//                                //vm.gridApiNewLinks.cellNav.scrollToFocus(vm.gridOptionsNewLinksTable.data[lastRowIndex], vm.gridOptionsNewLinksTable.columnDefs[0]);
//                                vm.gridApiNewLinks.selection.selectRow(vm.gridOptionsNewLinksTable.data[lastRowIndex]); 
//                            });
                        }
                    },
                    
                    removeLink: function () {
                        vm.gridOptionsNewLinksTable.data.splice(vm.gridOptionsNewLinksTable.data.lastIndexOf(vm.selectedRowNewLinks), 1);
                    },
                    
                    export:function(){
                        vm.gridApiNewLinks.exporter.csvExport(vm.uiGridExporterConstants.ALL, vm.uiGridExporterConstants.ALL);
                    }
                  
                };
            }
                


            function setupUiGridForSearchResults() {

                vm.gridOptionsSearchResults = {
                    enableRowSelection: true,
                    enableRowHeaderSelection: false,
                    enableHorizontalScrollbar: 0,
                    multiSelect: false,
                    rowHeight: 45,
                    onRegisterApi: function (gridApi) {
                        vm.gridApiSearchResults = gridApi;
                        // Register Events
                        gridApi.selection.on.rowSelectionChanged($scope, rowSelectionChangedSearchResults);
                    }
                };


                // Handle grid events for Top Table
                function rowSelectionChangedSearchResults(row) {
                    vm.selectedRow = row.isSelected ? row.entity : false;

                    vm.buildColumnDefsAndDataForSelectedWO(row)

                    displayOrderDetail(vm.selectedRow.woType);
                }



                function displayOrderDetail(woType) {
                    
                    vm.searchAccordionOpen = false;
                    vm.searchResultsOpen = false;
                    
                    AdminJsonService.getWODetails(woType).then(function (woDetails) {
                        
                        if (woDetails) {
                            if (woDetails.tasklist) {
                                populateDataForTaskListTable(woType, woDetails.tasklist);
                            }   

                            if (woDetails.uda) {
                                populateDataForUDATable(woType, woDetails.uda);
                            }   

                            if (woDetails.links) {
                                populateDataForLinksTable(woType, woDetails.links);
                            }   
                        }
                    });
                }      
                
                
                function populateDataForTaskListTable(woType, tableData) {
                    
                    // Load a special header template that has href links
                    UiGridUtilService.loadTemplate('ui-grid/uiGridHeaderCellSpecial');

                    vm.displayOrderDetailsFlag = true;

                    vm.gridOptionsTaskListTable.data = UiGridUtilService.extractTableCellValues(tableData);

                    var colDefs = UiGridUtilService.extractColumnDefs(tableData, {headerCellTemplate: 'ui-grid/uiGridHeaderCellSpecial', woType: woType});

                    colDefs = UiGridUtilService.autoColWidth(colDefs, tableData.rowMetaData);

                    vm.gridOptionsTaskListTable.columnDefs = colDefs;

                    //Make Task Code uneditable
                    for (var i = 0; i < vm.gridOptionsTaskListTable.columnDefs.length; i++) {                      
                        if (vm.gridOptionsTaskListTable.columnDefs[i].id === 'taskCode') {
                            vm.gridOptionsTaskListTable.columnDefs[i].enableCellEdit = false;
                            break;
                        }
                    }

                    //HIDE ID COLUMN
                    for (var i = 0; i < vm.gridOptionsTaskListTable.columnDefs.length; i++) {                      
                        if (vm.gridOptionsTaskListTable.columnDefs[i].id === 'id') {
                            vm.gridOptionsTaskListTable.columnDefs[i].enableHiding = false;
                            break;
                        }
                    }

                    vm.selectedWoType = vm.gridOptionsSelectedWO.data[0].woType;
                    vm.gridOptionsTaskListTable.exporterCsvFilename = vm.selectedWoType+'tasks.csv';

                }
                

                function populateDataForUDATable(woType, tableData) {
     
                    vm.gridOptionsUDATable.data = UiGridUtilService.extractTableCellValues(tableData);
                    var colDefs = UiGridUtilService.extractColumnDefs(tableData);
                    colDefs = UiGridUtilService.autoColWidth(colDefs, tableData.rowMetaData);
                    vm.gridOptionsUDATable.columnDefs = colDefs;

                    //HIDE ID COLUMN
                    for (var i = 0; i < vm.gridOptionsUDATable.columnDefs.length; i++) {                      
                        if (vm.gridOptionsUDATable.columnDefs[i].id === 'id') {
                            vm.gridOptionsUDATable.columnDefs[i].enableHiding = false;
                            break;
                        }
                    }
                }
   
   
                
                function populateDataForLinksTable(woType, tableData) {
                    
                    vm.gridOptionsLinksTable.data = UiGridUtilService.extractTableCellValues(tableData);
                    var colDefs = UiGridUtilService.extractColumnDefs(tableData);
                    colDefs = UiGridUtilService.autoColWidth(colDefs, tableData.rowMetaData);
                    vm.gridOptionsLinksTable.columnDefs = colDefs;

                    //HIDE ID COLUMN
                    for (var i = 0; i < vm.gridOptionsLinksTable.columnDefs.length; i++) {                      
                        if (vm.gridOptionsLinksTable.columnDefs[i].id === 'id') {
                            vm.gridOptionsLinksTable.columnDefs[i].enableHiding = false;
                            break;
                        }
                    }   
                }
            }


            function setupUiGridForSelectedWO() {

                vm.gridOptionsSelectedWO = {
                    enableCellEditOnFocus: true,
                    enableCellEdit: false,
                    enableRowSelection: true,
                    enableRowHeaderSelection: true,
                    enableHorizontalScrollbar: 0,
                    enableVerticalScrollbar: 0,
                    multiSelect: false,
                    rowHeight: 45,
                    onRegisterApi: function (gridApi) {
                        vm.gridApiSelectedWO = gridApi;
                        // Register Events
                        //gridApi.selection.on.rowSelectionChanged($scope, rowSelectionChangedWO);
                    }
                };


                vm.buildColumnDefsAndDataForSelectedWO = function (row) {
                    // copy the columnDefs from search results table to Selected WO row
                    vm.gridOptionsSelectedWO.columnDefs = angular.copy(vm.gridOptionsSearchResults.columnDefs);
                    vm.gridOptionsSelectedWO.data = [row.entity];                    

                    // find WO Description field and set it to editable
                    for (var i = 0; i < vm.gridOptionsSelectedWO.columnDefs.length; i++) {                      
                        if (vm.gridOptionsSelectedWO.columnDefs[i].id === 'woDescription') {
                            vm.gridOptionsSelectedWO.columnDefs[i].enableCellEdit = true;                            
                            UiGridUtilService.makeEditable(vm.gridOptionsSelectedWO.columnDefs[i]);
                            break;
                        }
                    }
                }


                // TODO: define all the functions needed for Seltect WO update operations
                vm.wo = {

                    updateWO: function () {

                    },

                    cancel: function () {

                    }
                };

            }


            function setupUiGridForTaskList() {

                vm.gridOptionsTaskListTable = {
                    enableCellEditOnFocus: true,
                    enableRowSelection: true,
                    rowHeight: 45,
                    rowEditWaitInterval: -1,
                    //enableRowHeaderSelection: false,
                    //enableHorizontalScrollbar: 0,
                    multiSelect: false,
                    //showGridFooter:true,
                    //enableFooterTotalSelected:true,
                    enableSorting: false,
                    //exporterCsvFilename: vm.selectedWoType + 'tasks.csv',
                    exporterMenuPdf: false,
                    exporterMenuCsv: false,
                    enableGridMenu: true,
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
                                displayOrderDetail(vm.selectedRow.woType);
                            }
                        }
                    ],
                    onRegisterApi: function (gridApi) {
                        vm.gridApiTaskList = gridApi;
                        gridApi.selection.on.rowSelectionChanged($scope, rowSelectionChangedTaskList);
                        //saving inline edited rows
                        //gridApi.rowEdit.on.saveRow($scope, saveRow);
                    }
                };


                function rowSelectionChangedTaskList(row) {
                    var msg = 'row selected ' + row.isSelected;
                    $log.log(msg);

                    vm.selectedRowTaskList = row.entity;
                    //vm.gridApiTaskList.cellNav.scrollToFocus(vm.selectedRow);
                    $log.debug("scrolled");

                    vm.selectedIndex = vm.gridOptionsTaskListTable.data.lastIndexOf(vm.selectedRowTaskList);
                    vm.previousIndex = vm.selectedIndex - 1;
                    vm.nextIndex = vm.selectedIndex + 1;
                    //These checks happen once per selected row
                    //Is the selected row already the last Element? Then disable the down button
                    //Is the selected row the first element in the list? Then disable the up button
                    if (vm.nextIndex === (vm.gridOptionsTaskListTable.data.length)) {
                        vm.lastElement = true;
                        vm.firstElement = false;
                    }
                    else {
                        vm.lastElement = false;
                    }

                    if (vm.previousIndex < 0) {
                        vm.firstElement = true;
                        vm.lastElement = false;
                    }
                    else {
                        vm.firstElement = false;
                    }
                };


                // TODO: define all the functions needed for Task List operations
                vm.tasklist = {

                    moveSelectedUp: function () {

                        vm.selectedIndex = vm.gridOptionsTaskListTable.data.lastIndexOf(vm.selectedRowTaskList);
                        if (vm.previousIndex > -1) {

                            vm.previousIndex = vm.selectedIndex - 1;
                            vm.nextIndex = vm.selectedIndex + 1;

                            vm.previousRowData = vm.gridOptionsTaskListTable.data[vm.previousIndex];

                            vm.nextRowData = vm.gridOptionsTaskListTable.data[vm.nextIndex];

                            vm.gridOptionsTaskListTable.data[vm.previousIndex] = vm.gridOptionsTaskListTable.data[vm.selectedIndex];
                            vm.gridOptionsTaskListTable.data[vm.selectedIndex] = vm.previousRowData;
                            vm.selectedIndex = vm.selectedIndex - 1;

                            vm.checkStart();
                            vm.checkEnd();
                        }

                        else {

                        }
                        //vm.gridApiTaskList.cellNav.scrollToFocus(vm.selectedRow);

                    },

                    moveSelectedDown: function () {

                        vm.selectedIndex = vm.gridOptionsTaskListTable.data.lastIndexOf(vm.selectedRowTaskList);

                        if (vm.nextIndex !== vm.gridOptionsTaskListTable.data.length) {

                            vm.previousIndex = vm.selectedIndex - 1;
                            vm.nextIndex = vm.selectedIndex + 1;

                            vm.previousRowData = vm.gridOptionsTaskListTable.data[vm.previousIndex];

                            vm.nextRowData = vm.gridOptionsTaskListTable.data[vm.nextIndex];

                            vm.gridOptionsTaskListTable.data[vm.nextIndex] = vm.gridOptionsTaskListTable.data[vm.selectedIndex];
                            vm.gridOptionsTaskListTable.data[vm.selectedIndex] = vm.nextRowData;
                            vm.selectedIndex = vm.selectedIndex + 1;

                            vm.checkEnd();
                            vm.checkStart();
                        }
                        else {
                            //vm.nextIndex = vm.selectedIndex+1;
                        }
                        //vm.gridApiTaskList.cellNav.scrollToFocus(vm.selectedRow);
                    },

                    addTask: function () {
                        MessagesService.clearMessages();

                        //TODO:  pass in dummy value for now
                        var woType = "";
                        
                        AdminJsonService.getTasks(woType).then(function (data) {

                            var tableData = data.tableRows;

                            vm.gridOptionsAddTaskSelectTable.data = UiGridUtilService.extractTableCellValues(tableData);
                            var colDefs = UiGridUtilService.extractColumnDefs(tableData);
                            colDefs = UiGridUtilService.autoColWidth(colDefs, tableData.rowMetaData);
                            vm.gridOptionsAddTaskSelectTable.columnDefs = colDefs;
          
                        });
                    },

                    removeTask: function () {

                        // Remove an item
                        vm.gridOptionsTaskListTable.data.splice(vm.gridOptionsTaskListTable.data.lastIndexOf(vm.selectedRowTaskList), 1);

                    },

                    saveTasks: function () {

                    },

                    cancel: function () {

                    },
                    
                    recalcTaskSequence: function () {
                        
                        // this is a new task list with the re-sequenced tasks
                        var sequencedData = [];
                        var sequenceNumber = 10; // start with 10 (incremented by 10)
                       
                        var rowData;
                        
                        for (var i=0; i < vm.gridOptionsTaskListTable.data.length; i++) {
                            rowData = angular.copy(vm.gridOptionsTaskListTable.data[i]);
                            if (rowData.taskParallelToPrevious === "YES") {
                                rowData.taskSequence = sequenceNumber.toString();
                            }
                            else {
                                // the sequence should start with 10 for the table
                                if (i > 0) {
                                    sequenceNumber += 10;
                                }
                                rowData.taskSequence = sequenceNumber.toString();
                            }
                            
                            sequencedData.push(rowData);
                        }
                
                        // update data with newly calculated task sequence numbers 
                        vm.gridOptionsTaskListTable.data = sequencedData;
          
                    },

                    export: function () {
                        vm.gridApiTaskList.exporter.csvExport(vm.uiGridExporterConstants.ALL, vm.uiGridExporterConstants.ALL);
                    },
                    
                    addToTaskList: function() {
                        MessagesService.clearMessages();
                        var rowData;
                        var selectedRow = vm.gridApiAddTask.selection.getSelectedRows()[0];
                        var selectedRowExists = false;
                        if(!(selectedRow.taskCode === 'PLAN')) {
                            for (var i=0; i < vm.gridOptionsTaskListTable.data.length; i++) {
                                rowData = angular.copy(vm.gridOptionsTaskListTable.data[i]);
                                if (rowData.taskCode === selectedRow.taskCode) {
                                    selectedRowExists = true;
                                }
                            }
                        }
                        if(!selectedRowExists) {
                            vm.gridOptionsTaskListTable.data.push(vm.gridApiAddTask.selection.getSelectedRows()[0]);
                            $("#addTaskModal").modal('hide');
                        } else {
                            MessagesService.addMessage('Task Code ['+ selectedRow.taskCode + '] is already added to list', "warning");
                        }
                    }
                };

                vm.checkStart = function () {
                    vm.previousIndex = vm.selectedIndex - 1;
                    if (vm.previousIndex < 0) {
                        vm.firstElement = true;
                    }
                    else {
                        vm.firstElement = false;
                    }
                }

                vm.checkEnd = function () {
                    vm.nextIndex = vm.selectedIndex + 1;
                    if (vm.nextIndex === vm.gridOptionsTaskListTable.data.length) {
                        vm.lastElement = true;
                    }
                    else {
                        vm.lastElement = false;
                    }
                };

                vm.insertCopyAtLocation = function () {
                    vm.newRowIndex = vm.selectedIndex + 1;
                    var dataCopy = angular.copy(vm.gridOptionsTaskListTable.data);
                    dataCopy.splice(vm.newRowIndex, 0, {
                        taskName: '',
                        taskSequence: '',
                        taskDescription: '',
                        tasksDuration: '',
                        tasksEscalation: ''
                    });
                    dataCopy[vm.newRowIndex] = vm.gridOptionsTaskListTable.data[vm.selectedIndex];
                    vm.gridOptionsTaskListTable.data = dataCopy;

                };


                function saveRow(rowEntity) {
                    // create a fake promise - normally you'd use the promise returned by $http or $resource
                    var deferred = $q.defer();
                    vm.gridApiTaskList.rowEdit.setSavePromise(rowEntity, deferred.promise);
                    // fake a delay of 3 seconds whilst the save occurs, return error if gender is "male"
                    $interval(function () {
                        if (rowEntity.gender === 'male') {
                            deferred.reject();
                        } else {
                            deferred.resolve();
                        }
                    }, 3000, 1);
                }

            }


            function setupUiGridForAddTask() {

                vm.gridOptionsAddTaskSelectTable = {
                    enableRowSelection: true,
                    multiSelect: false,
                    enableSorting: false,
                    rowHeight: 45,
                    enableGridMenu: true,
                    onRegisterApi: function (gridApi) {
                        vm.gridApiAddTask = gridApi;
                        // Register Events
                        gridApi.selection.on.rowSelectionChanged($scope, rowSelectionChangedAddTask);
                    }
                };


                function rowSelectionChangedAddTask(row) {
                    vm.selectedRow = row.isSelected ? row.entity : false;

                }

            }


            function setupUiGridForUDA() {

                vm.gridOptionsUDATable = {
                    enableCellEditOnFocus: true,
                    enableRowSelection: true,
                    //enableRowHeaderSelection: false,
                    enableHorizontalScrollbar: 0,
                    multiSelect: false,
                    rowHeight: 45,
                    enableSorting: false,
                    exporterMenuPdf: false,
                    exporterMenuCsv: false,
                    enableGridMenu: true,
                    enableHiding: false,
                    exporterCsvFilename : 'uda.csv',
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
                                displayOrderDetail(vm.selectedRow.woType);
                            }
                        }                        
                    ],
                    onRegisterApi: function (gridApi) {
                        vm.gridApiUDA = gridApi;
                        gridApi.selection.on.rowSelectionChanged($scope, rowSelectionChangedUDA);
                        //saving inline edited rows
                        //gridApi.rowEdit.on.saveRow($scope, saveRow);
                    }
                };


                function rowSelectionChangedUDA(row) {
                    vm.selectedRowUDA = row.entity;

                }


                // TODO: define all the functions needed for Seltect UDA add/update operations
                vm.uda = {

                    saveUDA: function () {
                        if (vm.selectedRowUDA) {
                            vm.selectedIndex = vm.gridOptionsUDATable.data.lastIndexOf(vm.selectedRowUDA);
                            vm.gridOptionsUDATable.data.splice(vm.selectedIndex + 1, 0, {});
                        }
                        else {
                            var newItem = {};
                            vm.gridOptionsUDATable.data.push(newItem);
                        }
                    },

                    updatUDA: function () {

                    },

                    cancel: function () {

                    },

                    addUDA: function () {
                                                
                        if (vm.selectedRowUDA) {
                            vm.selectedIndex = vm.gridOptionsUDATable.data.lastIndexOf(vm.selectedRowUDA);
                            vm.gridOptionsUDATable.data.splice(vm.selectedIndex + 1, 0, {});
                            vm.gridApiUDA.core.refreshRows().then(function () {
                                vm.selectedIndex = vm.selectedIndex+1;
                                vm.gridApiUDA.core.scrollTo(vm.gridOptionsUDATable.data[vm.selectedIndex], vm.gridOptionsUDATable.columnDefs[0]);
                                //Alternate to scrollTo - same behavior for now
                                //vm.gridApiUDA.cellNav.scrollToFocus( vm.gridOptionsUDATable.data[vm.selectedIndex], vm.gridOptionsUDATable.columnDefs[0]);                        
                                vm.gridApiUDA.selection.selectRow(vm.gridOptionsUDATable.data[vm.selectedIndex]); 
                            }); 
                        }
                        else {
                            var newItem = {};
                            vm.gridOptionsUDATable.data.push(newItem);
                            vm.gridApiUDA.core.refreshRows().then(function () {
                                var lastRowIndex = vm.gridOptionsUDATable.data.length-1;
                                vm.gridApiUDA.core.scrollTo(vm.gridOptionsUDATable.data[lastRowIndex], vm.gridOptionsUDATable.columnDefs[0]);
                                //Alternate to scrollTo - same behavior for now
                                //vm.gridApiUDA.cellNav.scrollToFocus(vm.gridOptionsUDATable.data[lastRowIndex], vm.gridOptionsUDATable.columnDefs[0]);
                                vm.gridApiUDA.selection.selectRow(vm.gridOptionsUDATable.data[lastRowIndex]); 
                            });
                        }
                    },
                    export:function(){
                        vm.gridApiUDA.exporter.csvExport(vm.uiGridExporterConstants.ALL, vm.uiGridExporterConstants.ALL);
                    }
                  
                };
            }
            
            
            
            
            function setupUiGridForLinks() {

                vm.gridOptionsLinksTable = {
                    enableCellEditOnFocus: true,
                    enableRowSelection: true,
                    //enableRowHeaderSelection: false,
                    enableHorizontalScrollbar: 0,
                    multiSelect: false,
                    rowHeight: 45,
                    enableSorting: false,
                    exporterMenuPdf: false,
                    exporterMenuCsv: false,
                    enableGridMenu: true,
                    enableHiding: false,
                    exporterCsvFilename : 'links.csv',
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
                                displayOrderDetail(vm.selectedRow.woType);
                            }
                        }                        
                    ],
                    onRegisterApi: function (gridApi) {
                        vm.gridApiLinks = gridApi;
                        gridApi.selection.on.rowSelectionChanged($scope, rowSelectionChangedLinks);
                        //saving inline edited rows
                        //gridApi.rowEdit.on.saveRow($scope, saveRow);
                    }
                };


                function rowSelectionChangedLinks(row) {
                    vm.selectedRowLinks = row.entity;

                }


                // TODO: define all the functions needed for Seltect Links add/update operations
                vm.links = {

                    saveLink: function () {
                        if (vm.selectedRowLinks) {
                            vm.selectedIndex = vm.gridOptionsLinksTable.data.lastIndexOf(vm.selectedRowLinks);
                            vm.gridOptionsLinksTable.data.splice(vm.selectedIndex + 1, 0, {});
                        }
                        else {
                            var newItem = {};
                            vm.gridOptionsLinksTable.data.push(newItem);
                        }
                    },

                    updatLink: function () {

                    },

                    cancel: function () {

                    },

                    addLink: function () {
                                                
                        if (vm.selectedRowLinks) {
                            vm.selectedIndex = vm.gridOptionsLinksTable.data.lastIndexOf(vm.selectedRowLinks);
                            vm.gridOptionsLinksTable.data.splice(vm.selectedIndex + 1, 0, {});
                            vm.gridApiLinks.core.refreshRows().then(function () {
                                vm.selectedIndex = vm.selectedIndex+1;
                                vm.gridApiLinks.core.scrollTo(vm.gridOptionsLinksTable.data[vm.selectedIndex], vm.gridOptionsLinksTable.columnDefs[0]);
                                //Alternate to scrollTo - same behavior for now
                                //vm.gridApiLinks.cellNav.scrollToFocus( vm.gridOptionsLinksTable.data[vm.selectedIndex], vm.gridOptionsLinksTable.columnDefs[0]);                        
                                vm.gridApiLinks.selection.selectRow(vm.gridOptionsLinksTable.data[vm.selectedIndex]); 
                            }); 
                        }
                        else {
                            var newItem = {};
                            vm.gridOptionsLinksTable.data.push(newItem);
                            vm.gridApiLinks.core.refreshRows().then(function () {
                                var lastRowIndex = vm.gridOptionsLinksTable.data.length-1;
                                vm.gridApiLinks.core.scrollTo(vm.gridOptionsLinksTable.data[lastRowIndex], vm.gridOptionsLinksTable.columnDefs[0]);
                                //Alternate to scrollTo - same behavior for now
                                //vm.gridApiLinks.cellNav.scrollToFocus(vm.gridOptionsLinksTable.data[lastRowIndex], vm.gridOptionsLinksTable.columnDefs[0]);
                                vm.gridApiLinks.selection.selectRow(vm.gridOptionsLinksTable.data[lastRowIndex]); 
                            });
                        }
                    },
                    
                    removeLink: function () {
                        vm.gridOptionsLinksTable.data.splice(vm.gridOptionsLinksTable.data.lastIndexOf(vm.selectedRowLinks), 1);
                    },
                    
                    export:function(){
                        vm.gridApiLinks.exporter.csvExport(vm.uiGridExporterConstants.ALL, vm.uiGridExporterConstants.ALL);
                    }
                  
                };
            }
            


            function setupVMMethods() {

                vm.clear = function () {
                    vm.poType = '';
                    vm.woType = '';
                };
                
                
                vm.addWOTemplate = function() {
                    setupUiGridForNewTaskList();
                    setupUiGridForNewUDA();
                    setupUiGridForNewLinks();
                    vm.displayChildTablesForNewWOTemplateFlag = false;
                    vm.displayNewWOTemplateTable();
                };
          

                vm.poTypeSelectionEvents = {

                    onItemSelect: function (item) {

                        if (item.id !== undefined || item === "") {
                            if (item.id !== "" && item.id !== undefined) {
                                vm.addWoTemplateButtonDisabled = false;
                                vm.searchButtonDisabled = false;
                                vm.clearButtonDisabled = false;
                            } else {
                                vm.addWoTemplateButtonDisabled = true;
                                vm.searchButtonDisabled = true;
                                vm.clearButtonDisabled = true;
                            }
                        }
                    }

                };

                vm.woTypeSelectionEvents = {

                    onItemSelect: function (item) {

                        if (item.id !== undefined || item === "") {
                            if (item.id !== "" && item.id !== undefined) {
                                vm.addWoTemplateButtonDisabled = true;
                                vm.searchButtonDisabled = false;
                                vm.clearButtonDisabled = false;
                            } else {
                                vm.addWoTemplateButtonDisabled = false;
                                vm.searchButtonDisabled = true;
                                vm.clearButtonDisabled = true;
                            }
                        }
                    }

                };


                vm.orderSearch = function () {

                    // reset to false before making restful call to get search results
                    vm.displayNewWOTemplateTableFlag = false;
                    vm.displaySearchResultsTableFlag = false;
                    vm.displayOrderDetailsFlag = false;

                    var currentPOPicklist = vm.poTypeMultiselectPickListOutput;
                    var currentWOPicklist = vm.woTypeMultiselectPickListOutput;
                  //  var ordersearchresultpath = "";
                 
                    var woSelectedFlag = (currentWOPicklist.length !== 0);

                    //TODO:  this is for prototype only 
                    //when the real JSON service is available, selected PO Types and WO Types need to be passed to BE
                    if (!woSelectedFlag) {
                        vm.orderSearchPromiseTable = AdminJsonService.getPOSearchResults().then(function (data) {

                            vm.displaySearchResultsTableFlag = true;

                            var tableData = data.tableRows;
                            vm.gridOptionsSearchResults.data = UiGridUtilService.extractTableCellValues(tableData);
                            vm.gridOptionsSearchResults.columnDefs = UiGridUtilService.extractColumnDefs(tableData);                       

                        });
                    }
                    else {
                    
                        vm.orderSearchPromiseTable = AdminJsonService.getWOSearchResults().then(function (data) {

                            vm.displaySearchResultsTableFlag = true;

                            var tableData = data.tableRows;
                            vm.gridOptionsSearchResults.data = UiGridUtilService.extractTableCellValues(tableData);
                            vm.gridOptionsSearchResults.columnDefs = UiGridUtilService.extractColumnDefs(tableData);                       

                        });
                    }
                };
                
                
                vm.poTypeSelectionClickItemEvent = function (selectedItem) {  
                    
                    validateIfWOTemplateButtonShouldBeEnabled();   
                    
                    if(vm.poTypeMultiselectPickListOutput.length > 0){
                        vm.searchButtonDisabled = false;
                        vm.clearButtonDisabled = false;
                    } else {
                        vm.searchButtonDisabled = true;
                        vm.clearButtonDisabled = true;
                    }
                };

                vm.poTypeSelectionSelectNoneEvent = function () {  
                    validateIfWOTemplateButtonShouldBeEnabled();
                    vm.searchButtonDisabled = true;
                    vm.clearButtonDisabled = true;          
                };

                vm.poTypeSelectionSelectAllEvent = function () { 
                    validateIfWOTemplateButtonShouldBeEnabled();
                    vm.searchButtonDisabled = false;
                    vm.clearButtonDisabled = false;      
                };

                vm.poTypeSelectionResetEvent = function () {  
                    validateIfWOTemplateButtonShouldBeEnabled();
                    vm.searchButtonDisabled = true;
                    vm.clearButtonDisabled = true;   
                };

                vm.woTypeSelectionClickItemEvent = function (selectedItem) { 
                    
                    validateIfWOTemplateButtonShouldBeEnabled();
                    
                    if(vm.woTypeMultiselectPickListOutput.length > 0){
                        vm.searchButtonDisabled = false;
                        vm.clearButtonDisabled = false;
                    } else {
                        vm.searchButtonDisabled = true;
                        vm.clearButtonDisabled = true;
                    }
                };

                vm.woTypeSelectionSelectNoneEvent = function () {  
                    validateIfWOTemplateButtonShouldBeEnabled();
                    vm.searchButtonDisabled = true;
                    vm.clearButtonDisabled = true;          
                };

                vm.woTypeSelectionSelectAllEvent = function () {  
                    validateIfWOTemplateButtonShouldBeEnabled();
                    vm.searchButtonDisabled = false;
                    vm.clearButtonDisabled = false;      
                };

                vm.woTypeSelectionResetEvent = function () {   
                    validateIfWOTemplateButtonShouldBeEnabled();
                    vm.searchButtonDisabled = true;
                    vm.clearButtonDisabled = true;   
                };
                
                
                function validateIfWOTemplateButtonShouldBeEnabled() {
                    if(vm.poTypeMultiselectPickListOutput.length === 1 &&
                        vm.woTypeMultiselectPickListOutput.length === 0) {
                        vm.addWoTemplateButtonDisabled = false;
                    }
                    else {
                        vm.addWoTemplateButtonDisabled = true;
                    }
                }
            };

        }]);
