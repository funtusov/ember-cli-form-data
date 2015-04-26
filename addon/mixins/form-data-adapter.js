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
      var fields = this.getDataToTransform(data);

      Ember.keys(fields).forEach(function(key) {
        if (typeof fields[key] !== 'undefined') {
          formData.append(
            this.getFormKey(key, fields),
            this.getFormValue(key, fields)
          );
        }
      }.bind(this));

      hash.processData = false;
      hash.contentType = false;
      hash.data = formData;
    }

    return hash;
  },

  getDataToTransform: function (data) {
    var root = Ember.keys(data)[0];
    return data[root];
  },

  getFormKey: function (key, data) {
    this._root = this._root || Ember.keys(data)[0];
    return this._root + "[" + key + "]";
  },

  getFormValue: function (key, data) {
    this._root = this._root || Ember.keys(data)[0];
    return data[this._root][key];
  }
});
