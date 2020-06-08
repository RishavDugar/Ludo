var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


canvas.height = 480;
canvas.width = 480;

/////////VARIABLES
const box = 60;
var counter="A";
var score;
var inHome__A = 0;
var inHome__B = 0;
var token__A = 2;
var tokenA__InGame = 2;
var token__B = 2;
var tokenB__InGame = 2;
let token__A__cord = [];
let token__B__cord = [];
var posX,posY;
var distanceA = [];
var distanceB = [];
let rect = canvas.getBoundingClientRect();

var redHouse = new Image();
redHouse.src = "img/red.png";
var blueHouse = new Image();
blueHouse.src = "img/blue.png";
var chooseTokenDecider;

//////ASSIGNING COORDINATES TO TOKENS DEFAULT
token__A__cord[0] = {
    x : null,
    y : null,
    zVal : 0
}
token__A__cord[1] = {
    x : null,
    y : null,
    zVal : 0
}
token__B__cord[0] = {
    x : null,
    y : null,
    zVal : 0
}
token__B__cord[1] = {
    x : null,
    y : null,
    zVal : 0
}


//////DISTANCE TO HOME
distanceA[0]=27;
distanceA[1]=27;
distanceB[0]=27;
distanceB[1]=27;


//////REFRESHING TOKEN COUNT
function tokenRefresh(){
    document.getElementById("token__count__A").innerText = tokenA__InGame;
    document.getElementById("token__count__B").innerText = tokenB__InGame;
}
var tokenRefresh__interval = setInterval(tokenRefresh,400);

//////GRID MAKER
function grid() {

    canvas.style.backgroundColor="wheat";

   
    ctx.strokeStyle = "black";
    for(let i=0;i<8;i++){
        ctx.strokeRect(i*box,0,box,box);
    }
    for(let i=1;i<8;i++){
        ctx.strokeRect(7*box,i*box,box,box);
    }
    for(let i=0;i<7;i++){
        ctx.strokeRect(i*box,7*box,box,box);
    }
    for(let i=1;i<7;i++){
        ctx.strokeRect(0,i*box,box,box);
    }

    ctx.drawImage(redHouse,0,box);
    ctx.drawImage(blueHouse,7 * box, 6 * box);

    ctx.font="50px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    var symbol = '21D2';
    ctx.fillText(String.fromCharCode(parseInt(symbol,16)), box/2, box/1.4);

    ctx.font="50px Comic Sans MS";
    ctx.fillStyle = "blue";
    ctx.textAlign = "center";
    var symbol = '21D0';
    ctx.fillText(String.fromCharCode(parseInt(symbol,16)),7 * box + box/2, 7 * box + box/1.4);
}

///////SOUND
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}

var mySound = new sound("CAR-DOOR.mp3");

///////POPUP
function popupVisible(){
    document.getElementById("popup").style.visibility = "visible";
    setTimeout(function(){
        document.getElementById("popup").style.visibility = "hidden";
    },800);
}

///////DRAWING TOKEN
function drawToken(player,xcord,ycord,zcord,index){

    if(player == "A" && zcord == 0){

        //ctx.strokeStyle = "white";
        ctx.fillStyle = "red";
        //ctx.lineWidth = 7;
        ctx.fillRect(xcord * box+10, ycord * box+10, box-20, box-20);
        //ctx.strokeRect(xcord * box+10, ycord * box+10, box-20, box-20);
        ctx.font="30px Comic Sans MS";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(index +1, xcord * box + box/2, ycord * box + box/1.4);
    
    }
    else if(player == "B" && zcord == 0) {

        //ctx.strokeStyle = "white";
        ctx.fillStyle = "blue";
        //ctx.lineWidth = 7;
        ctx.fillRect(xcord * box+10, ycord * box+10, box-20, box-20);
        //ctx.strokeRect(xcord * box+10, ycord * box+10, box-20, box-20);
        ctx.font="30px Comic Sans MS";
        ctx.textAlign = "center";
        ctx.fillStyle ="white";
        ctx.fillText(index +1, xcord * box + box/2, ycord * box + box/1.4);
    }
    
}

//////REFRESHING THE TOKEN POSITIONS
function refreshToken(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    grid();

    for(let i=0;i<2-token__A;i++)

        drawToken("A",token__A__cord[i].x,token__A__cord[i].y,token__A__cord[i].zVal,i);

    for(let i=0;i<2-token__B;i++)

        drawToken("B",token__B__cord[i].x,token__B__cord[i].y,token__B__cord[i].zVal,i);

}

