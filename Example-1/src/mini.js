var Class = (function () {
  'use strict';

  var _util = {
    isFunc: function (arr) {
      var key;

      for (key in arr) {
        if (typeof arr[key] !== 'function') {
          return false;
        }
      }
      return true;
    },
    overrideFunc: function (super_fn, base_fn) {
      return function () {
        var tmp = this._super, ret;

        this._super = super_fn;
        ret = base_fn.apply(this, arguments);
        this._super = tmp;
        return ret;
      };
    },
    mergeObj: function (super_obj, base_obj) {
      var property, func1, func2;

      for (property in base_obj) {

        func1 = super_obj[property];
        func2 = base_obj[property];

        if (this.isFunc([func1, func2])) {
          super_obj[property] = this.overrideFunc(func1, func2);
        } else {
          super_obj[property] = func2;
        }
      }
      return super_obj;
    }
  };

  return {
    __extending: false,
    Create: function (o) {
      return this.Extend.call(null, o);
    },
    Extend: function (base_obj) {
      var F = function () {
        if (!Class.__extending && this.init) {
          this.init.apply(this, arguments);
        }
      }, super_obj;

      Class.__extending = true;
      super_obj = new this();
      F.prototype = _util.mergeObj(super_obj, base_obj);
      Class.__extending = false;

      F.Extend = Class.Extend;
      return F;
    }
  };
}());
