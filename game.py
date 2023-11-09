def new_board():
    return [[0,0,0],
            [0,0,0],
            [0,0,0]]

def check_game_over(board):
    # Check rows, columns, and diagonals
    for i in range(3):
        if board[i][0] == board[i][1] == board[i][2] != 0 or \
           board[0][i] == board[1][i] == board[2][i] != 0:
            return True, board[i][i]

    if board[0][0] == board[1][1] == board[2][2] != 0 or \
       board[0][2] == board[1][1] == board[2][0] != 0:
        return True, board[1][1]

    # Check for a draw
    if all(cell != 0 for row in board for cell in row):
        return True, 0

    return False, None


players = {
    "X": "player1",
    "O": "player2"
}

game = {
    "active_board": -1,
    "board": [new_board() for i in range(10)],
    "locked_board": [],
    "players" : players,
    "x_turn": True,
    "gameover": False
}
def play(game, position):
    board = game["board"]
    print(game["active_board"] != -1 )
    if (board[position[2]][position[1]][position[0]] != 0 or 
        (game["active_board"] != -1 and game["active_board"] != position[2]) or 
        position[2] in game["locked_board"] or
        not 0 <= position[0] <= 2 or
        not 0 <= position[1] <= 2 or
        not 0 <= position[2] <= 8):
        print("INVALID MOVE")
        return
    else:
        board[position[2]][position[1]][position[0]] = 1 if game["x_turn"] else 2
        game["x_turn"] = not game["x_turn"]
        new_active = position[1] * 3 + position[0]
        game["active_board"] = new_active if new_active not in game["locked_board"] else -1

        print(board)
    for n, i in enumerate(game["board"][:-1]):
        if n in game["locked_board"]:
            continue
        print(i, check_game_over(i))
        game_over, winner = check_game_over(i)
        if game_over:
            game["locked_board"].append(n)
            board[position[-1]][n//3][n % 3]

play(game, (1,2, 1))
play(game, (2,1, 1))


# # Example usage
# board = [[1, 2, 1],
#          [1, 2, 2],
#          [2, 2, 1]]

# game_over, winner = check_game_over(board)

# if game_over:
#     if winner != 0:
#         print(f"Player {winner} wins!")
#     else:
#         print("It's a draw!")
# else:
#     print("The game is not over yet.")

print(game)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def main():
    return {"data": game}