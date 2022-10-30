/// DATA-FLOW: 
//   addWalls -> addRooms -> addRoads (generate roads and enemies on this roads)-> addLoot -> init 


const player = {
    el: false,
    x: 0,
    y: 0,
    step: 5,
    run: false,
    attack: false,
    direction: false,   
    hp: 100,
    damage: 25,
}

class Enemy {
    constructor(x,y,direction){
        this.x = x
        this.y = y
        this.direction = direction
    }
    el = false
    elHP = false
    hp = 100
    damage = 5
    x = 500
    y = 0
    step = 2
    get x(){
        return this.x
    }
    get y(){
        return this.y
    }
    set x(value){
        this.x = value
    }
    set y(value){
        this.y = value
    }
    
}



function Map(width,height){

    this.width = width
    this.height = height
    this.numOfRooms = getRandInt(5,7)
    this.roads = {
                roadsRow :  3 ,                        
                roadsColumn : 4,
            }
    this.loot = ['HP','HP','SW','SW','SW','SW','SW','SW','SW','SW','SW','SW']
    
    this.set= function(updatedArr,callback){
        let freeCells = []
        let arr = updatedArr
        callback(arr,freeCells,addRoads)   //callback = addRooms
    }
}



let map = new Map(20,10)
map.set(addWalls(),addRooms)



function addWalls(){

    let initialArr = new Array(map.height)

    for(let i=0; i<map.height; i++){
        initialArr[i] = new Array(map.width)
        for(let j=0; j<initialArr[i].length; j++){
            initialArr[i][j]='tileW'
        }
    }
    return initialArr
}

function addRooms(arr,freeCells,callback){
    let roomsData = addRoomsEndpoints();
    for(let k = 0; k<roomsData.length; k++){
        for(let i=roomsData[k].spawnY; i<roomsData[k].endSpawnY; i++){
            for(let j=roomsData[k].spawnX; j<roomsData[k].endSpawnX; j++){
                if(arr[i][j] !== 'tile'){
                    freeCells.push({x:j,y:i});
                    arr[i][j] = 'tile';
                }    
            }
        }
    }
    callback(arr,freeCells,addLoot)      //callbsck = addRoads
 }


 function addRoads(arr,freeCells,callback){
    let enemies = []
    for(let i = 0;i<map.roads.roadsColumn;i++){
        let lineX = getRandInt(0,map.width-1) 
        let en = new Enemy(lineX*50,getRandInt(0,map.height-1)*50,getRandInt(3,4))
        enemies.push(en)
            for(let j = 0;j<map.height;j++){  
                if(arr[j][lineX] !== 'tile'){
                    freeCells.push({x:lineX,y:j})
                    arr[j][lineX] = 'tile' 
                }       
        }
    };
    for(let i = 0;i<map.roads.roadsRow;i++){
        let lineY = getRandInt(0,map.height)
        if(arr[lineY]){
            let enemy = new Enemy(getRandInt(0,map.width-1)*50,lineY*50-4,getRandInt(1,2))
            enemies.push(enemy)
            for(let j = 0;j<map.width;j++){
                if (arr[lineY][j] !== "tile"){
                    freeCells.push({x:j,y:lineY});
                    arr[lineY][j] = 'tile';
                }
            }
        }
    };
    callback(arr,freeCells,enemies,init,freeCells)                // callback = addLoot
 }

 function addLoot(arr,freeCells,enemies,callback,freeCells){

    let randFreeCoord= shuffleArray(freeCells).slice(0,map.loot.length+1)  // plus coords of player
    for (let k=0; k<map.loot.length; k++){             
        let j = randFreeCoord[k].x              // x = width 
        let i = randFreeCoord[k].y             // y = height
        if(arr[i]){
            arr[i][j] = map.loot[k] 

        }
        
    }

    player.x = randFreeCoord[map.loot.length].x*50
    player.y =  randFreeCoord[map.loot.length].y*50
    callback(arr,enemies,freeCells)                    // callback = init
    
 }

 function shuffleArray(array){
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}

 function addRoomsEndpoints(){
    let rooms = getRoomsSizes(map.numOfRooms,map.width,map.height) 
    for (let i=0;i<rooms.length;i++){
        if (rooms[i].spawnX + rooms[i].width > map.width){
            rooms[i].endSpawnX = map.width     
        }
        else{
            rooms[i].endSpawnX = rooms[i].spawnX + rooms[i].width-1
        }
        if (rooms[i].spawnY + rooms[i].height > map.height){
            rooms[i].endSpawnY = map.height
        }
        else{
            rooms[i].endSpawnY = rooms[i].spawnY + rooms[i].height-1
        }
    }
    return rooms
 }
 
function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min+1) + min);
  }

function getRoomsSizes(count,x,y){        
    let arr = []
    for(let i=0; i<count; i++){
        arr.push({
            height:getRandInt(3,6),
            width:getRandInt(3,6),
            spawnX:getRandInt(0,x),
            spawnY:getRandInt(0,y),
            endSpawnX:false,
            endSpawnY:false,
        })

    }
    return arr
}

