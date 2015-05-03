angular.module('canopi.service').service('UamJsonService', ['$q', '$http', '$log', 'Cache', 'CanopiGuiConstants', 
                              function ($q, $http, $log, Cache, CanopiGuiConstants) {
	           
	'use strict';

	//var controllerName = MOCK_DATA_FLAG ? 'uammock' : 'uam';
	var controllerName = 'uam';  // make UAM call to get live data 

        var baseUrl = '/canopigui/rest/' + controllerName;

	
	this.getUser = function (attUid) {

		var deferred = $q.defer();

        $http.get(baseUrl + '/user/get/' + attUid).success(function (response) {
        	  
            deferred.resolve(response);
              
        });

         return deferred.promise; 
	};

		

	this.getAllUserNames = function () {

		var deferred = $q.defer();
        $http.get(baseUrl + '/allUserNames/get').success(function (response) {
            deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
			
	
	
	this.addUser = function (postObject) {

		var deferred = $q.defer();
        $http.post(baseUrl + '/user/add', JSON.stringify(postObject)).success(function (response) {
             deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.deleteUser = function (postObject) {

		var deferred = $q.defer();
        $http.post(baseUrl + '/user/delete', JSON.stringify(postObject)).success(function (response) {
             deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.getPermissions = function (workGroup) {

		var deferred = $q.defer();
        $http.get(baseUrl + '/permissions/get/' + workGroup).success(function (response) {
            deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.addWorkGroup = function (postObject) {

		var deferred = $q.defer();
        $http.post(baseUrl + '/workGroup/add', JSON.stringify(postObject)).success(function (response) {
             deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.listAllWorkGroups = function () {

		var deferred = $q.defer();
        $http.get(baseUrl + '/workGroups/get').success(function (response) {
            deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.listAllPermissions = function () {

		var deferred = $q.defer();
        $http.get(baseUrl + '/permissions/get').success(function (response) {
            deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.getUsersInWorkGroup = function (workGroupId) {

		var deferred = $q.defer();
        $http.get(baseUrl + '/usersInWorkGroup/get/' + workGroupId).success(function (response) {
            deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	

	
	this.listAllUsers = function () {

		var deferred = $q.defer();
        $http.get(baseUrl + '/users/get').success(function (response) {
            deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.getUserFromWebPhone = function (attUid) {

		var deferred = $q.defer();
        $http.get(baseUrl + '/userInfo/get/' + attUid).success(function (response) {
            deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.removeWorkGroupFromUAM = function (postObject) {

		var deferred = $q.defer();
        $http.post(baseUrl + '/workGroup/delete', JSON.stringify(postObject)).success(function (response) {
             deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.addMemberToGroupFromUAM = function (postObject) {

		var deferred = $q.defer();
		
		$http.post(baseUrl + '/groupMember/add', JSON.stringify(postObject)).success(function (response) {
             deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.removerMemberFromGroupFromUAM = function (postObject) {

		var deferred = $q.defer();
        $http.post(baseUrl + '/groupMember/delete', JSON.stringify(postObject)).success(function (response) {
             deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.addPermission = function (postObject) {

		var deferred = $q.defer();
        $http.post(baseUrl + '/permission/add', JSON.stringify(postObject)).success(function (response) {
             deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.deletePermission = function (postObject) {

		var deferred = $q.defer();
        $http.post(baseUrl + '/permission/delete', JSON.stringify(postObject)).success(function (response) {
             deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.updateWorkGroup = function (postObject) {

		var deferred = $q.defer();
        $http.post(baseUrl + '/workGroup/update', JSON.stringify(postObject)).success(function (response) {
             deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.addPermissionToGroup = function (postObject) {

		var deferred = $q.defer();
        $http.post(baseUrl + '/permissionInGroup/add', JSON.stringify(postObject)).success(function (response) {
             deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.removePermissionFromGroup = function (postObject) {

		var deferred = $q.defer();
        $http.post(baseUrl + '/permissionInGroup/delete', JSON.stringify(postObject)).success(function (response) {
             deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.getPermissionsFromUser = function (postObject) {

		var deferred = $q.defer();
        $http.post(baseUrl + '/permissionsFromUser/get', JSON.stringify(postObject)).success(function (response) {
             deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.getUamHistory = function (postObject) {

		var deferred = $q.defer();
        $http.post(baseUrl + '/uamHistory/get', JSON.stringify(postObject)).success(function (response) {
             deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.getUserPermissions = function (postObject) {

		var deferred = $q.defer();
        $http.post(baseUrl + '/permissions/get', JSON.stringify(postObject)).success(function (response) {
             deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.addPermissionToUser = function (postObject) {

		var deferred = $q.defer();
        $http.post(baseUrl + '/permissionForUser/add', JSON.stringify(postObject)).success(function (response) {
             deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.getUserByPermissionName = function (permissionName) {

		var deferred = $q.defer();
        $http.get(baseUrl + '/uamUsers/get/' + permissionName).success(function (response) {
            deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.removePermissionFromUser = function (postObject) {

		var deferred = $q.defer();
        $http.post(baseUrl + '/permissionForUser/delete', JSON.stringify(postObject)).success(function (response) {
             deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.addAcnaPermissions = function (attUid) {

		var deferred = $q.defer();
        $http.get(baseUrl + '/acnaPermissions/add/' + attUid).success(function (response) {
            deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	
	
	
	this.removeAcnaPermissions = function (attUid) {

		var deferred = $q.defer();
        $http.get(baseUrl + '/acnaPermissions/delete/' + attUid).success(function (response) {
            deferred.resolve(response);
        });
      
        return deferred.promise; 
	};
	

}]);
