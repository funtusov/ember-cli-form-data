import Ember from 'ember';

export default Ember.Mixin.create({
  // Overwrite to change the request types on which Form Data is sent
  formDataTypes: ['POST', 'PUT', 'PATCH'],

  ajaxOptions: function(url, type, hash) {
    if (hash.data && this.formDataTypes.contains(type)) {
      hash = this._setBaseFor(url, type, hash, this);
      hash = this._setFormDataFor(hash);
      hash = this._setHeadersFor(hash);

      return hash;
    } else {
      return this._super.apply(this, arguments);
    }
  },

  _setHeadersFor: function(hash) {
    var headers = this.get('headers');

    if (headers) {
      hash.beforeSend = function(xhr) {
        var results = [];
        Ember.keys(headers).forEach(function(key) {
          results.push(xhr.setRequestHeader(key, headers[key]));
        });

        return results;
      };
    }

    return hash;
  },

  _setBaseFor: function(url, type, hash, context) {
    hash.url = url;
    hash.type = type;
    hash.dataType = 'json';
    hash.context = context;    
    hash.processData = false;
    hash.contentType = false;

    return hash;
  },

  _setFormDataFor: function(hash) {
    var formData = new FormData();
    var root = Ember.keys(hash.data)[0];

    Ember.keys(hash.data[root]).forEach(function(key) {
      if (hash.data[root][key]) {
        formData.append(root + "[" + key + "]", hash.data[root][key]);
      }
    });

    hash.data = formData;

    return hash;
  }
});
