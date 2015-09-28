/**
 *
 * @param {React} React Pass in your reference to the React library (to avoid conflicts of any type)
 * @param {React.Component} ChildComponent The component you would like to wrap
 * @param {Object} stores An object mapping storeName and store
 * @return {React.Component}
 */
export default function (React, ChildComponent, stores) {

  var getStoreData = function () {
    return Object.keys(stores).reduce(function (state, storeName) {
      state[storeName] = stores[storeName].data;
      return state;
    }, {});
  };

  /** @type {React.Component} */
  return React.createClass({

    displayName: 'StoreEnhance',

    getInitialState: function () {
      return getStoreData();
    },

    componentDidMount: function () {
      Object.keys(stores).forEach(function (storeName) {
        stores[storeName].onUpdate(this.storesUpdate);
      }, this);
    },

    componentWillUnmount: function () {
      Object.keys(stores).forEach(function (storeName) {
        stores[storeName].removeUpdateListener(this.storesUpdate);
      }, this);
    },

    storesUpdate: function () {
      this.setState(getStoreData());
    },

    render: function () {
      return <ChildComponent {...this.state} {...this.props} />;
    }
  });

}
