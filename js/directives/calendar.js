(function() {
    'use strict';

    angular.module('calendar').directive('calendar', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/calendar.html'
        }
    });
}());