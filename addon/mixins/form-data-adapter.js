import Ember from 'ember';

export default Ember.Mixin.create({
  // Overwrite to change the request types on which Form Data is sent
  formDataTypes: ['POST', 'PUT', 'PATCH'],

  // Overwrite to flatten the form data by removing the root
  disableRoot: false,

  ajaxOptions: function(url, type, options) {
    var data;

    if (options && 'data' in options) { data = options.data; }

    var hash = this._super.apply(this, arguments);

    if (typeof FormData !== 'undefined' && data && this.formDataTypes.indexOf(type) >= 0) {
      hash.processData = false;
      hash.contentType = false;
      hash.data = this._getFormData(data);
    }

    return hash;
  },

  _getFormData: function(data) {
    var formData = new FormData();
    var root = Object.keys(data)[0];

    Object.keys(data[root]).forEach(function(key) {
      if (typeof data[root][key] !== 'undefined') {
        var value = data[root][key] === null ? '' : data[root][key];
        var formKey = this.get('disableRoot') ? key : root + "[" + key + "]";

        if (Ember.isArray(value)) {
          value.forEach(function(item) {
            formData.append(formKey + '[]', item);
          }, this);
        } else {
          formData.append(formKey, value);
        }
      }
    }, this);

    return formData;
  }
});
