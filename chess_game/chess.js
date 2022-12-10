const numToPiece = {        0:"none" ,
                            1:"wP" ,
                            2:"wR" , 
                            3:"wN" , 
                            4:"wB" ,
                            5:"wQ" , 
                            6:"wK" , 
                            7:"bP" , 
                            8:"bR" , 
                            9:"bN" , 
                            10:"bB" , 
                            11:"bQ" , 
                            12:"bK"         };
const pieceToNum = {
                        "none":0 ,
                        "wP":1 ,
                        "wR":2, 
                        "wN":3 , 
                        "wB":4 ,
                        "wQ":5 , 
                        "wK":6 , 
                        "bP":7 , 
                        "bR":8 , 
                        "bN":9 , 
                        "bB":10 , 
                        "bQ":11 , 
                        "bK":12        };

let board = Array.from(Array(8) , () => new Array(8));
const defaultBoard = [   [8,9,10,11,12,10,9,8],
                         [7,7,7 ,7, 7 ,7 ,7,7],
                         [0,0,0 ,0 ,0 ,0 ,0,0],
                         [0,0,0 ,0 ,0 ,0 ,0,0],
                         [0,0,0 ,0 ,0 ,0 ,0,0],
                         [0,0,0 ,0 ,0 ,0 ,0,0],
                         [1,1,1 ,1 ,1 ,1 ,1,1],
                         [2,3,4 ,5 ,6 ,4 ,3,2]     ];
let boardElements;
const cellToElement = (cell) => document.querySelector(`.row${cell[0]} .col${cell[1]}`);
let elementToCell;
let piecesFromPionWhite = [] , piecesFromPionBlack = []
let chosenCell = null;
let movesToHighlight = null;
let highlightedSquares = []
let whiteTurn
let whiteRemainingPieces , blackRemainingPieces
let gameOver
let leftwRMove , rightwRMove , wKMove , leftbRMove , rightbRMove , bKMove 


function initialInit(){
    boardElements = document.querySelectorAll(".cell:not(.nums)")
    boardElements.forEach( cell => cell.addEventListener('click' , e => handleClick(cell)) )
    document.querySelector(".toggle").addEventListener('click' , e => toggleNums())
    document.querySelector(".restart").addEventListener('click' , e => init(defaultBoard))
    document.querySelector(".new_game").addEventListener('click' , e => init(defaultBoard))
    document.querySelector(".end_game").addEventListener('click' , e => endGame("w"))
    document.querySelector(".hide").addEventListener('click' , e => hideMateMessage())
    initMaps();
    initPiecesFromPion();
    toggleNums();
    init(defaultBoard);
}
function init(startingBoard){
    hideMateMessage();
    gameOver = false;
    whiteTurn = true;
    whiteRemainingPieces = ["wP","wP","wP","wP","wP","wP","wP","wP",
                            "wR","wR","wN","wN","wB","wB","wQ","wK" ];
    blackRemainingPieces = ["bP","bP","bP","bP","bP","bP","bP","bP",
                            "bR","bR","bN","bN","bB","bB","bQ","bK"];
    
    initBoard(startingBoard);
    //before initBoard , this was the impl =>
    {
    // {   //reseting all the cellsElements
    // let row = []
    // //row 1
    // resetCellElement("bR" , document.querySelector(`.row1 .col1`) );
    // resetCellElement("bN" , document.querySelector(`.row1 .col2`) );
    // resetCellElement("bB" , document.querySelector(`.row1 .col3`) );
    // resetCellElement("bQ" , document.querySelector(`.row1 .col4`) );
    // resetCellElement("bK" , document.querySelector(`.row1 .col5`) );
    // resetCellElement("bB" , document.querySelector(`.row1 .col6`) );
    // resetCellElement("bN" , document.querySelector(`.row1 .col7`) );
    // resetCellElement("bR" , document.querySelector(`.row1 .col8`) );

    // //row 2
    // for (let i=1 ; i<= 8 ; i++)
    //     row.push(document.querySelector(`.row2 .col${i}`))
    // row.forEach( el =>  resetCellElement("bP" , el));
    // row = []
    
    // //row 3
    // for (let i=1 ; i<= 8 ; i++)
    //     row.push(document.querySelector(`.row3 .col${i}`))
    // row.forEach( el =>  resetCellElement("none" , el));
    // row = []

    // //row 4
    // for (let i=1 ; i<= 8 ; i++)
    //     row.push(document.querySelector(`.row4 .col${i}`))
    // row.forEach( el =>  resetCellElement("none" , el));
    // row = []
  
    // //row 5
    // for (let i=1 ; i<= 8 ; i++)
    //     row.push(document.querySelector(`.row5 .col${i}`))
    // row.forEach( el =>  resetCellElement("none" , el));
    // row = []
     
    // //row 6
    // for (let i=1 ; i<= 8 ; i++)
    //     row.push(document.querySelector(`.row6 .col${i}`))
    // row.forEach( el =>  resetCellElement("none" , el));
    // row = []
    
    // //row 7
    // for (let i=1 ; i<= 8 ; i++)
    //     row.push(document.querySelector(`.row7 .col${i}`))
    // row.forEach( el =>  resetCellElement("wP" , el));
    // row = []
    
    // //row 8
    // resetCellElement("wR" , document.querySelector(`.row8 .col1`) );
    // resetCellElement("wN" , document.querySelector(`.row8 .col2`) );
    // resetCellElement("wB" , document.querySelector(`.row8 .col3`) );
    // resetCellElement("wQ" , document.querySelector(`.row8 .col4`) );
    // resetCellElement("wK" , document.querySelector(`.row8 .col5`) );
    // resetCellElement("wB" , document.querySelector(`.row8 .col6`) );
    // resetCellElement("wN" , document.querySelector(`.row8 .col7`) );
    // resetCellElement("wR" , document.querySelector(`.row8 .col8`) );
    // }
    }

    leftwRMove = false 
    rightwRMove= false 
    wKMove = false
    leftbRMove = false
    rightbRMove= false 
    bKMove = false
}



