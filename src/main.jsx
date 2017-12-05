var IndexColumn = React.createClass({
  render: function() {
    return (
      <td>
        <span>{this.props.index+1}</span>
      </td>
    );
  }
});

var CamperColumn = React.createClass({
  render: function() {
    return (
      <td>
        <a href={"https://www.freecodecamp.com/" + this.props.user.username} target="_blank" className="camperImage">
          <img src={this.props.user.img} alt={this.props.user.username} className="img-thumbnail" height="42" width="42" />
        </a>

        <a href={"https://www.freecodecamp.com/" + this.props.user.username} target="_blank">
          <span>{this.props.user.username}</span>
        </a>
      </td>
    )
  }
});

var PointsColumn = React.createClass({
  render: function() {
    return (
      <td className="center">
        <span>{this.props.points}</span>
      </td>
    );
  }
});

var UserRow = React.createClass({
  render: function() {
    return (
      <tr>
        <IndexColumn index={this.props.index} />
        <CamperColumn user={this.props.user}/>
        <PointsColumn points={this.props.user.recent}/>
        <PointsColumn points={this.props.user.alltime}/>
      </tr>
    );
  }
});

var LeaderboardTable = React.createClass({
  handleColumnSort: function(column) {
    this.props.onSort(column);
  },
  render: function() {
    var rows = [];

    for(let i = 0; i < this.props.users.length; i++) {
      rows.push(<UserRow index={i} key={i} user={this.props.users[i]} />);
    }
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Camper</th>
            <SortableHeader onColumnSort={this.handleColumnSort} column="recent" text="Points in past 30 days" sortedColumn={this.props.sortedColumn}/>
            <SortableHeader onColumnSort={this.handleColumnSort} column="alltime" text="All time points" sortedColumn={this.props.sortedColumn}/>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    )
  }
});

var SortableHeader = React.createClass({
  handleClick: function(clickedColumn) {
    this.props.onColumnSort(clickedColumn);
  },
  render: function() {
    if(this.props.sortedColumn === this.props.column) {
      return <th className="center" onClick={this.handleClick.bind(this, this.props.column)}><a href="#">{this.props.text} <i className="fa fa-caret-down"></i></a></th>
    }
    return (
      <th className="center" onClick={this.handleClick.bind(this, this.props.column)}><a href="#">{this.props.text}</a></th>
    )
  }
});

var CamperLeaderboard = React.createClass({
  getInitialState: function() {
    return {
      users: null,
      sortedColumn: "recent"
    };
  },
  componentDidMount: function() {
    this.loadData();
  },
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  loadData: function() {
    this.serverRequest = $.get(this.props.source+this.state.sortedColumn, function (result) {
      var userList = result;
      this.setState({
        users: userList,
      });
    }.bind(this));
  },
  handleSort: function(sortedColumn) {
    if (sortedColumn !== this.state.sortedColumn) {
      this.setState({sortedColumn: sortedColumn}, this.loadData);
    }
  },
  render: function() {
    if(this.state.users) {
      return (
        <div className="row">
          <div className="col-md-12">
            <LeaderboardTable users={this.state.users} onSort={this.handleSort} sortedColumn={this.state.sortedColumn}/>
          </div>
        </div>
      )
    }
    return <Loading />
  },

});

var Loading = React.createClass({
  render: function() {
    return (
      <div className="row">
        <div className="col-md-12 center">
          <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
        </div>
      </div>
    )
  }
});

ReactDOM.render(<CamperLeaderboard source="https://fcctop100.herokuapp.com/api/fccusers/top/"/>, document.getElementById('container'));
