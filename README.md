# ember-cli-form-data

This Ember-CLI addon adds file uploads through FormData to the Ember Data

### Usage

Add a file field on the model

```js
// models/post.js

export default DS.Model.extend({
  attachment: DS.attr('file'),

  // Other attributes
});
```

Add the FormDataMixin to your post adapter. Run ``ember g adapter post`` if you don't have the adapter.

```js
// adapters/post.js

import FormDataAdapterMixin from 'ember-cli-form-data/mixins/form-data-adapter';

export default ApplicationAdapter.extend(FormDataAdapterMixin, {
  // Adapter code
});
```

Then you can use an ``<input type='file' id='file-field'/>`` to send the attachment: 

```js
var file = document.getElementById('file-field').files[0];
model.set('attachment', file);
model.save();
```

This will send the ``attachment`` and all other attributes as a FormData object.

### Thanks

This addon was inspired by Matt Beedle's blog post http://blog.mattbeedle.name/posts/file-uploads-in-ember-data/