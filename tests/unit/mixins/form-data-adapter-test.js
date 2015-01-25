import Ember from 'ember';
import FormDataAdapterMixin from '../../../mixins/form-data-adapter';

module('FormDataAdapterMixin');

// Replace this with your real tests.
test('it works', function() {
  var FormDataAdapterObject = Ember.Object.extend(FormDataAdapterMixin);
  var subject = FormDataAdapterObject.create();
  ok(subject);
});

test('Default FormData Types', function() {
  var FormDataAdapterObject = Ember.Object.extend(FormDataAdapterMixin);
  var subject = FormDataAdapterObject.create();
  deepEqual(subject.get('formDataTypes'), ['POST', 'PUT', 'PATCH']);
});

test('#_setHeadersFor', function() {
  expect(2);
  var FormDataAdapterObject = Ember.Object.extend(FormDataAdapterMixin);
  var subject = FormDataAdapterObject.create({
    headers: {
      APIKEY: '37'
    }
  });
  var hash = {};
  var xhr = {
    setRequestHeader: function(key, value) {
      equal(key, 'APIKEY');
      equal(value, '37');
    }
  };

  subject._setHeadersFor(hash);
  hash.beforeSend(xhr);
});

test('#_setBaseFor', function() {
  var FormDataAdapterObject = Ember.Object.extend(FormDataAdapterMixin);
  var subject = FormDataAdapterObject.create();
  var ctx = '37';
  var hash = {};

  
  var result = subject._setBaseFor('http://www.example.com', 'POST', hash, ctx);

  equal(hash.url, 'http://www.example.com');
  equal(hash.type, 'POST');
  equal(hash.dataType, 'json');
  equal(hash.context, '37');
  equal(hash.processData, false);
  equal(hash.contentType, false);
  equal(result, hash);
});

test('#_setFormDataFor', function() {
  var FormDataAdapterObject = Ember.Object.extend(FormDataAdapterMixin);
  var subject = FormDataAdapterObject.create();
  window.FormData = function() {
    this.data = [];
    this.append = function(key, value) {
      var object = {};
      object[key] = value;
      this.data.push(object);
    };
  };

  var correctFormData = new window.FormData();

  correctFormData.append('post[id]', 1);
  correctFormData.append('post[title]', 'Rails is Omakase');

  var hash = {
    data: {
      post: {
        id: 1,
        title: 'Rails is Omakase'
      }      
    }
  };

  subject._setFormDataFor(hash);

  deepEqual(hash.data, correctFormData);
});

test('ajaxOptions', function() {
  var FormDataAdapterObject = Ember.Object.extend(FormDataAdapterMixin);
  var subject = FormDataAdapterObject.create({
    headers: { APIKEY: '37' },
  });

  var url = 'http://www.example.com';
  var hash = { 
    data: {
      post: {
        title: 'Rails is Omakase'
      }
    } 
  };

  deepEqual(subject.ajaxOptions(url, 'POST', hash), hash, 'return the hash');
});
