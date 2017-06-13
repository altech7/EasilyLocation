(function init(exports) {

    function BaseClass() {
        if (this.initialize !== undefined && this.initialize !== null) {
            this.initialize.apply(this, arguments);
        }
    };

    BaseClass.extend = function (childPrototype) {
        var _superConstructor = this;
        var _childConstructor = function () {
            _superConstructor.apply(this, arguments);
        };

        _childConstructor.extend = _superConstructor.extend;

        _childConstructor.prototype = Object.create(_superConstructor.prototype, {
            constructor: {value: _childConstructor, writable: true, enumerable: false}
        });

        for (var key in childPrototype) {
            _childConstructor.prototype[key] = childPrototype[key];
        }

        return _childConstructor;
    };

    exports.BaseClass = BaseClass;
})(neogenz);