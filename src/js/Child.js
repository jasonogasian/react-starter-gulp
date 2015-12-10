var Child = React.createClass({
  render: function(){
    return (
      <div className="child">
        and this is the <b>{this.props.name}</b>.
      </div>
    )
  }
});

module.exports = Child;