var refreshToken__interval = setInterval(refreshToken,200);

///////copy

function copyPos(counter,process){
    if(counter == "B"){
        token__A__cord[0].x = token__A__cord[1].x;
        token__A__cord[0].y = token__A__cord[1].y;
        token__A__cord[1].x = null;
        token__A__cord[1].y = null;
        distanceA[0]=distanceA[1];
        distanceA[1]=27;
        if(process == "home")
            token__A__cord[1].zVal = 1;
    }
    else {
        token__B__cord[0].x = token__B__cord[1].x;
        token__B__cord[0].y = token__B__cord[1].y;
        token__B__cord[1].x = null;
        token__B__cord[1].y = null;
        distanceB[0]=distanceB[1];
        distanceB[1]=27;
        if(process == "home")
            token__B__cord[1].zVal = 1;
    }
    
}

//////DISTANCE LEFT
function distanceLeft(value,player,flag){

    if(player == "A"){
        if(distanceA[flag]-value > 0)
            return 1;
        else if(distanceA[flag]-value < 0)
            return 0;
        else {
            
            inHome__A = inHome__A + 1;
            document.getElementById("home__A").innerText = inHome__A;

            if(inHome__A == 2){
                document.getElementById("winner").innerText = "Player A won!!";
                setTimeout(function(){
                    document.getElementById("gameOver").style.visibility = "visible";
                },400);
            }
            else{

                if(flag == 0 && token__A == 0){
                    copyPos(counter,"home");
                    token__A = 1;
                }
                else if(flag ==0 && token__A == 1){
                    token__A__cord[0].x = null;
                    token__A__cord[0].y = null;
                    //token__A__cord[0].zVal = 1;
                    token__A = 2;
                }
                else if(flag == 1){
                    token__A__cord[1].x = null;
                    token__A__cord[1].y = null;
                    token__A__cord[1].zVal = 1;
                    token__A = 1;
                }

                return 2;
            }
        }
    }
    else {
        if(distanceB[flag]-value > 0)
            return 1;
        else if(distanceB[flag]-value < 0)
            return 0;
        else {
            
            inHome__B = inHome__B + 1;
            document.getElementById("home__B").innerText = inHome__B;

            if(inHome__B == 2){
                document.getElementById("winner").innerText = "Player B won!!";
                setTimeout(function(){
                    document.getElementById("gameOver").style.visibility = "visible";
                },400);
            }
            else{

                if(flag == 0 && token__B == 0){
                    copyPos(counter,"home");
                    token__B = 1;
                }
                else if(flag ==0 && token__B == 1){
                    token__B = 2;
                    token__B__cord[0].x = null;
                    token__B__cord[0].y = null;
                    //token__B__cord[0].zVal = 1;
                }
                else if(flag == 1){
                    token__B__cord[1].x = null;
                    token__B__cord[1].y = null;
                    token__B__cord[1].zVal = 1;
                    token__B = 1;
                }

                return 2;
            }
        }      
    }

}


//////TAKING TOKEN OUT
function takeOut(counter){

        if(counter == "A" && tokenA__InGame != 0 ){
            
            token__A__cord[2-token__A].x=0;
            token__A__cord[2-token__A].y=0;
            distanceA[2-token__A]=27;

            tokenA__InGame -=1;
            token__A -=1;
        }
        else if(counter == "B" && tokenB__InGame != 0){
            
            token__B__cord[2-token__B].x=7;
            token__B__cord[2-token__B].y=7;
            distanceB[2-token__B]=27;

            tokenB__InGame -=1;
            token__B -=1;
        }
}
////////CLICK ON TOKEN

function clickOnToken(userX,userY,selectTokenX,selectTokenY){
    
    if( userX>(selectTokenX * box) && userX<((selectTokenX+1) * box) && userY>(selectTokenY * box) && userY<((selectTokenY+1) * box) )
        return true;
    else
        return false;

}

///////MOVE TOKEN