function movePiece(pieceString , originCell, destCell){
    const originCellArray = elementToCell.get(originCell)
    const destCellArray = elementToCell.get(destCell)
    if ( ( (pieceString == "wK" && !wKMove) || (pieceString == "bK" && !bKMove) )   //check if the move is a castle
            && [3,7].includes(destCellArray[1])){
        castle(getColor(pieceString) , originCellArray , destCellArray[1] == 3 ? [originCellArray[0],1] : [originCellArray[0],8] )
        return;
    }

    board[getRow(originCell)-1][getCol(originCell)-1] = 0;
    board[getRow(destCell)-1][getCol(destCell)-1] = pieceToNum[pieceString];

    let eatenPiece = null;
    const img = originCell.removeChild(originCell.firstElementChild);   //removing image from origin
    if (destCell.childElementCount != 0){
        destCell.removeChild(destCell.firstElementChild);
        eatenPiece = destCell.dataset.piece;
    }
    destCell.appendChild(img);                                          //adding image to dest cell
    originCell.dataset.piece = "none";              //updatine data of cells
    destCell.dataset.piece = pieceString;
    if (eatenPiece != null && eatenPiece != "none")
        removePieceFromArray(eatenPiece);
    
    //pion reaches last line
    if (pieceString == "wP" && elementToCell.get(destCell)[0]==1 || pieceString == "bP" && elementToCell.get(destCell)[0]==8){
        addPieceFromPion(destCell , getColor(pieceString));
    }

    //maintain moves for castles
    if (pieceString == "wK")
        wKMove = true
    if (pieceString == "bK")
        bKMove = true
    if (pieceString == "wR" && originCellArray[0] == 8 && originCellArray[1] == 1)
         leftwRMove = true 
    if (pieceString == "wR" && originCellArray[0] == 8 && originCellArray[1] == 8)
        rightwRMove = true 
    if (pieceString == "bR" && originCellArray[0] == 1 && originCellArray[1] == 1)
        leftbRMove = true
    if (pieceString == "bR" && originCellArray[0] == 1 && originCellArray[1] == 8)
        rightbRMove = true
    return eatenPiece;
}
//TODO::: fix setTimeout or better experience when checkmate
function handleClick(cell) {
    if (gameOver)
        return;
    const piece = cell.dataset.piece
    if (chosenCell == null){   //this is the first touch
        if (piece == "none")    //first touch is on empty cell -> return
            return;
        else{                   //no empty cell -> remember this choose
            chosenCell = cell;
            markLegalMoves(piece);
        }
    }
    else{
        const movingPiece = chosenCell.dataset.piece
        const chosenCellArray = elementToCell.get(chosenCell)
        const legal = legalMoves(movingPiece , chosenCellArray);
        if ( arrayIncludes(legal , elementToCell.get(cell) ) ){
            movePiece(chosenCell.dataset.piece , chosenCell , cell)
            whiteTurn = !whiteTurn
            if ( checkForMate(getColor(movingPiece) == "w" ? "b" : "w") ){  
                if (isThreatened( (getColor(movingPiece) == "w" ? "b" : "w") ,findKingCell(getColor(movingPiece) == "w" ? "b" : "w")) )
                    endGame(getColor(movingPiece))
                else
                    endGame("s")
            }
        }
        unmarkLegalMoves();
        chosenCell = null;
    }
}
function markLegalMoves(piece) {
    const legalTurn = whiteTurn & getColor(piece)=='w' || !whiteTurn && getColor(piece)=='b'
    chosenCell.style.backgroundColor = "rgb(138, 204, 31)"
    movesToHighlight = !legalTurn? [] :  legalMoves(chosenCell.dataset.piece ,
                                         elementToCell.get(chosenCell) )
    movesToHighlight.forEach( move => highlightedSquares.push(document.querySelector(`.row${move[0]} .col${move[1]}`)) )
    highlightedSquares.forEach( cell => { cell.style.backgroundColor = 'rgb(247,234,150)';
                                        //   cell.style.opacity = '70%';
                                        //   cell.style.boxShadow = 'rgba(50, 50, 93, 0.25)' ;
                                                 } )
}
function unmarkLegalMoves() {
    chosenCell.removeAttribute("style")
    highlightedSquares.forEach( cell => cell.removeAttribute("style") )
    highlightedSquares = [];
}
function possibleMoves(pieceString , cell){
    //TODO: Pion reaches end line
    switch (pieceString){
        case "wP":
            return calculatePionMoves(pieceString , cell).filter(inBoard)
        case "bP":
            return calculatePionMoves(pieceString , cell).filter(inBoard)
        case "wN":
            return calculateKnightMoves(cell).filter(inBoard)
        case "bN":
            return calculateKnightMoves(cell).filter(inBoard)
        case "wB":
            return calculateBishopMoves(pieceString , cell)
        case "bB":
            return calculateBishopMoves(pieceString , cell)
        case "wR":
            return calculateRookMoves(pieceString , cell)
        case "bR":
            return calculateRookMoves(pieceString , cell)
        case "wQ":
            return calculateQueenMoves(pieceString,cell)
        case "bQ":
            return calculateQueenMoves(pieceString,cell)
        case "wK":
            return calculateKingMoves(cell).filter(inBoard)
        case "bK":
            return calculateKingMoves(cell).filter(inBoard)
    }
    return null;            
}
function legalMoves(pieceString , cell){
    //check if the player who's turn is tries to make a move
    if (   !(whiteTurn & getColor(pieceString)=='w' || !whiteTurn && getColor(pieceString)=='b')  ) 
        return [];

    const possMoves = possibleMoves(pieceString , cell);
    switch (pieceString){
        case "wP":
            return possMoves.filter( move => [0,7,8,9,10,11,12].includes(board[move[0]-1][move[1]-1])).
                             filter( move => !checkForChess("wP" , cell , move))
        case "bP":
            return possMoves.filter( move => [0,1,2,3,4,5,6].includes(board[move[0]-1][move[1]-1])).
                             filter( move => !checkForChess("bP" , cell , move))
        case "wN":
            return possMoves.filter( move => [0,7,8,9,10,11,12].includes(board[move[0]-1][move[1]-1])).
                             filter (move => !checkForChess("wN" , cell , move))
        case "bN":
            return possMoves.filter( move => [0,1,2,3,4,5,6].includes(board[move[0]-1][move[1]-1])).
                             filter (move => !checkForChess("bN" , cell , move))
        case "wR":
            return possMoves.filter (move => !checkForChess("wR" , cell , move) )
        case "bR":
            return possMoves.filter (move => !checkForChess("bR" , cell , move) )
        case "wQ":
            return possMoves.filter (move => !checkForChess("wQ" , cell , move) ) 
        case "bQ":
            return possMoves.filter (move => !checkForChess("bQ" , cell , move) ) 
        case "wK":
            return possMoves.filter( move => [0,7,8,9,10,11,12].includes(board[move[0]-1][move[1]-1])).
                             filter (move => !checkForChess("wK" , cell , move) ) 
        case "bK":
            return possMoves.filter( move => [0,1,2,3,4,5,6].includes(board[move[0]-1][move[1]-1])).
                             filter (move => !checkForChess("bK" , cell , move) )                             
        case "wB":
            return possMoves.filter (move => !checkForChess("wB" , cell , move) )  
        case "bB":
            return possMoves.filter (move => !checkForChess("bB" , cell , move) )  

    }
}
function calculatePionMoves(pieceString , cell){
    const row = cell[0] , col = cell[1];
    let moves = pieceString == "wP" && row == 7 && board[4][col-1] == 0 ? [[5,col]] : pieceString == "bP" && row == 2 && board[3][col-1]==0 ? [[4,col]] : [] ;  
    if (pieceString == "wP"){
        if (board[row-2][col-1] == 0)               
            moves.push([row-1,col]);
        if ([7,8,9,10,11,12].includes(board[row-2][col-2]))
            moves.push([row-1,col-1]);
        if ([7,8,9,10,11,12].includes(board[row-2][col]))
            moves.push([row-1,col+1]);
    }
    else{
        if (board[row][col-1] == 0)
            moves.push([row+1,col]);
        if ([1,2,3,4,5,6].includes(board[row][col-2]))
            moves.push([row+1,col-1])
        if ([1,2,3,4,5,6].includes(board[row][col]))
            moves.push([row+1,col+1])
    }
    return moves;
}
function calculateKnightMoves(cell){
    const row = cell[0] , col = cell[1];
    return  [[row-1,col-2],[row-1,col+2],[row+1,col-2],[row+1,col+2],
             [row-2,col-1],[row-2,col+1],[row+2,col-1],[row+2,col+1]].
             filter( inBoard );
}
function calculateRookMoves(pieceString , cell){
    const row = cell[0]-1 , col = cell[1]-1 , color = getColor(pieceString);
    const moves = [];
    for (let i=col+1 ; i<8; i++){      //getting the cells to the right of the rook
        if (board[row][i] == 0)
            moves.push([row+1,i+1]);
        else {
            if ( (color == 'w' && ![1,2,3,4,5,6].includes(board[row][i])) ||  (color == 'b' && ![7,8,9,10,11,12].includes(board[row][i])) )
                moves.push([row+1,i+1]); 
            break;
        }
    }
    for (let i=col-1 ; i>=0 ; i--){      //getting the cells to the left of the rook
        if (board[row][i] == 0)
            moves.push([row+1,i+1]);
        else {
            if ( (color == 'w' && ![1,2,3,4,5,6].includes(board[row][i])) ||  (color == 'b' && ![7,8,9,10,11,12].includes(board[row][i])) )
                moves.push([row+1,i+1]); 
            break;
        }
    }
    for (let i=row+1 ; i<8 ; i++){      //getting the cells to the bottom of the rook
        if (board[i][col] == 0)
            moves.push([i+1,col+1]);
        else {
            if ( (color == 'w' && ![1,2,3,4,5,6].includes(board[i][col])) ||  (color == 'b' && ![7,8,9,10,11,12].includes(board[i][col])) )
                moves.push([i+1,col+1]); 
            break;
        }
    }
    for (let i=row-1 ; i>=0 ; i--){      //getting the cells to the top of the rook
        if (board[i][col] == 0)
            moves.push([i+1,col+1])
        else {
            if ( (color == 'w' && ![1,2,3,4,5,6].includes(board[i][col])) ||  (color == 'b' && ![7,8,9,10,11,12].includes(board[i][col])) ){
                moves.push([i+1,col+1]); 
            }
            break;
        }
    }
    return moves;
}
function calculateBishopMoves(pieceString , cell){
    const row = cell[0]-1 , col = cell[1]-1 , color = getColor(pieceString);
    const moves = [];
    let i=row-1 , j=col-1;
    while (0<=i && i<=7 && 0<=j && j<=7){
        if (board[i][j] == 0)
            moves.push([i+1,j+1]);
        else{
            if ( (color == 'w' && ![1,2,3,4,5,6].includes(board[i][j])) || (color == 'b' && ![7,8,9,10,11,12].includes(board[i][j])) )
                moves.push([i+1,j+1]);
            break;
        }
        i--;
        j--;
    }
    i = row-1;
    j = col+1;
    while (0<=i && i<=7 && 0<=j && j<=7){
        if (board[i][j] == 0)
            moves.push([i+1,j+1]);
        else{
            if ( (color == 'w' && ![1,2,3,4,5,6].includes(board[i][j])) || (color == 'b' && ![7,8,9,10,11,12].includes(board[i][j])) )
                moves.push([i+1,j+1]);
            break;
        }
        i--;
        j++;
    }
    i = row+1;
    j = col+1;
    while (0<=i && i<=7 && 0<=j && j<=7){
        if (board[i][j] == 0)
            moves.push([i+1,j+1]);
        else{
            if ( (color == 'w' && ![1,2,3,4,5,6].includes(board[i][j])) || (color == 'b' && ![7,8,9,10,11,12].includes(board[i][j])) )
                moves.push([i+1,j+1]);
            break;
        }
        i++;
        j++;
    }
    i = row+1;
    j = col-1;
    while (0<=i && i<=7 && 0<=j && j<=7){
        if (board[i][j] == 0)
            moves.push([i+1,j+1]);
        else{
            if ( (color == 'w' && ![1,2,3,4,5,6].includes(board[i][j])) || (color == 'b' && ![7,8,9,10,11,12].includes(board[i][j])) )
                moves.push([i+1,j+1]);
            break;
        }
        i++;
        j--;
    }
    return moves;
}
function calculateQueenMoves(pieceString,cell){
    return calculateRookMoves(pieceString , cell).concat(calculateBishopMoves(pieceString , cell));
}
function calculateKingMoves(cell){
    const row = cell[0] , col = cell[1] ;
    let moves =  [[row-1,col] ,[row+1,col] ,[row,col-1] ,[row,col+1] ,[row-1,col-1] ,[row+1,col+1] ,[row-1,col+1] ,[row+1,col-1]];

    let color = getColor ( numToPiece[ board[cell[0]-1][cell[1]-1] ]);
    moves = moves.concat (addCastlesMoves(color));
    return moves;
}

