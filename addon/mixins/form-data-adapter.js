import Ember from 'ember';

export default Ember.Mixin.create({
  // Overwrite to change the request types on which Form Data is sent
  formDataTypes: ['POST', 'PUT', 'PATCH'],

  ajaxOptions: function(url, type, options) {
    var data;

    if (options && 'data' in options) { data = options.data; }

    var hash = this._super.apply(this, arguments);

    if (typeof FormData !== 'undefined' && data && this.formDataTypes.contains(type)) {
      var formData = new FormData();
      var fields = this.getFormFields(data);

      Ember.keys(fields).forEach(function(key) {
        if (typeof fields[key] !== 'undefined') {
          formData.append(
            this.getFormKey(key, fields[key]),
            this.getFormValue(key, fields[key])
          );
        }
      }.bind(this));

      hash.processData = false;
      hash.contentType = false;
      hash.data = formData;
    }

    return hash;
  },

  getFormFields: function (data) {
    this._root = this._root || Ember.keys(data)[0];
    return data[this._root];
  },

  getFormKey: function (key, value) {
    return this._root + "[" + key + "]";
  },

  getFormValue: function (key, value) {
    return value;
  }
});
