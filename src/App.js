import React, {Component} from 'react';
import './App.css';


const GAME_TITLE = "tic-tac-toe";


function Field(props) {
  const disableIfInUse = (props.value != null || props.inactive) ? "disabled" : "";
  const classes = (props.isWinningField ? "field winning" : "field");
  return (
    <button className={classes} onClick={props.onClick} disabled={disableIfInUse}>
      {props.value}
    </button>
  )
}


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePlayer: "X",
      gameStatus: [
          [null, null, null],
          [null, null, null],
          [null, null, null],
        ],
      gameOver: false,
      winner: null,
    };
  }

  // componentDidMount() {
  //   console.log("Did mount.")
  //   // this.resetGame();
  // }

  resetGame = () => {
    console.log("Resetting game.")
    this.setState({
      activePlayer: "X",
      gameStatus: [
          [null, null, null],
          [null, null, null],
          [null, null, null],
        ],
      gameOver: false,
      winner: null,
      winAxis: null,
      winIndex: null,
    });
  }

  drawHeader = () => {
    if (!this.state.gameOver) {
      const playerXClasses = (this.state.activePlayer === "X") ? "player active-player" : "player";
      const playerOClasses = (this.state.activePlayer === "O") ? "player active-player" : "player";

      const playerXElement = (<div className={playerXClasses}>Player X</div>);
      const playerOElement = (<div className={playerOClasses}>Player O</div>);

      return (
        <div className="header flex-justify-spacebetween">
          {playerXElement}
          {playerOElement}
        </div>
      );
    }
    if (this.state.winner !== null) {
      return (
        <div className="header flex-justify-center">
          <div className="player win-msg">
            Player {this.state.winner} wins!
          </div>
        </div>
      );
    } else {
      return (
        <div className="header flex-justify-center">
          <div className="player draw-msg">
            Draw!
          </div>
        </div>
      )
    }

  }

  drawField = (rowIndex, fieldIndex, value) => {
    return (
      <Field
        value={this.state.gameStatus[rowIndex][fieldIndex]}
        onClick={() => this.handleClick(rowIndex, fieldIndex)}
        inactive={this.state.gameOver}
        isWinningField={this.isWinningField(rowIndex, fieldIndex)}
      />
    )
  }

  isWinningField = (rowIndex, fieldIndex) => {
    // Can only be a winning field if the game is and won
    if (this.state.gameOver === false && this.state.winner != null){
      return false;
    }
    const winAxis = this.state.winAxis;
    const winIndex = this.state.winIndex;
    // Check rows
    if (winAxis === "row" && winIndex === rowIndex){
      return true;
    }
    // Check columns
    if (winAxis === "col" && winIndex === fieldIndex){
      return true;
    }
    // Check diagonals
    if (winAxis === "diag"){
      const fieldCoord = String(rowIndex) + String(fieldIndex)
      const downDiagCoords = ["00", "11", "22"]
      const upDiagCoords = ["20", "11", "02"]
      if (winIndex === "down" && downDiagCoords.includes(fieldCoord)) {
        return true;
      }
      if (winIndex === "up" && upDiagCoords.includes(fieldCoord)) {
        return true;
      }
    }
    // Not a winning field
    return false;
  }

  handleClick = (rowIndex, fieldIndex) => {
    let gameStatus = this.state.gameStatus.slice();

    // Check game not over and field is not filled yet
    if (this.state.gameOver || gameStatus[rowIndex][fieldIndex] !== null) {
      return;
    }

    gameStatus[rowIndex][fieldIndex] = this.state.activePlayer;

    this.setState({
      gameStatus: gameStatus,
    }, this.postProcessingClick);
  }

  postProcessingClick = () => {
    if (this.isWon()) {
      this.handleWon();
    } else if (this.allFieldsFilled()) {
      this.handleDraw();
    } else {
      this.setState({
        activePlayer: this.otherPlayer(),
      });
    }
  }

  otherPlayer = () => {
    return (this.state.activePlayer === "X") ? "O" : "X";
  }

  isWon = () => {
    let won = false;
    const winRow = this.checkWinRows()
    if (winRow !== null) {
      console.log("Winning row found: " + winRow);
      won = true;
      this.setState({
        winAxis: "row",
        winIndex: winRow,
      });
    }
    const winCol = this.checkWinColumns()
    if (winCol !== null) {
      console.log("Winning column found: " + winCol)
      won = true;
      this.setState({
        winAxis: "col",
        winIndex: winCol,
      });
    }
    const winDiag = this.checkWinDiagonals()
    if (winDiag != null) {
      console.log("Winning diagonal found: " + winDiag);
      won = true;
      this.setState({
        winAxis: "diag",
        winIndex: winDiag,
      });
    }
    if (won) {
      console.log("Winner is: " + this.state.activePlayer);
      return true
    } else {
      return false
    }
  }

  checkWinRows = () => {
    for (let rowIndex = 0; rowIndex < this.state.gameStatus.length; rowIndex++) {
      let row = this.state.gameStatus[rowIndex];
      let otherValueFound = false;
      for (let fieldIndex = 0; fieldIndex < row.length; fieldIndex++) {
        let value = row[fieldIndex];
        if (!(value === this.state.activePlayer)) {
          otherValueFound = true;
          break;
        }
      }
      // If no other value was found, this is the winning row. Return the index.
      if (!otherValueFound) {
        return rowIndex;
      }
    }
    // If iterating through all rows without finding one where only the active players are contained
    // then this is not the winning row.
    return null;
  }

  checkWinColumns = () => {
    for (let columnIndex = 0; columnIndex < this.state.gameStatus[0].length; columnIndex++) {
      let otherValueFound = false;
      for (let rowIndex = 0; rowIndex < this.state.gameStatus.length; rowIndex++) {
        let value = this.state.gameStatus[rowIndex][columnIndex];
        if (value !== this.state.activePlayer) {
          otherValueFound = true;
          break;
        }
      }
      if (!otherValueFound) {
        return columnIndex;
      }
    }
    return null;
  }

  checkWinDiagonals = () => {
    const downDiag = [
      this.state.gameStatus[0][0],
      this.state.gameStatus[1][1],
      this.state.gameStatus[2][2],
    ]
    if (this.checkWinDiag(downDiag)) {
      return "down"
    }
    const upDiag = [
      this.state.gameStatus[2][0],
      this.state.gameStatus[1][1],
      this.state.gameStatus[0][2],
    ]
    if (this.checkWinDiag(upDiag)) {
      return "up";
    }
    return null;
  }

  checkWinDiag = (diag) => {
    let otherValueFound = false;
    for (let value of diag) {
      if (value !== this.state.activePlayer) {
        otherValueFound = true;
      }
    }
    return !otherValueFound
  }

  handleWon = () => {
    // Set win message
    this.setState({
      gameOver: true,
      winner: this.state.activePlayer,
    });
  }

  allFieldsFilled = () => {
    for (let row of this.state.gameStatus) {
      for (let field of row) {
        if (field === null) {
          return false;
        }
      }
    }
    return true;
  }

  handleDraw = () => {
    this.setState({
      gameOver: true,
      winner: null,
    });
  }

  drawRestartButton = () => {
    if (this.state.gameOver === true) {
      return (<button className="reset-button" onClick={() => this.resetGame()}>Play again!</button>);
    }
  }

  // TODO: Highlight winning fields

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>{ GAME_TITLE }</h1>
        </div>
        <div className="header-wrapper">
          {this.drawHeader()}
        </div>
        <div className="game-wrapper">
          <div className="game">
            <div className="field-row">
              {this.drawField(0, 0, 1)}
              {this.drawField(0, 1, 2)}
              {this.drawField(0, 2, 3)}
            </div>
            <div className="field-row">
              {this.drawField(1, 0, 4)}
              {this.drawField(1, 1, 5)}
              {this.drawField(1, 2, 6)}
            </div>
            <div className="field-row">
              {this.drawField(2, 0, 7)}
              {this.drawField(2, 1, 8)}
              {this.drawField(2, 2, 9)}
            </div>
          </div>
        </div>
        <div className="reset-wrapper">
          {this.drawRestartButton()}
        </div>
      </div>
    );
  }
}

export default App;