function moveToken(score,counter,flag) {

    var xcord,ycord;

    if(counter == "A"){
        xcord = token__A__cord[flag].x;
        ycord = token__A__cord[flag].y;
    }
    else {
        xcord = token__B__cord[flag].x;
        ycord = token__B__cord[flag].y;
    }
    
    while(score){
        if(xcord<7 && ycord==0){
            xcord=xcord+1;
        }
        else if(xcord==7 && ycord>=0 && ycord<7){
            ycord=ycord+1;
        }
        else if(xcord<=7 && xcord>0 && ycord==7){
            xcord=xcord-1;
        }
        else if(xcord==0 && ycord>0){
            ycord=ycord-1;
        }
        score=score-1;
    }

    if(counter == "A"){
        token__A__cord[flag].x = xcord;
        token__A__cord[flag].y = ycord;

        for(let i = 0;i<2-token__B;i++){
            if( xcord == token__B__cord[i].x && ycord == token__B__cord[i].y && (xcord != 7 || ycord !=7)){

                tokenB__InGame = tokenB__InGame + 1;
                distanceB[i] = 27;
                
                if(i == 0 && token__B == 0){
                    copyPos(counter,"attack");
                    token__B = 1;
                }
                else if(i == 0 && token__B == 1){
                    token__B__cord[i].x = null;
                    token__B__cord[i].y = null;
                    token__B = 2;
                }
                else if( i==1){
                    token__B__cord[i].x = null;
                    token__B__cord[i].y = null;
                    token__B = 1;
                }

            }
        }
    }
    else {
        token__B__cord[flag].x = xcord;
        token__B__cord[flag].y = ycord;

        for(let i = 0;i<2-token__A;i++){
            if( xcord == token__A__cord[i].x && ycord == token__A__cord[i].y && (xcord != 0 || ycord !=0)){
                
                distanceA[i] = 27;
                tokenA__InGame = tokenA__InGame + 1 ;

                if(i == 0 && token__A == 0){
                    copyPos(counter,"attack");
                    token__A = 1;
                }
                else if(i == 0 && token__A == 1){
                    token__A__cord[i].x = null;
                    token__A__cord[i].y = null;
                    token__A = 2;
                }
                else if( i==1){
                    token__A__cord[i].x = null;
                    token__A__cord[i].y = null;
                    token__A = 1;
                }
            }
        }
    }
    
    
}

///////MOVE DECIDING

