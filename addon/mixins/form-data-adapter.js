import Ember from 'ember';

export default Ember.Mixin.create({
  // Overwrite to change the request types on which Form Data is sent
  formDataTypes: ['POST', 'PUT', 'PATCH'],

  // Overwrite to flatten the form data by removing the root
  disableRoot: false,

  ajaxOptions: function(url, type, options) {
    var data;
    var _this = this;

    if (options && 'data' in options) { data = options.data; }

    var hash = this._super.apply(this, arguments);

    if (typeof FormData !== 'undefined' && data && this.formDataTypes.contains(type)) {
      var formData = new FormData();
      var root = Ember.keys(data)[0];

      Ember.keys(data[root]).forEach(function(key) {
        if (typeof data[root][key] !== 'undefined') {
          if ( _this.get('disableRoot') ) {
            formData.append(key, data[root][key]);
          } else {
            formData.append(root + "[" + key + "]", data[root][key]);
          }
        }
      });

      hash.processData = false;
      hash.contentType = false;
      hash.data = formData;
    }

    return hash;
  },
});
