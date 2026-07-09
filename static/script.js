document.addEventListener("DOMContentLoaded",()=>{
    // catch every cell 
    const cells = document.querySelectorAll(".cell");
    let gameOver = false;

    // reset the board without changing the score 
    const reset = document.querySelector(".reset_button");
    reset.addEventListener("click",()=>{
        fetch("/reset",{
            method : "POST",
        })
        .then(response => response.json())
        .then(data => {
            gameOver = false;
            // clear the board and remove highlighted cells
            cells.forEach(cell => {
                cell.innerHTML = "";
                cell.classList.remove("winner_x","winner_o");
            })
            // clear the result message
            document.querySelector(".status-msg").textContent = ""
            // change the turn to X which is default
            document.querySelector(".turn_sign").innerHTML = 
            ' <img class="turn_sign_logo" src="/static/images/cross.png" alt=""> ';
        })
    });

    // Handle click for every cell
    cells.forEach(cell =>{
        cell.addEventListener("click",() =>{
            // if already have a winner not take further moves
            if(gameOver){return;}
            // check for invalid move and if user click already occupied cell will return without sending the request to server
            if (cell.innerHTML !== "") {
                return;
            }
            fetch("/move",{
                method: "POST",
                
                headers:{
                    "Content-Type": "application/json"
                },

                body:JSON.stringify({
                    cell: cell.id
                })
            })
            .then(response => response.json())
            .then(data => {

                // check for invalid moves
                if(data.valid == false){
                    return;
                }

                // Update the game board after every move with X and O images
                const turn_logo = document.querySelector(".turn_sign");
                if(data.symbol == "X"){
                    cell.innerHTML = ' <img class="img" src="/static/images/cross.png" alt=""> ';
                }else{
                    cell.innerHTML = ' <img class="img" src="/static/images/circle.png" alt=""> ';
                }

                // if we have winner
                if(data.winner){
                    // prevent the moves after game ends
                    gameOver = true;

                    // Display the winner name
                    const res = document.querySelector(".status-msg");
                    res.textContent = data.symbol + " wins!";

                    // update the score and highlight the winning line
                    if(data.symbol == "X"){
                        const score = document.querySelector(".x_score");
                        score.textContent = parseInt(score.textContent, 10) + 1;
                        data.winning_line.forEach(index => {
                            cells[index].classList.add("winner_x");
                        });
                    }else{
                        const score = document.querySelector(".o_score");
                        score.textContent = parseInt(score.textContent, 10) + 1;
                        data.winning_line.forEach(index => {
                            cells[index].classList.add("winner_o");
                        });
                    }
                // if game is drawn
                }else if(data.draw){
                    gameOver = true;
                    // update the score for tied section
                    const score = document.querySelector(".tie_score");
                    score.textContent = parseInt(score.textContent, 10) + 1;
                    // display tied message
                    const res = document.querySelector(".status-msg");
                    res.textContent = "Tied!";
                }else{
                    // update the turn section after every move
                    if(data.symbol == "X"){
                        turn_logo.innerHTML = ' <img class="turn_sign_logo" src="/static/images/circle.png" alt=""> ';
                    }else{
                        turn_logo.innerHTML = ' <img class="turn_sign_logo" src="/static/images/cross.png" alt=""> ';
                    }
                }
            })
        });
    });
});