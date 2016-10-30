function inject ($parse) {
    return function compile (element, attrs) {
        var fn = $parse(attrs.ngBind + ' = value', null, true);

        return function link (scope, element) { // eslint-disable-line no-shadow
            element.on('input', function (event) {
                event.preventDefault();

                scope.$evalAsync(function () {
                    fn(scope, {
                        value: element[0].textContent
                    });
                });
            });
        };
    };
}

export const contenteditable = ($parse) => {
    return {
        compile: inject($parse),
        restrict: 'A'
    };
};