function checkForChess(movingPiece , originCell , destCell){
    const color = getColor(movingPiece)
    const attackingPlayer = color == "w" ? "b" : "w" ;
    
    //simulating  the move
    const eatenPiece = numToPiece[board[destCell[0]-1][destCell[1]-1]];
    board[destCell[0]-1][destCell[1]-1] = pieceToNum[movingPiece]   // dest   <= movingPiece
    board[originCell[0]-1][originCell[1]-1] = 0  
    
    const defenderKingCell = findKingCell(color)
    let checkP = false;
    let checkN = false;
    let checkR = false;
    let checkB = false;
    let checkK = false;
    let checkQ = false;

    //attack from a pion
    checkP = attackingPlayer == "w" ? defenderKingCell[0]>6 ? false : [board[defenderKingCell[0]+1-1][defenderKingCell[1]-1-1] , board[defenderKingCell[0]+1-1][defenderKingCell[1]+1-1]].includes(1) :  
                                      defenderKingCell[0]<3 ? false : [board[defenderKingCell[0]-1-1][defenderKingCell[1]-1-1] , board[defenderKingCell[0]-1-1][defenderKingCell[1]+1-1]].includes(7) ;
    
    // attack from a knight
    checkN = attackingPlayer == "w" ? calculateKnightMoves(defenderKingCell).some( cell => board[cell[0]-1][cell[1]-1] == 3) :
                                              calculateKnightMoves(defenderKingCell).some( cell => board[cell[0]-1][cell[1]-1] == 9) ;
    //attack from a rook
    checkR =  attackingPlayer == "w" ? calculateRookMoves("bR",defenderKingCell).some( cell => board[cell[0]-1][cell[1]-1] == pieceToNum["wR"]) :
                                              calculateRookMoves("wR",defenderKingCell).some( cell => board[cell[0]-1][cell[1]-1] == pieceToNum["bR"]) ;
    //attack from a bishop
    checkB = attackingPlayer == "w" ? calculateBishopMoves("bB",defenderKingCell).some( cell => board[cell[0]-1][cell[1]-1] == pieceToNum["wB"]) :
                                              calculateBishopMoves("wB",defenderKingCell).some( cell => board[cell[0]-1][cell[1]-1] == pieceToNum["bB"]) ;

    //attack from a king
    checkK  = attackingPlayer == "w" ? calculateKingMoves(defenderKingCell).filter(inBoard).some( cell => board[cell[0]-1][cell[1]-1] == pieceToNum["wK"]) :
                                       calculateKingMoves(defenderKingCell).filter(inBoard).some( cell => board[cell[0]-1][cell[1]-1] == pieceToNum["bK"])


    //attack from a queen
    checkQ = attackingPlayer == "w" ? calculateRookMoves("bR",defenderKingCell).
                                      concat(calculateBishopMoves("bB",defenderKingCell)).
                                      some( cell => board[cell[0]-1][cell[1]-1] == pieceToNum["wQ"]) :
                                      calculateRookMoves("wR",defenderKingCell).
                                      concat(calculateBishopMoves("wB",defenderKingCell)).
                                      some( cell => board[cell[0]-1][cell[1]-1] == pieceToNum["bQ"]) ;

                        
                
    board[originCell[0]-1][originCell[1]-1] = pieceToNum[movingPiece]
    board[destCell[0]-1][destCell[1]-1] = pieceToNum[eatenPiece]
    return checkP || checkN || checkR || checkB || checkK || checkQ ;                                          
}
function checkForMate(defenderPlayer) {
    const releventPieces = defenderPlayer == "w" ? [1,2,3,4,5,6] : [7,8,9,10,11,12]
    for (let r=0 ; r<8 ; r++){
        for (let c=0; c<8; c++){
            let piece = numToPiece[board[r][c]]
            if ( releventPieces.includes(pieceToNum[piece])){
                if (legalMoves(piece , [r+1,c+1]).length > 0)
                    return false;                
            }
        }
    }
    return true;
}
function endGame(winner){
    //TODO::: FINISH MATE POPUP HANDLING
    //TODO:: remove functionality of cells after mate
    let winner_message = document.querySelector(".winner_message")
    winner_message.appendChild(document.createTextNode(winner == "s" ? "Stalemate!" : "Mate!"))
    let winner_identity =  document.querySelector(".winner_identity")
    winner_message.style.display = "block"
    document.querySelector(".board:not(.winner_message)").style.opacity = "3%" ;
    if (winner != "s"){
        winner_identity.style.fontSize = "100px" 
        winner_identity.style.color = winner == "w" ? "white" : "black";
        let message = document.createTextNode(`${winner == "w" ? "White" : "Black"} Player Won!`) ;
        if (winner_identity.childNodes.length > 0)
            winner_identity.removeChild(winner_identity.firstChild)
        winner_identity.appendChild(message)
    }
    gameOver = true;

}
function removePieceFromArray(pieceString) {
    const color = getColor(pieceString);
    if (color == "w")
        whiteRemainingPieces.splice(whiteRemainingPieces.indexOf(pieceString) , 1);
    else
        blackRemainingPieces.splice(blackRemainingPieces.indexOf(pieceString) , 1);
        
}
function initMaps(){
    elementToCell = new Map();
    for (let row=1 ; row<=8 ; row++){
        for (let col=1 ; col<=8 ; col++){
            let elem = document.querySelector(`.row${row} .col${col}`)
            elementToCell.set( elem , [row,col] )
        }
    }
}
function findKingCell(color) {
    const target = color == "w" ? 6 : 12;
    for (let i=0 ;i<=7 ; i++){
        for (let j=0 ;j<=7 ; j++){
            if (target == board[i][j])
                return [i+1,j+1];
        }
    }
    return -1;
}
function hideMateMessage(){
    document.querySelector(".winner_message").style.display = "none"
    document.querySelector(".board:not(.winner_message)").style.opacity = "100%" ;
}

