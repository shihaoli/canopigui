angular.module('canopi.service').service('UiGridUtilService', ['$templateCache', '$log', 'uiGridConstants', 'uiGridExporterConstants', function ($templateCache, $log, uiGridConstants, uiGridExporterConstants) {
    'use strict';

    /**
     * Creates a grid config object
     *
     * @param config {Object} Custom configuration, overwriting the default values
     * @returns {Object} ui-grid configuration object
     */
    this.createGrid = function (config) {
        var default_config = {
            enableRowSelection: true,
            rowHeight: 45,
            rowEditWaitInterval: -1,
            enableSelectAll: false,
            enableHorizontalScrollbar: uiGridConstants.NEVER,
            enableColumnMenus: false,
            enableGridMenu: true,
            enableCellEditOnFocus: true,
            enableFiltering:true,
            multiSelect: false,
            exporterMenuPdf: false,
            exporterMenuCsv: false
        };

        return angular.extend(default_config, config);
    };

    var default_grid_options = {};
    /**
     * Put a specific template on the templateCache
     *
     * @param name
     */
    this.loadTemplate = function (name) {
        var template = angular.injector(['canopi.templates']).get(name);
        $templateCache.put(name, template);
    };

    // auto adjust column widths in ui-grid
    // http://stackoverflow.com/questions/17174096/is-there-a-way-to-auto-adjust-widths-in-ng-grid

    this.autoColWidth = function (colDefs, row) {
        var totalChars = 0;

        for (var i = 0; i < row.columnList.length; i++) {
            totalChars += (new String(row.columnList[i].displayName)).length;
        }

        for (var i = 0; i < colDefs.length; i++) {
            var numChars = (new String(colDefs[i].displayName)).length;
            if (totalChars > 100) {
                colDefs[i].width = ( (numChars / totalChars) * 200) + "%";
            } else {
                colDefs[i].width = ( (numChars / totalChars) * 155) + "%";
            }
        }

        return colDefs;
    };

    // @TODO: Replace the extractTableCellValues funciton
    this.rowProcessor = function (rows, column, b, c) {
        //debugger;
    };

    // @TODO: Replace the extractColumnDefs function
    this.columnProcessor = function (a, b, c, d) {
        debugger;
    };

    /**
     * Helper method to build ng-grid's columnDefs property based on meta data column attributes
     *
     * @param tableData Table metadata
     * @param config {Object} (Optional) Configuration object that is applied to the column
     * @returns {Array} Table columns
     */
    this.extractColumnDefs = function (tableData, config) {
        var columns = _.uniq(tableData.rowMetaData.columnList, 'id');
        var rthis = this;
        angular.forEach(columns, function (column) {
            column.field = column.id;
            //column.cellTemplate = "" +
            //"   <div ng-if='COL_FIELD.length > 20' class='ui-grid-cell-contents'>{{COL_FIELD CUSTOM_FILTERS}}</div>" +
            //"   <div ng-if='COL_FIELD.length <= 20' class='ui-grid-cell-contents'>{{COL_FIELD CUSTOM_FILTERS}}</div>";
            column.cellFilter = 'uppercase';
            // If this field is editable, set the editable template to the right input
            if (column.editable) {
                rthis.makeEditable(column);
            }
            
            if(column.hyperlink){
                //rthis.makeLink(column);
            }

            // Merge with config passed in
            if (!_.isUndefined(this)) {
                angular.extend(column, this);
            }
        }, config);

        return columns;
    };
    
    /*
     * Helper method to set a field to editable
     * 
     * @param column The column to be made editable
     * @returns {undefined}
     */
    this.makeEditable = function (column) {
        var template = angular.injector(['canopi.templates']).get('ui-grid/' + column.fieldType);
        $templateCache.put('ui-grid/' + column.fieldType, template);

        column.editableCellTemplate = 'ui-grid/' + column.fieldType;
        column.editDropdownOptionsArray = column.fieldOptions;
        column.editDropdownIdLabel = 'label';
        column.cellEditableCondition = function ($scope) {
            return !$scope.grid.appScope.isEditing;
        }
    };    
    
    /**
     * Helper method to build ng-grid's data property based on meta data row values
     * @param tableData Table metadata
     * @returns {Array} Data rows
     */
    this.extractTableCellValues = function (tableData) {
        var localRowData = [];
        var cellsInRow = [];
        
        var totalCols = tableData.rowMetaData.columnList.length;
        var totalRows = tableData.rowMetaData.rowValueList.length;

        for (var i = 0; i < totalRows; i++) {
            cellsInRow = tableData.rowMetaData.rowValueList[i].cellValues;
            var obj = {};
            for (var j = 0; j < totalCols; j++) {
                obj[tableData.rowMetaData.columnList[j]['id']] = cellsInRow[j];          
            }
            localRowData.push(obj);
        }
        
        return localRowData;
    };
    
    /*
     * Helper method to get the columns that don't have cell values
     * @param tableData Table metadata
     * @returns {Array} column names
     */
    this.getEmptyColumns = function(tableData){
        var isEmpty=[];
        var emptyCount = 0;
        var count = 0;
        var emptyColumnNames = [];
        var cellsInRow=[];
        var totalCols = tableData.rowMetaData.columnList.length;
        var totalRows = tableData.rowMetaData.rowValueList.length;
        for(var j = 0; j<totalCols; j++){
            for (var i = 0; i < totalRows; i++) {
                    cellsInRow = tableData.rowMetaData.rowValueList[i].cellValues;
                    
                    if(cellsInRow[j] === ""){
                                
                                isEmpty[i]=true;
                                emptyCount++;

                    }
                    else{
                        
                        isEmpty[i]=false;
                    }
                    
            }
            if(emptyCount === totalRows){
                emptyColumnNames[count]=tableData.rowMetaData.columnList[j]['id'];
                count++;
                
            }
            emptyCount=0;
        }
        
        return emptyColumnNames;
    };
    
    
    /**
     * Helper method to verify if the newly added row is a duplicate of any of the existing rows 
     *
     * @param gridData {Array} ui-grid's gridOptions.data (all the rows in table)
     * @param newRowData {Object} ui-grid's row.entity (the newly added row)
     * @returns boolean duplicate row
     */
    this.isDuplicateRow = function(gridData, newRowData){
        $log.debug("Inside isDuplicateRow");
        $log.debug(gridData);
        $log.debug(newRowData);
        if (!gridData || !newRowData) return false;

        // strip off the id field 
        var newRowDataWithoutIdField = _.omit(newRowData, "id");
       
        // iterate through all the rows by stripping off the "id" field first
        // and then compare the object on each row with the newly added row
        for (var i=0; i < gridData.length; i++) {
            if (angular.equals(_.omit(gridData[i], "id"), newRowDataWithoutIdField)) {
                return true;
            }
        }
        
//        _.each(gridData, function (rowData) {
//              if (angular.equals(_.omit(rowData, "id"), newRowDataWithoutIdField)) {
//                return true;
//            }
//        });
        
        return false;
    };
    
}]);