function game(res,fieldBox,enemies){              //render map + return obstructions for intervals()
    let obstructions = {
        enem :[],
        loot: []
    }
    
    let idGenerator = 0
    for(let i=0; i<map.height;i++){
        for(let j=0;j<map.width;j++){
           if(res[i][j] == 'tile'){
                fieldBox.innerHTML += 
                    `<div class="field">
                        <div class="field tile"></div>
                    </div>`
           }else if(res[i][j]=='tileW'){
                fieldBox.innerHTML += `<div class="tileW"></div>`
                
           }else if(res[i][j]=='HP'){
                fieldBox.innerHTML += 
                `<div class="field">
                    <div id="HP${idGenerator}" class="field tileHP"></div>
                </div>`     
                obstructions.loot.push({x:j*50, y:i*50,id:`HP${idGenerator}`})  
                idGenerator++    
            }else if(res[i][j]=='SW'){
                fieldBox.innerHTML += 
                `<div class="field">
                    <div id="SW${idGenerator}" class="field tileSW"></div>
                </div>`   
                obstructions.loot.push({x:j*50, y:i*50,id:`SW${idGenerator}`})  
                idGenerator++
            }    
    }}
    fieldBox.innerHTML += 
    `<div id = "player" class="field" style="position: absolute;left: ${player.x}px; top: ${player.y}px;">
        <hr class ="hp"style="position:relative; z-index:10; margin:0; width:${player.hp}%; border-top: 2px solid #00FF00"/>
        <div class="field tileP"></div>
    </div>`   // draw Player
  
        for (let i = 0;i<enemies.length;i++){
          
            fieldBox.innerHTML += 
            `<div id = "e${i}" class="field" style="position: absolute;left: ${enemies[i].x}px; top: ${enemies[i].y}px;">
                <hr  style="position:relative; margin:0;width:${enemies[i].hp}%; border-top: 2px solid #FF0000"/>
                <div  class="field tileE" ></div>
            </div>`            // draw enemies

            enemies[i].el = `e${i}`
            obstructions.enem.push(enemies[i])
        }

    player.el = document.getElementById('player')

    return obstructions
}

function moves(){
   
    document.addEventListener('keydown', (e)=>{ 
        switch(e.keyCode){
            case 37:               //LEFT
                player.run = true;
                player.direction = 4;
                break;
            case 38 :              // TOP 
                player.run = true;
                player.direction = 1;
                break;
            case 39:               //RIGHT
                player.run = true;
                player.direction= 2
                break;        
            case 40:              //BOTTOM
                player.run = true;
                player.direction = 3;
                break; 
            case 32:
                player.attack = true;
                break;
        }
    })

    document.addEventListener('keyup',(e)=>{
        if([37,38,39,40].includes(e.keyCode)){
            player.run = false;
        }else if (e.keyCode == 32){
            player.attack = false;
        }
        
    })
}


