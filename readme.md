## Simplux
#### A Simple Flux Library

Simplux is just a flux library stripped to the bone. Nothing fancy and it's not designed to solve every problem.
It comprises of a series of classes that you can extend to create **Stores** or **Actions**.
It comes also with a "Higher Order Component", **StoreEnhance**, that you can use to inject the Store's data in your views.
Ultimately there is a basic **Inflator** singleton that allows you to fill the stores both server side and client side, that allows you to easily create an isomorphic app.

### Action

Very easily create a Action object with an *enum* which defines the events your Action can emit

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
    myActions.on(myActions.EVENTS.userEvent, this.onUserEvent.bind(this));
  }


  /**
  * Define your inflate function. see the Inflator section for more information
  */
  inflate (pageData) { /* read data sent from the server and update the "this.data" */ }

  /**
  * This callback is called anytime someone emits the "myActions.EVENTS.userEvent"
  * Here you can access the "this.data" property and update the store's data
  * When finished, call the helper function "this.done"
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
// it takes your version of React to avoid conflicts of version or other inconsistencies
// it calls the "React.createClass" on it
export default StoreEnhance(React, MyView, stores);
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
  // would be probably better to use some templating engine (handlebars?) to do this
  var pageContent = '<div id="page">'
  pageContent += viewContent;
  pageContent += '</div><script type="application/json" id="page-data">' + JSON.stringify(data) + '</script>';

  res.render('template', {pageContent: pageContent});
}

```

At this point your client side script can leverage the inflator function and it will pre-fill the stores on the browser.

```javascript
// client.js

import React from 'react';
import { Inflator } from 'simplux';

// require the main view
import MyView from './myView.js'

// inflate the stores (on the browser it picks up data from the <script> tag)
Inflator.inflate();

React.render(<MyView />, document.getElementById('page'));

```


This is still a work in progress. I use it for some of my prototypes, it allows me to easily spin up an isomorphic app with React.
Please feel free to grab it and try it out and feedback via the "issues".
