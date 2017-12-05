var IndexColumn = React.createClass({
  displayName: "IndexColumn",

  render: function () {
    return React.createElement(
      "td",
      null,
      React.createElement(
        "span",
        null,
        this.props.index + 1
      )
    );
  }
});

var CamperColumn = React.createClass({
  displayName: "CamperColumn",

  render: function () {
    return React.createElement(
      "td",
      null,
      React.createElement(
        "a",
        { href: "https://www.freecodecamp.com/" + this.props.user.username, target: "_blank", className: "camperImage" },
        React.createElement("img", { src: this.props.user.img, alt: this.props.user.username, className: "img-thumbnail", height: "42", width: "42" })
      ),
      React.createElement(
        "a",
        { href: "https://www.freecodecamp.com/" + this.props.user.username, target: "_blank" },
        React.createElement(
          "span",
          null,
          this.props.user.username
        )
      )
    );
  }
});

var PointsColumn = React.createClass({
  displayName: "PointsColumn",

  render: function () {
    return React.createElement(
      "td",
      { className: "center" },
      React.createElement(
        "span",
        null,
        this.props.points
      )
    );
  }
});

var UserRow = React.createClass({
  displayName: "UserRow",

  render: function () {
    return React.createElement(
      "tr",
      null,
      React.createElement(IndexColumn, { index: this.props.index }),
      React.createElement(CamperColumn, { user: this.props.user }),
      React.createElement(PointsColumn, { points: this.props.user.recent }),
      React.createElement(PointsColumn, { points: this.props.user.alltime })
    );
  }
});

var LeaderboardTable = React.createClass({
  displayName: "LeaderboardTable",

  handleColumnSort: function (column) {
    this.props.onSort(column);
  },
  render: function () {
    var rows = [];

    for (let i = 0; i < this.props.users.length; i++) {
      rows.push(React.createElement(UserRow, { index: i, key: i, user: this.props.users[i] }));
    }
    return React.createElement(
      "table",
      { className: "table table-striped" },
      React.createElement(
        "thead",
        null,
        React.createElement(
          "tr",
          null,
          React.createElement(
            "th",
            null,
            "#"
          ),
          React.createElement(
            "th",
            null,
            "Camper"
          ),
          React.createElement(SortableHeader, { onColumnSort: this.handleColumnSort, column: "recent", text: "Points in past 30 days", sortedColumn: this.props.sortedColumn }),
          React.createElement(SortableHeader, { onColumnSort: this.handleColumnSort, column: "alltime", text: "All time points", sortedColumn: this.props.sortedColumn })
        )
      ),
      React.createElement(
        "tbody",
        null,
        rows
      )
    );
  }
});

var SortableHeader = React.createClass({
  displayName: "SortableHeader",

  handleClick: function (clickedColumn) {
    this.props.onColumnSort(clickedColumn);
  },
  render: function () {
    if (this.props.sortedColumn === this.props.column) {
      return React.createElement(
        "th",
        { className: "center", onClick: this.handleClick.bind(this, this.props.column) },
        React.createElement(
          "a",
          { href: "#" },
          this.props.text,
          " ",
          React.createElement("i", { className: "fa fa-caret-down" })
        )
      );
    }
    return React.createElement(
      "th",
      { className: "center", onClick: this.handleClick.bind(this, this.props.column) },
      React.createElement(
        "a",
        { href: "#" },
        this.props.text
      )
    );
  }
});

var CamperLeaderboard = React.createClass({
  displayName: "CamperLeaderboard",

  getInitialState: function () {
    return {
      users: null,
      sortedColumn: "recent"
    };
  },
  componentDidMount: function () {
    this.loadData();
  },
  componentWillUnmount: function () {
    this.serverRequest.abort();
  },
  loadData: function () {
    this.serverRequest = $.get(this.props.source + this.state.sortedColumn, function (result) {
      var userList = result;
      this.setState({
        users: userList
      });
    }.bind(this));
  },
  handleSort: function (sortedColumn) {
    if (sortedColumn !== this.state.sortedColumn) {
      this.setState({ sortedColumn: sortedColumn }, this.loadData);
    }
  },
  render: function () {
    if (this.state.users) {
      return React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "col-md-12" },
          React.createElement(LeaderboardTable, { users: this.state.users, onSort: this.handleSort, sortedColumn: this.state.sortedColumn })
        )
      );
    }
    return React.createElement(Loading, null);
  }

});

var Loading = React.createClass({
  displayName: "Loading",

  render: function () {
    return React.createElement(
      "div",
      { className: "row" },
      React.createElement(
        "div",
        { className: "col-md-12 center" },
        React.createElement("i", { className: "fa fa-spinner fa-pulse fa-3x fa-fw" })
      )
    );
  }
});

ReactDOM.render(React.createElement(CamperLeaderboard, { source: "https://fcctop100.herokuapp.com/api/fccusers/top/" }), document.getElementById('container'));