function intervals(fieldBox,obstructions,freeCells){

    let loot = obstructions.loot
    let enemies = obstructions.enem


    // PLAYER MOVE 

    setInterval(function(){
        if(player.run){
            switch(player.direction){
                case 1:  // top
                    if(player.y>0){
                        let free = freeCells.filter(function(value){
                            if (player.y > value.y*50 && 
                                (player.y - value.y*50)/player.step<=50/player.step &&  
                                 ((value.x*50>=player.x && (value.x*50 - player.x)/player.step<50/player.step) ||
                                 (value.x*50<=player.x &&(player.x - value.x*50)/player.step<50/player.step))
                                ){
                                return value  
                            }
                        })
                        if(free.length == 1 && free[0].x*50 == player.x){
                            player.y -= player.step
                            player.el.style.top = `${player.y}px`
                        }
                        if(free.length>1){
                            player.y -= player.step
                            player.el.style.top = `${player.y}px`

                        }
                    }
                    break;
                case 2: //right
                    if(player.x<map.width*50){
                        let free = freeCells.filter(function(value){
                            return  value.x*50 > player.x && (value.x*50 - player.x)/player.step<=50/player.step &&  
                                 ((value.y*50>=player.y && (value.y*50 - player.y)/player.step<50/player.step) ||
                                 (value.y*50<=player.y &&(player.y - value.y*50)/player.step<50/player.step))
                        })
                       
                      
                        if(free.length == 1 && free[0].y*50 == player.y){
                            player.x += player.step
                            player.el.style.left = `${player.x}px`
                        }
                        if(free.length>1){
                            player.x += player.step
                            player.el.style.left = `${player.x}px`

                        }
                    }
                    break;
                case 3:  // bottom
                    if(player.y<map.height*50){
                        let free = freeCells.filter(function(value){
                            if (value.y*50 > player.y && 
                                (value.y*50 - player.y)/player.step<=50/player.step &&  
                                 ((value.x*50>=player.x && (value.x*50 - player.x)/player.step<50/player.step) ||
                                 (value.x*50<=player.x &&(player.x - value.x*50)/player.step<50/player.step))
                                ){
                                return value
                            }
                        })
                        if(free.length == 1 && free[0].x*50 == player.x){
                            player.y += player.step
                            player.el.style.top = `${player.y}px`
                        }
                        if(free.length>1){
                            player.y += player.step
                            player.el.style.top = `${player.y}px`

                        }
                    }
                    break;
                case 4: //left
                    if(player.x>2){
                        let free = freeCells.filter(function(value){
                            if (player.x > value.x*50 && 
                                (player.x - value.x*50)/player.step<=50/player.step &&  
                                 ((value.y*50>=player.y && (value.y*50 - player.y)/player.step<50/player.step) ||
                                 (value.y*50<=player.y &&(player.y - value.y*50)/player.step<50/player.step))
                                ){
                                return value
                            }
                        })
                        console.log(free)
                        if(free.length == 1 && free[0].y*50 == player.y){
                            player.x -= player.step
                            player.el.style.left = `${player.x}px`
                        }
                        if(free.length>1){
                            player.x -= player.step
                            player.el.style.left = `${player.x}px`

                        }
                    }
                    break;

            }
          
        }
    },50,freeCells)
   

        //ENEMIES MOVE 

      setInterval(function(){

            for(let i=0;i<enemies.length;i++){
              
                     switch (enemies[i].direction) {
                        
                        case 1:            // left
                            if (enemies[i].x > 0) {
                                let elem = document.getElementById(enemies[i].el)
                                enemies[i].x -= enemies[i].step
                                elem.style.left = `${enemies[i].x}px`;
    
                            } else{ 
                                enemies[i].direction = 2;
                             }
                            break;
                        case 2:             //right
                            if (enemies[i].x < fieldBox.getBoundingClientRect().right - 64) {
                                let elem = document.getElementById(enemies[i].el)
                                enemies[i].x += enemies[i].step
                                elem.style.left = `${enemies[i].x}px`;
                            } else { 
                                enemies[i].direction = 1; 
                            }
                            break;
                        case 3:             //bottom
                            if (enemies[i].y < fieldBox.getBoundingClientRect().bottom -126) {
                                let elem = document.getElementById(enemies[i].el)
                                enemies[i].y += enemies[i].step
                                elem.style.top = `${enemies[i].y}px`;
                            } else { 
                                enemies[i].direction = 4; 
                            }
                            break;
                        case 4:             //top
                            if (enemies[i].y >0) {
                                let elem = document.getElementById(enemies[i].el)
                                enemies[i].y -= enemies[i].step
                                elem.style.top = `${enemies[i].y}px`;
    
                            } else{ 
                                enemies[i].direction = 3;
                             }
                            break;
                    }               
            }
      },50,enemies)      


    //CHECK LOOT

    setInterval(function(){
        if(player.run){
            try{
                for(let i=0;loot.length;i++){
                    
                    if( Math.abs(player.x-loot[i].x)<40 && Math.abs(player.y-loot[i].y)<40){
                        let el = document.getElementById(loot[i].id)
                        switch(loot[i].id[0]){
                            case "H":
                                if(player.hp!=100){
                                    player.hp+=25
                                    player.el.firstElementChild.style.width = `${player.hp}%`
                                    loot[i].x = -50    // to avoid if next time 
                                    el.classList.remove('tileHP')
                                    el.classList.add('tile')

                                   
                                }
                                break;
                            case "S":
                                player.damage+=5
                                loot[i] = -50
                                el.classList.remove('tileSW')
                                el.classList.add('tile')
                                break;
                        }
                    }
            }
            }catch(e){
                console.log('что-то пошло не так еще раз...... '+ e.message)
            }
        
        }
    },150,loot)


   // ATTACK           

    setInterval(function(){
        for(let i=0;i<enemies.length;i++){
            let enemy = enemies[i]
            let elem = document.getElementById(enemy.el)
            let xl = elem.getBoundingClientRect().left
            let yt = elem.getBoundingClientRect().top
            if(Math.abs(player.x+10-xl)<65 && Math.abs(player.y+73-yt)<65){
                player.hp-=enemy.damage
                player.el.firstElementChild.style.width = `${player.hp}%`
                if(player.attack){
                    enemy.hp-=player.damage
                    elem.firstElementChild.style.width = `${enemy.hp}%`
                }   
            }
            if(enemy.hp <= 0){
                elem.style.display = "none"
            }
            if(player.hp <= 0){
                player.el.remove()
            }
        }
      
    },150,enemies)
}

function init(arr,enemies,freeCells){                        // STARTS IN addLoot()
    let fieldBox = document.querySelector('#box')
    let obstructions = game(arr,fieldBox,enemies);
    moves();
    intervals(fieldBox,obstructions,freeCells);
}

