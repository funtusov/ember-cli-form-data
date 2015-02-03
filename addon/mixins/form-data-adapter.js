import Ember from 'ember';

export default Ember.Mixin.create({
  // Overwrite to change the request types on which Form Data is sent
  formDataTypes: ['POST', 'PUT', 'PATCH'],

  ajaxOptions: function(url, type, options) {
    var hash = this._super.apply(this, arguments);

    if ('data' in options && this.formDataTypes.contains(type)) {
      this._setFormDataFor(hash, options.data);
    }

    return hash;
  },

  _setFormDataFor: function(hash, data) {
    if (typeof FormData !== 'function') { return hash; }

    var formData = new FormData();
    var root = Ember.keys(data)[0];

    Ember.keys(data[root]).forEach(function(key) {
      if (data[root][key]) {
        formData.append(root + "[" + key + "]", data[root][key]);
      }
    });

    hash.data = formData;
    hash.dataType = 'json';
    hash.processData = false;
    hash.contentType = false;

    return hash;
  }
});
