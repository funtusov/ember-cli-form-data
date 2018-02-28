import Object from '@ember/object';
import { module, test } from 'qunit';

import FormDataAdapterMixin from 'ember-cli-form-data/mixins/form-data-adapter';

var adapter;

module('FormDataAdapterMixin', {
  beforeEach() {
    adapter = Object.extend({
      ajaxOptions: function(url, type, options) {
        return options;
      }
    }, FormDataAdapterMixin).create();

    window.FormData = function() {
      this.data = [];
      this.append = function(key, value) {
        var object = {};
        object[key] = value;
        this.data.push(object);
      };
    };
  }
});

test('Default FormData Types', function(assert) {
  assert.deepEqual(adapter.get('formDataTypes'), ['POST', 'PUT', 'PATCH']);
});

test('#ajaxOptions', function(assert) {
  var testFormData = new window.FormData();

  testFormData.append('post[id]', 1);
  testFormData.append('post[title]', 'Rails is Omakase');

  var options = {
    data: {
      post: {
        id: 1,
        title: 'Rails is Omakase'
      }
    }
  };

  var hash = adapter.ajaxOptions('/', 'POST', options);

  assert.deepEqual(hash.data, testFormData);
});

test('Handle nested objects', function(assert) {
  var testFormData = new window.FormData();
  var avatarFile = new File([''], 'avatar.jpg');

  testFormData.append('post[id]', 1);
  testFormData.append('post[title]', 'Rails is Omakase');
  testFormData.append('post[author][email]', 'john.doe@doeness');
  testFormData.append('post[author][userData][avatar]', avatarFile);
  testFormData.append('post[author][userData][mainName]', 'John Doe');
  testFormData.append('post[author][userData][middleName]', '');
  testFormData.append('post[author][userData][extraNames][]', 'Johnnie Doe');
  testFormData.append('post[author][userData][extraNames][]', 'Johnny Doe');

  var options = {
    data: {
      post: {
        id: 1,
        title: 'Rails is Omakase',
        author: {
          email: 'john.doe@doeness',
          userData: {
            avatar: avatarFile,
            mainName: 'John Doe',
            middleName: null,
            extraNames: [
              'Johnnie Doe',
              'Johnny Doe',
            ],
          },
        },
      }
    }
  };

  var hash = adapter.ajaxOptions('/', 'POST', options);

  assert.deepEqual(hash.data, testFormData);
});

test('Handle multiple root objects', function(assert) {
  var testFormData = new window.FormData();
  var avatarFile = new File([''], 'avatar.jpg');

  testFormData.append('post[id]', 1);
  testFormData.append('post[title]', 'Rails is Omakase');
  testFormData.append('meta[author][email]', 'john.doe@doeness');
  testFormData.append('meta[author][userData][avatar]', avatarFile);
  testFormData.append('meta[author][userData][mainName]', 'John Doe');
  testFormData.append('meta[author][userData][middleName]', '');
  testFormData.append('meta[author][userData][extraNames][]', 'Johnnie Doe');
  testFormData.append('meta[author][userData][extraNames][]', 'Johnny Doe');

  var options = {
    data: {
      post: {
        id: 1,
        title: 'Rails is Omakase'
      },
      meta: {
        author: {
          email: 'john.doe@doeness',
          userData: {
            avatar: avatarFile,
            mainName: 'John Doe',
            middleName: null,
            extraNames: [
              'Johnnie Doe',
              'Johnny Doe',
            ],
          },
        },
      }
    }
  };

  var hash = adapter.ajaxOptions('/', 'POST', options);

  assert.deepEqual(hash.data, testFormData);
});

test("Don't modify the hash for requests outside formDataTypes", function(assert) {
  var options = {
    data: {
      post: {
        id: 1,
        title: 'Rails is Omakase'
      }
    }
  };

  var hash = adapter.ajaxOptions('/', 'GET', options);

  assert.deepEqual(hash.data, {
    post: {
      id: 1,
      title: 'Rails is Omakase'
    }
  });
});

test('Falsey key gets saved', function(assert) {
  var testFormData = new window.FormData();

  testFormData.append('post[preferred]', false);

  var options = {
    data: {
      post: {
        preferred: false
      }
    }
  };

  var hash = adapter.ajaxOptions('/', 'POST', options);

  assert.deepEqual(hash.data, testFormData);
});

test('Null key as empty string', function(assert) {
  var testFormData = new window.FormData();

  testFormData.append('post[title]', '');

  var options = {
    data: {
      post: {
        title: null
      }
    }
  };

  var hash = adapter.ajaxOptions('/', 'POST', options);

  assert.deepEqual(hash.data, testFormData);
});

test('Default disableRoot', function(assert) {
  assert.deepEqual(adapter.get('disableRoot'), false);
});

test('#ajaxOptions should exclude root when disableRoot is true', function(assert) {
  var testFormData = new window.FormData();

  // Setup expected form data; note the lack of the 'post' root (post[id])
  testFormData.append('id', 1);
  testFormData.append('title', 'Rails is Omakase');

  var options = {
    data: {
      post: {
        id: 1,
        title: 'Rails is Omakase'
      }
    }
  };

  adapter.set('disableRoot', true);

  var hash = adapter.ajaxOptions('/', 'POST', options);

  assert.deepEqual(hash.data, testFormData);
});
