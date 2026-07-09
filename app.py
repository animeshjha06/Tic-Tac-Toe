from flask import Flask,render_template,jsonify,request
from game import get_move,reset_game

app = Flask(__name__)

@app.route("/")
def home():
    reset_game()
    return render_template("index.html")

@app.route("/reset",methods = ["POST"])
def reset():
    reset_game()
    return jsonify({
        "success":True,
    })

@app.route("/move",methods = ["POST"])
def move():
    data = request.get_json()
    cell = int(data["cell"]) - 1
    result = get_move(cell)
    return jsonify(result)
    
if __name__ == "__main__":
    app.run(debug=True)