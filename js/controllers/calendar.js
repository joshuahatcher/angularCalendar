(function() {
    'use strict';

    angular.module('calendar').controller('calendarCtrl', function($scope, $http) {
        var monthArr;

        // Grab data from JSON file for use in month/day name labels.
        $http.get('data.json')
            .success(function(data) {
                $scope.daysOfWeek = data.days;
                monthArr = data.months;
                $scope.changeMonth();
            });

        /**
         * Get a date object for use in an adjacent month
         * @method changeMonth
         * @param {number} val Number by which to alter current month
         * @param {number} yr Current year of date from which to alter current month
         * @param {number} mo Current month of date from which to alter current month
         * @param {boolean} innerCall Implies whether call was made via UI or privately in another function
         */
        $scope.changeMonth = function(val, yr, mo, innerCall) {
            var dateTarget = innerCall ? 0 : 1,
                // If fn is called without arguments, reset the calendar.
                newCurr = val ? new Date(yr, monthArr.indexOf(mo) + val, dateTarget) : new Date();
            if (innerCall) {
                return newCurr;
            }
            setMonth(newCurr);
        }

        /**
         * Sets new values to $scope date properties
         * @method setMonth
         * @param {Date} date Updated date from which to extract properties
         */
        function setMonth(date) {
            $scope.yr = date.getFullYear();
            $scope.mo = monthArr[date.getMonth()];
            $scope.days = getDays(date);
        }

        /**
         * Prepares numbers corresponding to dates to be shown in the UI
         * @method getDays
         * @param {Date} date Used to extract individual dates to be shown
         * @return {Array}
         */
        function getDays(date) {
            var i, len, lastMo, nextMo,
                dayArr = [],
                mo = date.getMonth(),
                yr = date.getYear(),
                numDays = new Date(yr, mo + 1, 0).getDate(),
                // If this is being called via the initialization of the app,
                // date will be equal to the current date, not necessarily the first of the month.
                // This will avoid having to call new Date another time.
                firstDay = date.getDate() > 1 ? date.getDay() + 1 - (date.getDate() % 7) : date.getDay();

            for (i = 1, len = numDays; i <= numDays; i++) {
                dayArr.push({
                    num: i,
                    type: 'current'
                });
            }
            // Prepend current month dates with days from previous month to complete cells for first week
            if (firstDay > 0) {
                lastMo = $scope.changeMonth(-1, yr, mo, true).getDate();
                for (i = 0; i < firstDay; i++) {
                    dayArr.unshift({
                        num: lastMo,
                        type: 'other'
                    });
                    lastMo--;
                }
            }
            // Append current month dates with days from next month so all months have equal number of cells
            if (dayArr.length < 42) {
                for (i = dayArr.length; i < 42; i++) {
                    dayArr.push({
                        num: i,
                        type: 'other'
                    })
                }
            }
            return dayArr;
        }
    });
}());
