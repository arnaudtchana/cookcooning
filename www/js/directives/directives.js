App.directive('uiShowPassword', [
    function () {
        return {
            restrict: 'A',
            scope: true,
            link: function (scope, elem, attrs) {
                var btnShowPass = angular.element('<button class="button"><i class="ion-eye"></i></button>'),
                    elemType = elem.attr('type');

                // this hack is needed because Ionic prevents browser click event
                // from elements inside label with input
                btnShowPass.on('mousedown', function (evt) {
                    (elem.attr('type') === elemType) ?
                        elem.attr('type', 'text') : elem.attr('type', elemType);
                    btnShowPass.toggleClass('button-assertive');
                    //prevent input field focus
                    evt.stopPropagation();
                });

                btnShowPass.on('touchend', function (evt) {
                    var syntheticClick = new Event('mousedown');
                    evt.currentTarget.dispatchEvent(syntheticClick);

                    //stop to block ionic default event
                    evt.stopPropagation();
                });

                if (elem.attr('type') === 'password') {
                    elem.after(btnShowPass);
                }
            }
        };
    }])