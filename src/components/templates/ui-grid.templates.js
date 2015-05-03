'use strict';
angular.module('canopi.templates')
    // Overrides
    .value('ui-grid/selectionRowHeader',
    '<div class="ui-grid-disable-selection">' +
    '   <div class="text-center">' +
    '       <ui-grid-selection-row-header-buttons-canopi></ui-grid-selection-row-header-buttons-canopi>' +
    '   </div>' +
    '</div>')

    // Custom
    .value('ui-grid/selectionRowHeaderButtonsCanopi',
    '<div style="padding-top: 5px; height: 30px;">' +
    '   <div ng-if="isEditing" class="btn-group">' +
    '       <a class="btn btn-xs btn-primary" ng-click="save()">Save</a>' +
    '       <a class="btn btn-xs btn-warning" ng-click="cancel(row, $event)">Cancel</a>' +
    '   </div>' +
    '   <div ng-if="!isEditing">' +
    '       <button style="padding: 0px;" class="btn-link" ng-class="{disabled: exclusive}" ng-disabled="exclusive" tooltip="Copy" ng-click="copy(row, $event)"><i class="fa fa-fw fa-clipboard"></i></button>' +
    '       <button style="padding: 0px;" class="btn-link" ng-class="{disabled: exclusive}" ng-disabled="exclusive" tooltip="Edit" ng-click="edit(row, $event)"><i class="fa fa-fw fa-pencil-square-o"></i></button>' +
    '   </div>' +
    '</div>')

    // (1) show external link icon on Task Queue, Task Duration and Task Escalation column headers
    // (2) navigate to Rule Administration screen by passing categoryType and woType params
    .value('ui-grid/uiGridHeaderCellSpecial',
    '<div ng-class="{ \'sortable\': sortable }">' +
    '   <span ng-if="col.field == \'taskQueue\' || col.field == \'taskDuration\' || col.field == \'taskEscalation\'">&nbsp;&nbsp;{{col.displayName}}&nbsp;&nbsp;' +
    '       <a style="color: white" href="index.html#/adminmain/ruleadmin/{{col.field}}/{{col.colDef.woType}}" target="_ruleadmin">' +
    '           <i class="fa fa-external-link"></i>' +
    '       </a>' +
    '   </span>' +
    '   <div class="ui-grid-cell-contents" col-index="renderIndex">' +
    '       <span>{{col.displayName CUSTOM_FILTERS}}</span>' +
    '       <span ui-grid-visible="col.sort.direction" ng-class="{\'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">&nbsp;</span>' +
    '   </div>' +
    '   <div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus && !col.isRowHeader && col.colDef.enableColumnMenu !== false" ng-click="toggleMenu($event)" ng-class="{\'ui-grid-column-menu-button-last-col\': isLastCol}">' +
    '       <i class="ui-grid-icon-angle-down">&nbsp;</i>' +
    '   </div>' +
    '   <div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
    '       <div ng-if="colFilter.type !== \'select\'">' +
    '           <input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" ng-attr-placeholder="{{colFilter.placeholder || \'\'}}">' +
    '           <div class="ui-grid-filter-button" ng-click="colFilter.term = null">' +
    '               <i class="ui-grid-icon-cancel" ng-show="!!colFilter.term">&nbsp;</i>' +
    '               <!-- use !! because angular interprets \'f\' as false -->' +
    '           </div>' +
    '       </div>' +
    '   </div>' +
    '   <div ng-if="colFilter.type === \'select\'">' +
    '       <select class="ui-grid-filter-select" ng-model="colFilter.term" ng-attr-placeholder="{{colFilter.placeholder || \'\'}}" ng-options="option.value as option.label for option in colFilter.selectOptions"></select>' +
    '       <div class="ui-grid-filter-button-select" ng-click="colFilter.term = null">' +
    '           <i class="ui-grid-icon-cancel" ng-show="!!colFilter.term">&nbsp;</i>' +
    '           <!-- use !! because angular interprets \'f\' as false -->' +
    '       </div>' +
    '   </div>' +
    '</div>')

    // Input types
    .value('ui-grid/dropdown',
    '<div>' +
    '   <form name="inputForm">' +
    '       <select ng-class="\'colt\' + col.uid" ui-grid-edit-dropdown ng-model="MODEL_COL_FIELD" ng-options="field[editDropdownIdLabel] as field[editDropdownValueLabel] CUSTOM_FILTERS for field in editDropdownOptionsArray"></select>' +
    '   </form>' +
    '</div>'
)
    .value('ui-grid/input',
    '<div>' +
    '   <form name="inputForm">' +
    '       <div class="input-group has-success" style="width: 100%;">' +
    '           <span class="input-group-addon"><i class="fa fa-pencil"></i></span>' +
    '           <input type="INPUT_TYPE" ng-class="\'colt\' + col.uid" ui-grid-editor class="form-control" placeholder="{{col.displayName}}" ng-model="MODEL_COL_FIELD">' +
    '       </div>' +
    '   </form>' +
    '</div>'
);