function initPiecesFromPion() {
    const pieces = ["R" , "N" , "B" , "Q"];
    for (let p of pieces){
        let elW = document.createElement("img");
        let elB = document.createElement("img");
        elW.setAttribute("src" , `images/w${p}.png`);
        elB.setAttribute("src" , `images/b${p}.png`);
        piecesFromPionWhite.push(elW)
        piecesFromPionBlack.push(elB)
    }
}

function addPieceFromPion(cell , color){
    let pics = document.querySelector(".piece_choose");
    pics.style.display = "block"
    let elements = color == "w" ? piecesFromPionWhite : piecesFromPionBlack;
    elements.forEach( el => pics.appendChild(deepCopyElement(el)))
    pics.style.display = "flex"
    const children = pics.children
    for (let i=0 ; i < children.length ; i++ )
        children[i].addEventListener('click' , e => replace(cell , children[i]))
}

function replace(cell , piecePic){
    const pieceString = piecePic.src.substring(29,31)
    const cellPair = elementToCell.get(cell)
    //replacing the board
    board[cellPair[0]-1][cellPair[1]-1] = pieceToNum[pieceString]
    
    //replacing the elements
    cell.dataset.piece = pieceString
    cell.removeChild(cell.firstElementChild)
    cell.appendChild(deepCopyElement(piecePic))
    hideResetPieceChoosingMenu();

}

