## Simplux
#### A Simple Flux Library

Simplux is just a flux library stripped to the bone. Nothing fancy and doesn't want to work for every case.
It comprises of a series of classes that you can extend to create **Stores** or **Actions**.
It comes also with a "Higher Order Component", **StoreEnhance**, that you can use to inject the Store's data in your views.
Ultimately there is a basic **Inflator** singleton that allows you to fill the stores both server side and client side, to allow you to easily create an isomorphic app.

### Action

Very easily just create a Action object with an *enum* that define the events your Action can emit

```javascript
// myActions.js

import { Action } from 'simplux';

/**
* create actions and define their names
* so now we can emit and event "myActions.emit(myActions.EVENTS.userEvent)"
*/
export default new Action ({
  userEvent: 0,
  otherEvent: 1
});

```

### Store

To create your store, simply extend the base store.

```javascript
// myStore.js

import { Store } from 'simplux';

import myActions from '../actions/myActions.js';

class MyStore extends Store {

  /**
  * Define your init function. This will be called once during the creation of your store.
  * Use this lifecycle function to bind listeners (maybe to some action)
  */
  init () {
    myActions.on(myActions.EVENTS.userEvent, this.onUserEvent.bond(this));
  }


  /**
  * Define your inflate function. see the Inflator section for more information
  */
  inflate (pageData) { /* read data sent to the server and update the "this.data" */ }

  /**
  * This callback anytime someone emits the "myActions.EVENTS.userEvent"
  * Here you can access the "this.data" property and update the store's data
  * When finished called the helper function "this.done"
  */
  onUserEvent (data) {
    this.data.myProp1 += 1;
    this.done();
  }
}


// export a singleton and initialize it with some default data
// this will be accessible via the "this.data" prop
export default new MyStore({
  myProp1: 1,
  myProp2: 'other prop'
});

```

### StoreEnhance

Once you have created your stores, use the StoreEnhance to easily wrap your views with the data from your stores

```javascript
// myView.js

import React from 'react';
import { StoreEnhance } from 'simplux';

// Define the stores and assign a unique key that represents your store
// later you can access it inside your "this.props"
const stores = {
  myStore: require('../stores/myStore.js')
};

const MyView = React.createClass({
  render: function () {
    return (
      <div>
        <h1>This is the data from myStore</h1>
        myProp1 {this.props.myStore.myProp1}
      </div>
    );
  }
});

// when exporting your view, use the "StoreEnhance"
export default StoreEnhance(MyView, stores);
```

### Inflator

Inflator is a very basic utility that allows you to clean and inflate your stores both on the server and on the client.
On the server, just before calling the "React.renderToString" function, import the Inflator and call the "inflate" function

```javascript
// route.js

import React from 'react';
import { Inflator } from 'simplux';
import myView from '../application/myView.js';

export default function handler (req, res) {

  // fetch and generate all data necessary
  var data = {
    user: {/* logged user data */}
    friends: [/*list of friends?*/]
  };

  // call the inflate function
  Inflator.inflate(data);

  // now render, and your stores will be filled with the above data
  var viewContent = React.renderToString(React.createElement(myView));

  // now, when finally rendering the page with the viewContent, remember to pass the same data to the client
  // do that by creating a <script> tag for application/json with the id="page-data"
  viewContent += '<script type="application/json" id="page-data">' + JSON.stringify(data) + '</script>';

  res.render('template', {viewContent: viewContent});
}

```

This is still a working progress. I use it for some of my prototypes, it allows me to easily spin up an isomorphic app with React.
Please feel free to grab it and try it out and feedback via the "issues".