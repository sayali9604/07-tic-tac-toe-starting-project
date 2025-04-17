import { useState } from 'react';
import Player from './components/Player.jsx';
import GameBoard from './components/GameBoard.jsx';
import Log from './components/Log.jsx';
import { WINNING_COMBINATIONS } from './components/winning-combinations.js';
import GameOver from './components/GameOver.jsx';

//below code is derived component which is helper component.
function deriveActivePlayer(gameTurns){
  let currentPlayer = 'X';
  if( gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }
  return currentPlayer;

}

const initialGameBoard = [
  [null, null,null],
  [null, null, null],
  [null,null,null],
];

function App() {
  const [players,setPlayers] = useState({
    'X':'Player1',
    'O':'Player2'

});
  const [gameTurns,setGameTurns] = useState([]);
  //const[hasWinner, setHasWinner] = useState(false); we can do this but we will not because we cn do this with game turns
 // const [activePlayer, setActivePlayer] = useState('X');

 const activePlayer = deriveActivePlayer(gameTurns);

 let gameBoard = [...initialGameBoard.map(array =>[...array] )];

    for(const turn of gameTurns){
       const { square, player} = turn;//object destructuring 
       const { row, col} = square;

       gameBoard[row][col] = player;
       
    }
    let winner = null;
 for( const combinations of WINNING_COMBINATIONS){
    const firstSquareSymbol = gameBoard[combinations[0].row][combinations[0].column];
    const secondSquareSymbol = gameBoard[combinations[1].row][combinations[1].column];
    const thirdSquareSymbol = gameBoard[combinations[2].row][combinations[2].column];

    if(firstSquareSymbol &&
       firstSquareSymbol === secondSquareSymbol &&
       firstSquareSymbol === thirdSquareSymbol
      ){
        winner = players[firstSquareSymbol];
      }
 }

 const hasDraw = gameTurns.length === 9 && !winner;
  function handleSelectSquare(rowIndex , colIndex){
   // setActivePlayer((curActivePlayer) => curActivePlayer === 'X' ? 'O' : 'X'); //here we are updating the active state
    setGameTurns(prevTurns => {
      const currentPlayer = deriveActivePlayer(prevTurns);
      const updatedTurns = [ { square: { row: rowIndex, col:colIndex }, player : currentPlayer }, ...prevTurns];
      return updatedTurns;
    });
  }

  function handleRestart(){
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName){
    setPlayers(prevPlayers => {
      return{
        ...prevPlayers,
        [symbol]: newName
      };
    });
  }
  return( 
  <main>
    <div id="game-container">
      <ol id="players" className='highlight-player'>
        <Player initialName="Player 1" symbol= "X" isActive= {activePlayer === 'X'} onChangeName = {handlePlayerNameChange}/>
        <Player initialName="Player 2" symbol= "O" isActive={activePlayer === 'O'} onChangeName = {handlePlayerNameChange}/>
      </ol>
      { (winner  || hasDraw )&& <GameOver  winner ={winner} onRestart={handleRestart}/>}
      <GameBoard onSelectSquare={ handleSelectSquare} activePlayerSymbol={activePlayer} board={gameBoard}/> 
    </div>
    <Log turns= {gameTurns}></Log>
  </main>
  );

    
  
}

export default App