function moveDecider(score,counter){

    if(score==6 && token__A==2 && counter == "A" && tokenA__InGame != 0){

        takeOut(counter);
    
    }

    else if(score==6 && token__B==2 && counter == "B" && tokenB__InGame != 0){

        takeOut(counter);
    
    }

    else if(score==6 && token__A==1 && counter == "A"){
        if(tokenA__InGame!=0){
            document.getElementsByClassName("chooseToken")[chooseTokenDecider].style.color ="white";
            document.getElementsByClassName("chooseToken")[chooseTokenDecider].onclick = function() {
                takeOut(counter);
                score=0;
                document.getElementsByClassName("chooseToken")[chooseTokenDecider].style.color ="rgb(119,119,119";
            }
        }
        
        canvas.addEventListener("click",(e) => {
            posX = e.clientX-rect.left;
            posY = e.clientY-rect.top;
            
            if(clickOnToken(posX,posY,token__A__cord[0].x,token__A__cord[0].y)){

                var distanceLeftValue = distanceLeft(score,counter,0);

                if(distanceLeftValue == 1){
                    moveToken(score,counter,0);
                    distanceA[0] = distanceA[0] - score;
                }
                else if( distanceLeftValue == 0){
                    document.getElementById("text").innerText = "This move is not possible!";
                    popupVisible();

                    if(tokenA__InGame!=0)
                        takeOut(counter);
                }
                else if( distanceLeftValue == 2){
                    mySound.play();
                    document.getElementById("text").innerText = "You have made it to HOME!";
                    popupVisible();

                }
            }
            score=0;
        });

    }

    else if(score==6 && token__B==1 && counter == "B"){
        if(tokenB__InGame!=0){
            document.getElementsByClassName("chooseToken")[chooseTokenDecider].style.color ="white";
            document.getElementsByClassName("chooseToken")[chooseTokenDecider].onclick = function() {
                takeOut(counter);
                score=0;
                document.getElementsByClassName("chooseToken")[chooseTokenDecider].style.color ="rgb(119,119,119";
            }
        }

        canvas.addEventListener("click",(e) => {
            posX = e.clientX-rect.left;
            posY = e.clientY-rect.top;

            if(clickOnToken(posX,posY,token__B__cord[0].x,token__B__cord[0].y)){

                var distanceLeftValue = distanceLeft(score,counter,0);

                if(distanceLeftValue == 1){
                    moveToken(score,counter,0);
                    distanceB[0] = distanceB[0] - score;
                } 
                else if( distanceLeftValue == 0){
                    document.getElementById("text").innerText = "This move is not possible!";
                    popupVisible();

                    if(tokenB__InGame!=0)
                        takeOut(counter);
                }
                else if(distanceLeftValue == 2){
                    mySound.play();
                    document.getElementById("text").innerText = "You have made it to HOME!";
                    popupVisible();

                }
            }
            score=0;
        });
    
    }

    else if(token__A==1 && counter == "A"){

        var distanceLeftValue = distanceLeft(score,counter,0);

        if(distanceLeftValue == 1){
            moveToken(score,counter,0);
            distanceA[0] = distanceA[0] - score;
        }
        else if(distanceLeftValue == 2){
            mySound.play();
            document.getElementById("text").innerText = "You have made it to HOME!";
            popupVisible();

        }
        else if(distanceLeftValue == 0){
            document.getElementById("text").innerText = "This move is not possible!";
            popupVisible();

        }

        score=0;

    }

    else if(token__B==1 && counter == "B"){

        var distanceLeftValue = distanceLeft(score,counter,0);

        if(distanceLeftValue == 1){
            moveToken(score,counter,0);
            distanceB[0] = distanceB[0] - score;
        }
        else if(distanceLeftValue == 2){
            mySound.play();
            document.getElementById("text").innerText = "You have made it to HOME!";
            popupVisible();

        }
        else if(distanceLeftValue == 0){
            document.getElementById("text").innerText = "This move is not possible!";
            popupVisible();

        }
        
        score=0;

    }
    
    else if(token__A==0 && counter == "A"){

        canvas.addEventListener("click",(e) => {
            posX = e.clientX-rect.left;
            posY = e.clientY-rect.top;

            if(clickOnToken(posX,posY,token__A__cord[1].x,token__A__cord[1].y)) {

                var distanceLeftValue=distanceLeft(score,counter,1);
                
                if(distanceLeftValue == 1){
                    moveToken(score,counter,1);
                    distanceA[1] = distanceA[1] - score;
                }
                else if(distanceLeftValue == 2){
                    mySound.play();
                    document.getElementById("text").innerText = "You have made it to HOME!";
                    popupVisible();

                }
                else if(distanceLeftValue == 0){
                    document.getElementById("text").innerText = "This move is not possible!";
                    popupVisible();


                    var distValue = distanceLeft(score,counter,0);

                    if(distValue == 1){
                        moveToken(score,counter,0);
                        distanceA[0] = distanceA[0] - score;
                    }
                    else if(distValue == 2){
                        document.getElementById("text").innerText = "The token has made it to HOME!";
                        popupVisible();

                    }
                    else if(distValue == 0){
                        document.getElementById("text").innerText = "No move possible! Next player's turn...";
                        popupVisible();
                    }
                }
    
                score=0;

            }

            else if(clickOnToken(posX,posY,token__A__cord[0].x,token__A__cord[0].y)){

                var distanceLeftValue=distanceLeft(score,counter,0);
                
                if(distanceLeftValue == 1){
                    moveToken(score,counter,0);
                    distanceA[0] = distanceA[0] - score;
                }
                else if(distanceLeftValue == 2){
                    mySound.play();
                    document.getElementById("text").innerText = "You have made it to HOME!";
                    popupVisible();


                }
                else if(distanceLeftValue == 0){
                    document.getElementById("text").innerText = "This move is not possible!";
                    popupVisible();


                    
                    var distValue = distanceLeft(score,counter,1);

                    if(distValue == 1){
                        moveToken(score,counter,1);
                        distanceA[1] = distanceA[1] - score;
                    }
                    else if(distValue == 2){
                        document.getElementById("text").innerText = "The token has made it to HOME!";
                        popupVisible();

                    }
                    else if(distValue == 0){
                        document.getElementById("text").innerText = "No move possible! Next player's turn...";
                        popupVisible();
                    }
                }
    
                score=0;

            }
        });

    }

    else if(token__B==0 && counter == "B"){

        canvas.addEventListener("click",(e) => {
            posX = e.clientX-rect.left;
            posY = e.clientY-rect.top;


            if(clickOnToken(posX,posY,token__B__cord[1].x,token__B__cord[1].y)){

                var distanceLeftValue=distanceLeft(score,counter,1);

                
                if(distanceLeftValue == 1){
                    moveToken(score,counter,1);
                    distanceB[1] = distanceB[1] - score;
                }
                else if(distanceLeftValue == 2){
                    mySound.play();
                    document.getElementById("text").innerText = "You have made it to HOME!";
                    popupVisible();


                }
                else if(distanceLeftValue == 0){
                    document.getElementById("text").innerText = "This move is not possible!";
                    popupVisible();


                    var distValue = distanceLeft(score,counter,0);

                    if(distValue == 1){
                        moveToken(score,counter,0);
                        distanceA[0] = distanceA[0] - score;
                    }
                    else if(distValue == 2){
                        document.getElementById("text").innerText = "The token has made it to HOME!";
                        popupVisible();

                    }
                    else if(distValue == 0){
                        document.getElementById("text").innerText = "No move possible! Next player's turn...";
                        popupVisible();
                    }
                }
    
                score=0;

            }
            else if(clickOnToken(posX,posY,token__B__cord[0].x,token__B__cord[0].y)){

                var distanceLeftValue=distanceLeft(score,counter,0);
                
                if(distanceLeftValue){
                    moveToken(score,counter,0);
                    distanceB[0] = distanceB[0] - score;
                }
                else if(distanceLeftValue == 2){
                    mySound.play();
                    document.getElementById("text").innerText = "You have made it to HOME!";
                    popupVisible();

                }
                else if(distanceLeftValue == 0){
                    document.getElementById("text").innerText = "This move is not possible!";
                    popupVisible();


                    var distValue = distanceLeft(score,counter,1);

                    if(distValue == 1){
                        moveToken(score,counter,1);
                        distanceA[1] = distanceA[1] - score;
                    }
                    else if(distValue == 2){
                        document.getElementById("text").innerText = "The token has made it to HOME!";
                        popupVisible();

                    }
                    else if(distValue == 0){
                        document.getElementById("text").innerText = "No move possible! Next player's turn...";
                        popupVisible();
                    }
                }
    
                score=0;

            }
        });

    }

}