function checkForEmptyPath(rookCell , kingCell){
    let left = Math.min(rookCell[1] , kingCell[1]) , right = Math.max(rookCell[1] , kingCell[1]) ; 
    let sumPieces = 0 , row = rookCell[0];
    for (let i=left+1 ; i< right-1 ; i++){
        sumPieces += board[row-1][i-1];
    }
    return sumPieces == 0 ? true : false;
}
function castle(color , oldKingCell , oldRookCell) {
    if (color == "w")   
        wKMove = true;
    else
        bKMove = true;

    let oldKingCellElement = cellToElement(oldKingCell)
    let oldRookCellElement = cellToElement(oldRookCell)
    let newKingCell = oldRookCell[1] == 1 ? [oldKingCell[0] , 3] : [oldKingCell[0] , 7];
    let newRookCell = oldRookCell[1] == 1 ? [oldRookCell[0] , 4] : [oldRookCell[0] , 6];
    let newKingCellElement = cellToElement(newKingCell) , newRookCellElement = cellToElement(newRookCell); 
    
    //updating the board
    updateBoard("none",oldKingCell);
    updateBoard("none",oldRookCell);
    updateBoard(`${color}K`,newKingCell);
    updateBoard(`${color}R`,newRookCell);
    
    //updating the html
    const rookImg = oldRookCellElement.firstElementChild ;  //saving the rook img
    const kingImg = oldKingCellElement.firstElementChild ;  //saving the king img

    oldKingCellElement.removeChild(oldKingCellElement.firstChild);  //analog to 602
    oldKingCellElement.dataset.piece = "none"
    oldRookCellElement.removeChild(oldRookCellElement.firstChild);  ////analog to 603
    oldRookCellElement.dataset.piece = "none"
    newKingCellElement.appendChild(kingImg)         //analog to 604
    newKingCellElement.dataset.piece = `${color}K`
    newRookCellElement.appendChild(rookImg)         //analog to 605
    newRookCellElement.dataset.piece = `${color}R`
}
function addCastlesMoves(color) {
    let moves = []
    if ( color == 'w' && !wKMove){ 
        if (!leftwRMove && checkForEmptyPath([8,1],[8,5]) ){
            if ([ [8,1] , [8,2] , [8,3] , [8,4] , [8,5] ].every(cell => !isThreatened("w" , cell)) ) 
                moves.push([8,3]);
        }
        if (!rightwRMove && checkForEmptyPath([8,8],[8,5]) ){
            if ([[8,5],[8,6],[8,7],[8,8]].every(cell => !isThreatened("w" , cell)) ) 
                moves.push([8,7]);       
        }
    }
    if (color == "b" && !bKMove){
        if (!leftbRMove && checkForEmptyPath([1,1],[1,5])){
            if ( [[1,1],[1,2],[1,3],[1,4],[1,5]].every(cell => !isThreatened("b" , cell)) )
                moves.push([1,3])
        }
        if (!rightbRMove && checkForEmptyPath([1,8],[1,5])){
            if ( [[1,5],[1,6],[1,7],[1,8]].every(cell => !isThreatened("b" , cell)) )
                moves.push([1,7])
        }
    }
    return moves;
}

