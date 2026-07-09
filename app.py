from flask import Flask,render_template,jsonify,request
from game import get_move,reset_game

app = Flask(__name__)

# Serves the application home page
# every refresh the index.html load from the start which will reset the game scores
@app.route("/")
def home():
    # function will reset the board and start the board from the new state 
    reset_game()
    # returns the response : render index.html template
    return render_template("index.html")

#Resest the board without changing the scores
@app.route("/reset",methods = ["POST"])
def reset():
    # function will reset the board and start the board from the new state
    reset_game()
    #returns the json response
    return jsonify({
        "success":True,
    })

# Will take the user click and check the logic for right and wrong move
@app.route("/move",methods = ["POST"])
def move():
    data = request.get_json()
    cell = int(data["cell"]) - 1
    result = get_move(cell)
    # return the json response which have information related to winner and which turn
    return jsonify(result)
    
if __name__ == "__main__":
    app.run(debug=True)