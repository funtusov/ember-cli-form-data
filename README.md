# ember-cli-form-data

This Ember-CLI addon adds file uploads through FormData to the Ember Data

### Install

```
npm install ember-cli-form-data --save-dev
```

### Usage

Add a file field on the model

```js
// models/post.js

export default DS.Model.extend({
  attachment: DS.attr('file'),
  ...
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

## Customization

You can override `getFormFields()` to select the fields you want to transform into FormData. The method is passed the model snapshot as unique parameter. If you want to customize the name for the key, overrides `getFormKey()` which is passed with the `key` and `value` for that key of the hash returned by `getFormFields()`. To customize the value, use `getFormValue()`.

Do not abuse these customization. If you're performing huge changes in your model's representation, then you should be providing a custom serializer or maybe a different transformation for an specific field.

### Thanks

This addon was inspired by Matt Beedle's blog post http://blog.mattbeedle.name/posts/file-uploads-in-ember-data/