///////ROLLING DICE

function svgRemover(){
    setTimeout(function (){
        document.getElementById("svg-container").style.visibility = "hidden";
    },1000);
}

function rollAuto(){
    chooseTokenDecider=0;
    document.getElementById("svg-container").style.visibility = "visible";
    score=Math.floor(Math.random() * 6 + 1);
    svgRemover();
    document.getElementById("turn__value").innerText = "Score of "+counter+" :"+score;
    moveDecider(score,counter);
    setTimeout(function(){
        if(score!=6){
            if(counter=="A"){
                document.getElementById("player__name").innerText = "B";
                counter="B";
            }
            else{
                document.getElementById("player__name").innerText = "A";
                counter="A";
            }
        }
        else {   
            document.getElementById("text").innerText = "You get one more chance!";
            popupVisible();
        }
    },1100);
}

function rollManual(){
    chooseTokenDecider=1;
        score=document.getElementById("user").value;

        if(score<1 || score>6){
            document.getElementById("text").innerText = "Enter number between 1 to 6!";
        }
        else{
            document.getElementById("turn__value__Manual").innerText = "Score of "+counter+" :"+score;
            moveDecider(score,counter);
            setTimeout(function(){
                if(score!=6){

                    if(counter=="A"){
                        document.getElementById("player__name__Manual").innerText = "B";
                        counter="B";

                    }
                    else{
                        document.getElementById("player__name__Manual").innerText = "A";
                        counter="A";
                    }

                }
                else {   
                    document.getElementById("text").innerText = "You get one more chance!";
                    popupVisible();
                }
                
            },100);
        }
    
}

function playerChanger(){
    if(document.getElementById("playSelector").checked == true){
        document.getElementById("turn-container__Auto").style.visibility = "hidden";
        document.getElementById("turn-container__Manual").style.visibility = "visible";
    }
    else{
        document.getElementById("turn-container__Manual").style.visibility = "hidden";
        document.getElementById("turn-container__Auto").style.visibility = "visible";
    }
}

function reloader(){
    window.location.reload();
}

