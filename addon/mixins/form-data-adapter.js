import Ember from 'ember';

export default Ember.Mixin.create({
  // Overwrite to change the request types on which Form Data is sent
  formDataTypes: ['POST', 'PUT', 'PATCH'],

  ajaxOptions: function(url, type, options) {
    var hash = this._super.apply(this, arguments);

    if (hash.data && this.formDataTypes.contains(type)) {
      this._setFormDataFor(hash);
    }

    return hash;
  },

  _setFormDataFor: function(hash) {
    if (typeof FormData !== 'function') { return hash; }

    var formData = new FormData();
    var root = Ember.keys(hash.data)[0];

    Ember.keys(hash.data[root]).forEach(function(key) {
      if (hash.data[root][key]) {
        formData.append(root + "[" + key + "]", hash.data[root][key]);
      }
    });

    hash.processData = false;
    hash.contentType = false;
    hash.dataType = 'json';
    hash.data = formData;

    return hash;
  }
});
