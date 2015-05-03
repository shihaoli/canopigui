/**
 * This directive has dependencies on jquery-ui.css and jquery-ui.js library.
 * It also uses the styles defined in att-gui.css created by MaxMedia - please make sure the jQuery code to
 * support Auto Fill Text Field is commented out in module.js before using this directive.
 *
 *
 [Examples of the directive usage in html]:

 <div auto-fill-text-field ng-model="selectedValue" name="autocomplete1" label="Autocomplete Field" source="languageList"></div>

      or

 <div auto-fill-text-field get-value="getSelectedValue(selectedValue)" name="autocomplete1" label="Autocomplete Field" source="languageList"></div>

      or

 <div auto-fill-text-field get-value="getSelectedValue(selectedValue)" ng-model="selectedValue" name="autocomplete1" label="Autocomplete Field" source="languageList"></div>


 [Example of the model data set in the controller]:

 $scope.languageList = [
     "ActionScript",
     "AppleScript",
     "Asp",
     "BASIC",
     "C",
     "C++",
     "Clojure",
     "COBOL",
     "ColdFusion",
     "Erlang",
     "Fortran",
     "Groovy",
     "Haskell",
     "Java",
     "JavaScript",
     "Lisp",
     "Perl",
     "PHP",
     "Python",
     "Ruby",
     "Scala",
     "Scheme"
 ];

 *
 */

angular.module('maxmedia.directive').directive('autoFillTextField', ['$log', function($log) {
	'use strict';
	
	return {
		restrict : 'EA',	
		replace : true,
		scope : {
            ngModel: "=?",  // optional
			name: "@",
            label: "@",
            source: "=?",   // optional
            getValue: "&?"  // optional
		},
		
		template : '<div class="form-group">' +
                   '   <label for="{{name}}">{{label}}:</label>' +
                   '   <input class="form-control" name="{{name}}" ng-model="ngModel">' +
                   '</div>',
	               
	    link: function (scope, element, attrs) {

            //$log.debug("data source = " + angular.toJson(scope.source));

            var inputField =  element.find('input');
            inputField.autocomplete({
                source: scope.source,
                focus:function (event, ui) {
                    inputField.val(ui.item.label);
                    //$log.debug("focus => ui.item.label = " + ui.item.label);
                    return false;
                },
                select:function (event, ui) {
                    scope.ngModel = ui.item.value;
                    //$log.debug("select => ui.item.value = " + ui.item.value);
                    scope.$apply();

                    // invoke controller function to pass back the selected value
                    scope.getValue({selectedValue: ui.item.value});
                    return false;
                },
                change:function (event, ui) {
                    if (ui.item === null || ui.item === undefined) {
                        //$log.debug("change => ui.item.value = " + ui.item.value);
                        scope.ngModel = null;
                        scope.$apply();
                    }
                }
            });

		}
	};
}]);