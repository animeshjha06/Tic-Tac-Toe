document.addEventListener("DOMContentLoaded",()=>{
    const cells = document.querySelectorAll(".cell");
    let gameOver = false;

    const reset = document.querySelector(".reset_button");
    reset.addEventListener("click",()=>{
        fetch("/reset",{
            method : "POST",
        })
        .then(response => response.json())
        .then(data => {
            gameOver = false;
            cells.forEach(cell => {
                cell.innerHTML = "";
                cell.classList.remove("winner_x","winner_o");
            })

            document.querySelector(".status-msg").textContent = ""
            document.querySelector(".turn_sign").innerHTML = 
            ' <img class="turn_sign_logo" src="/static/images/cross.png" alt=""> ';
        })
    });

    cells.forEach(cell =>{
        cell.addEventListener("click",() =>{
            if(gameOver){return;}
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
                if(data.valid == false){
                    return;
                }
                const turn_logo = document.querySelector(".turn_sign");
                if(data.symbol == "X"){
                    cell.innerHTML = ' <img class="img" src="/static/images/cross.png" alt=""> ';
                }else{
                    cell.innerHTML = ' <img class="img" src="/static/images/circle.png" alt=""> ';
                }

                if(data.winner){
                    gameOver = true;
                    const res = document.querySelector(".status-msg");
                    res.textContent = data.symbol + " wins!";

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
                }else if(data.draw){
                    gameOver = true;
                    const score = document.querySelector(".tie_score");
                    score.textContent = parseInt(score.textContent, 10) + 1;
                    const res = document.querySelector(".status-msg");
                    res.textContent = "Tied!";
                }else{
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