var Child = require('./Child');

var Parent = React.createClass({
  render: function(){
    return (
      <div className="wrapper">
        <div className="parent"> This is the parent container. </div>
        <Child name="child"/>
      </div>
    )
  }
});

module.exports = Parent;