function isThreatened(color , cell) {   //determines whether <cell> with a <color> piece on it is threatened
    let row = cell[0] , col = cell[1]
    let attackP = color == "w" ? row<3 ? false : [ board[row-1-1][col-1-1] , board[row-1-1][col-1+1] ].includes(pieceToNum["bP"]) :
                                 row>6 ? false : [ board[row+1-1][col-1-1] , board[row+1-1][col-1+1] ].includes(pieceToNum["wP"]) ;
    let attackN = calculateKnightMoves(cell).some( move => board[move[0]-1][move[1]-1] == (color == "w" ? pieceToNum["bN"] : pieceToNum["wN"]) )
    let attackB = calculateBishopMoves(`${color}B` , cell).some( move => board[move[0]-1][move[1]-1] == (color == "w" ? pieceToNum["bB"] : pieceToNum["wB"]) )
    let attackR = calculateRookMoves(`${color}R`, cell).some( move => board[move[0]-1][move[1]-1] == (color == "w" ? pieceToNum["bR"] : pieceToNum["wR"]) )
    let attackQ = calculateQueenMoves(`${color}Q` , cell).some( move => board[move[0]-1][move[1]-1] == (color == "w" ? pieceToNum["bQ"] : pieceToNum["wQ"]) )
    let attackK = [[row-1,col-1],[row-1,col],[row-1,col+1],[row,col-1],[row,col+1],[row+1,col-1],[row+1,col],[row+1,col+1]].
                  map ( cell => [cell[0]-1,cell[1]-1]).filter(cell => inBoard(cell)).includes(color == "w" ? "bK" : "wK") ;
    return attackP || attackN ||attackB || attackR || attackQ || attackK ;
}


