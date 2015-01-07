var app = angular.module('calendar', []);

app.controller('calendarCtrl', function($scope, $http) {
    $scope.currDate = $scope.today = new Date();

    $scope.monthChange = function monthChange(val) {
        $scope.currDate = val === -1 ? $scope.lastMonth : new Date($scope.year, $scope.month + val);
        $scope.setNewMonth()
    }

    $scope.reset = function reset() {
        $scope.currDate = $scope.today;
        $scope.setNewMonth();
    }

    $scope.setNewMonth = function setNewMonth() {
        $scope.firstDate = new Date($scope.currDate.getFullYear(), $scope.currDate.getMonth(), 1)
        $scope.month = $scope.currDate.getMonth();
        $scope.year = $scope.currDate.getFullYear();
        $scope.monthDays = $scope.setDays($scope.year, $scope.month);
    }

    $scope.setDays = function setDays(year, month) {
        var i, lastDays,
            x = 1,
            numDays = new Date(year, month + 1, 0).getDate(),
            dayArr = [],
            today = $scope.currDate.getMonth() === $scope.today.getMonth() &&
                $scope.currDate.getFullYear() === $scope.today.getFullYear();

        $scope.lastMonth = new Date(year, month, 0);

        for (i = 1; i <= numDays; i++) {
            dayArr.push({
                day: i,
                type: today && i === $scope.today.getDate() ? 'today' : 'current'
            });
        }

        dayArr = $scope.setLastDays(dayArr, $scope.firstDate.getDay(), $scope.lastMonth.getDate());

        return dayArr;
    }

    $scope.setLastDays = function setLastDays(arr, firstDay, lastDays) {
        var i;

        for (i = 0; i < firstDay; i++) {
            arr.unshift({
                day: lastDays,
                type: 'last'
            });
            lastDays--;
        }

        return $scope.setNextDays(arr);;
    }

    $scope.setNextDays = function setNextDays(arr) {
        var i,
            x = 1;

        // To keep all months formatted the same, preview maximum number of extra cells for next month.
        for (i = arr.length; i < 42; i++) {
            arr.push({
                day: x,
                type: 'last'
            });
            x++;
        }
        return arr;
    }

    // Init the current month params
    $scope.setNewMonth();

    $http.get('../js/date.json')
        .success(function(data) {
            $scope.dateObj = data;
        });
});