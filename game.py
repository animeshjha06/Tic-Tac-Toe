board = [" "] * 9
turn = "X"
game_over = False

# check for valid and invalid moves and response accordingly
def get_move(cell):
    global turn,game_over

    # already have a winner
    if game_over:
        return {
            "valid" : False,
            "reason" : "game_over"
        }

    # cell is occupied
    if board[cell] != " ":
        return {
            "valid" : False,
            "reason" : "occupied"
        }
    
    symbol = turn
    # update the board
    board[cell] = turn
    winner = check_winner(symbol)

    if winner:
        game_over = True
        return{
            "valid" : True,
            "symbol" : symbol,
            "winner" : symbol,
            "winning_line" : winner,
            "draw" : False
        }
    # all the cells are occupied means game tied
    elif " " not in board:
        game_over = True
        return{
            "valid" : True,
            "symbol" : symbol,
            "winner" : None,
            "winning_line" : None,
            "draw" : True
        }
    
    # Update the turn after every move
    if turn == "X":
        turn = "O"
    else:
        turn = "X"

    # default game is not over 
    return{
        "valid" : True,
        "symbol" : symbol,
        "winner" : None,
        "winning_line" : None,
        "draw" : False
    }

# reset the board without changing scores
def reset_game():
    global board,turn,game_over
    board = [" "," "," "," "," "," "," "," "," "]
    turn = "X"
    game_over = False

# Check winner 
def check_winner(turn):
    lines = [
        # rows
        [0,1,2],
        [3,4,5],
        [6,7,8],
        #columns
        [0,3,6],
        [1,4,7],
        [2,5,8],
        #diagnols
        [0,4,8],
        [2,4,6]
    ]

    # check for winner and returns the line if we have one else return None
    for line in lines:
        if(board[line[0]] == board[line[1]] == board[line[2]]== turn ):
            return line
    return None