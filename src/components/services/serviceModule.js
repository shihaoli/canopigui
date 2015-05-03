angular.module('canopi.service', ['canopi.constants', 'admin.defaults'])
            .config(['$httpProvider', function($httpProvider) {
                      $httpProvider.interceptors.push('HttpInterceptorService');

                      // Angular 1.3 feature - $appyAsync for better performance (deferring the resolution of  multiple $http calls to the next digest cycle
                      // http://blog.thoughtram.io/angularjs/2015/01/14/exploring-angular-1.3-speed-up-with-applyAsync.html

                      $httpProvider.useApplyAsync(true);
}]);