function deepCopyElement(elem) {
    return elem.cloneNode(true);
}
function hideResetPieceChoosingMenu(){
    let menu = document.querySelector(".piece_choose");
    while(menu.childElementCount > 0){
        menu.removeChild(menu.firstChild)

    }
    document.querySelector(".piece_choose").style.display = "none";

}
//utils
function getRow(cell) {
    return Number(cell.parentElement.className.substring(7));
}
function getCol(cell) {
    return Number(cell.className.substring(8));
}
function getColor(pieceString){
    return pieceString.substring(0,1)
}
function arrayIncludes(bigger , smaller){
    return bigger.some(elem => JSON.stringify(elem)==JSON.stringify(smaller) )
}
function getPieceFromCell(cell){
    return cell.dataset.piece
}
function toggleNums (){
    const nums = document.querySelectorAll(".nums")
    const hidden = nums[0].style.display == "none" ? true : false ;
    nums.forEach (num  => num.style.display = hidden ? "flex" : "none" );
}
function printBoard(){
    let out = ``;
    for (let line of board){
        for (let cell of line){
            let p = numToPiece[cell];
            out += cell == 0 ? `${p}  ` : `${p}     `;
        }
        console.log(out)
        out = ``;
    }
}
function updateBoard(pieceString , destCell) {
    board[destCell[0]-1][destCell[1]-1] = pieceToNum[pieceString];
}
function initBoard(newBoard) {
    let el ; 
    for (let i=1 ; i <=8 ; i++){
        for (let j=1 ; j <=8 ; j++){
            let pieceString = numToPiece[newBoard[i-1][j-1]]
            updateBoard(pieceString , [i,j])
            el = document.querySelector(`.row${i} .col${j}`)
            resetCellElement(pieceString , el);
        }
    }
}
const inBoard = (pair) => (1<=pair[0] && pair[0]<=8 && 1<=pair[1] && pair[1]<=8) ;
const resetCellElement = (pieceString , cellElement) => {
    cellElement.dataset.piece = pieceString
    if (cellElement.childElementCount > 0)
        cellElement.removeChild(cellElement.firstElementChild);
    if (pieceString != "none"){
        let im = document.createElement("img");
        im.setAttribute("src" , `images/${pieceString}.png`)   
        cellElement.appendChild(im);
    } 
};



initialInit();

