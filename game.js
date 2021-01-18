var gameOfLife = {
    width: 12, // cols(dimensiones alto y ancho del tablero)
    height: 12, //rows
    stepInterval: null, 
    // debería ser usada para guardar referencia a un intervalo que esta siendo jugado
  
    createAndShowBoard: function() {
      // crea el elemento <table>
      var goltable = document.createElement("tbody");
  
      // Construye la Tabla HTML
      //la tabla se construye concatenando un string con dos for anidados
      //hay en tottal 144 concatenaciones 12*12
      var tablehtml = "";
      for (var h = 0; h < this.height; h++) { //h para las filas
        tablehtml += "<tr id='row+" + h + "'>";//el 1ero de la concatanacion
        for (var w = 0; w < this.width; w++) { // w para las columnas
          tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
        }
        tablehtml += "</tr>";//ultimo elemento de la concatenacion
      }
      goltable.innerHTML = tablehtml;
  
      // agrega la tabla a #board
      var board = document.getElementById("board");
      board.appendChild(goltable);
   
      //console.log(board);
      // una vez que los elementos html son añadidos a la pagina le añadimos los eventos
      //Creo el elemento html board y la 'agrego' con appendChild
      this.setupBoardEvents();
  
    },
  
  
    setearStatusCelda: function(iteratorFunc, event) {
      //asigno el evento como className del tag                     
      iteratorFunc.className = event ;
      //Element.setAttribute(name, value);
      iteratorFunc.setAttribute("data-status", event);
      //Sets the value of an attribute on the specified element. If the attribute already exists, the value is updated; otherwise a new attribute is added with the specified name and value.
    },
  
    obtenerStatusCelda : function(iteratorFunc){
      //The getAttribute() method of the Element interface returns the value of a specified attribute on the element.
      // cada tag tiene el atributo "data-status"
      return iteratorFunc.getAttribute("data-status")
    },
  
    cambiarStatusCelda: function(iteratorFunc){
      if(this.obtenerstatusCelda(iteratorFunc)=="dead"){
        iteratorFunc.setAttribute("data-status","alive");
      }else{
        iteratorFunc.setAttribute("data-status","dead");
      }
      //esta funcion solo cambia el status no retorna nada
      //usando setAttribute
    },
    obtenerCoordenadasDeCelda:function(iteratorFunc){
      
      return iteratorFunc.id.split("-").map(item => parseInt(item));
      //su tag.id es "td#5-0"
      //probar con el selector de la consola del browser
      //devuelve [5,0]
      
    },
  
    forEachCell: function(iteratorFunc) {
      /*
        Escribe forEachCell aquí. Vas a necesitar visitar
        cada celda en el tablero, llama la "iteratorFunc",
        y pasa a la funcion, la celda y la coordenadas x & y
        de la celda. Por ejemplo: iteratorFunc(cell, x, y) 
      *//*
     1)cada elemento de la tabla creado es un obj con tag como atributo
     2)document.getElementsBytagName("td")
     [td#0-0, td#1-0, td#2-0, td#3-0, td#4-0, td#5-0, td#6-0,
       td#7-0, td#8-0, td#9-0, td#10-0, td#11-0,....]  es HTMLCollections , 
       uso el .slice para poder usar el forEach
     */
      Array.prototype.slice.call(document.getElementsByTagName("td")).forEach((e) => {
        let coordenadas= this.obtenerCoordenadasDeCelda(e); 
              iteratorFunc(e, coordenadas[0], coordenadas[1]);
    });
    },
  
  
    setupBoardEvents: function() {
      // cada celda del tablero tiene un id CSS en el formato "x-y"
      // donde x es la coordinada-x e y es la coordenada-y
      // usa este hecho para loopear a traves de todos los ids y asignales
      // "click" events que permite a un usuario clickear en
      // celdas para configurar el estado inicial del juego
      // antes de clickear  "Step" o "Auto-Play"
  
      // clickear en una celda deberia alternar la celda entre "alive" y "dead"
      // por ejemplo: una celda "alive" este pintado de rojo, y una celda "dead" este pintado de gris
     
    
        let onCellClick = function(e) {
            if (this.dataset.status == "dead") {
                
                this.className = "alive";
                this.dataset.status = "alive";
           
            } else {
                this.className = "dead";
                this.dataset.status = "dead";
            }
        } 
       
        let cellClicks=[]
         
         for(let i=0; i<this.width;i++) {
            for(let j=0; j<this.height;j++) {
              
             cellClicks.push(document.getElementById(j+"-"+i))
             
             }
         }
        //console.log(cellClicks);

            cellClicks.forEach ((e)=>{
           
           e.addEventListener("click",onCellClick);
          })
   
    document
      .getElementById("step_btn")
      .addEventListener("click", () => this.step()),
    document
      .getElementById("auto_btn")
      .addEventListener("click", () => this.enableAutoPlay()),
    document
      .getElementById("clear_btn")
      .addEventListener("click", () => this.clear()),
    document
      .getElementById("random_btn")
      .addEventListener("click", () => this.resetRandom());
  
    },

    obtenerCantidadVecinosVivos:function(x,y){
     //para la celda 1-1 recorro con dos loops a sus vecinos inmediatos
     // 0-0 1-0 2-0   col-row 
     // 0-1 1-1 2-1 
     // 0-2 1-2 2-2
     let cantidadDeCeldasVivas = 0;

        for(let w = x-1; w <= x+1 ; w++){
            for(let h =y-1 ; h <= y+1  ; h++){
                let str = w+"-"+h; //"0-0"
                let cell = document.getElementById(str);
                if( cell && cell.dataset.status == "alive"){
                    cantidadDeCeldasVivas++;
                }
            }
        }
       // console.log(cantidadDeCeldasVivas);
    return cantidadDeCeldasVivas;    
    },
  
    step: function () {
      //recorro el tablero y meto los condicionales de la reglas del juego
      //si le tengo que cambiar el status la pusheo a un arr vacio
      //recorro ese ultimo arreglo y les cambio tanto el status como el className;
      let cell = [];
      
      for(let row =0; row< this.height ; row++){
          for(let col =0; col<this.width ; col++){
            let currentCell = document.getElementById(row+"-"+col);
            let celdasVivas = this.obtenerCantidadVecinosVivos(row,col);
            //tengo que usar this.metodo si invoco directamente al metodo 
            //no me lo reconoce "is not a function"
           
            if(currentCell.dataset.status == "dead" && celdasVivas ==3 ){
                cell.push(currentCell);
               

            }else if(currentCell.dataset.status == "alive" &&(celdasVivas < 2 || celdasVivas > 3 )){
               cell.push(currentCell);
            }
          }
         
      }
      
     cell.forEach((cell)=>{
        if(cell.dataset.status== "dead"){
            cell.dataset.status = "alive";
            cell.className = "alive";

        }else if(cell.dataset.status == "alive"){
            cell.dataset.status = "dead";
            cell.className = "dead";
        }
    });  

    },
    clear: function(){
        for(let row =0; row< this.height ; row++){
            for(let col =0; col<this.width ; col++){
                let currentCell = document.getElementById(row+"-"+col);
                currentCell.dataset.status = "dead";
                currentCell.className = "dead";

            }
        }

    },
  
    enableAutoPlay: function() {
      // Comienza Auto-Play corriendo la función step
      // automaticamente de forma repetida cada intervalo de tiempo fijo
   
    const botonAutoPlay = document.getElementById("auto_btn");

        if(this.stepInterval){
            this.stop();
            botonAutoPlay.innerText = "AUTO";
        }else{
            this.stepInterval = setInterval(() => this.step(), 1000);
            console.log(this.stepInterval);//1

            botonAutoPlay.innerText = "PAUSE";
            //entra aca EN LA PRIMERA VUELTA
        }
      
    },
    //cuando hago el 2do click entro de vuelta al metodo enableAutoPlay
    //pero como this.stepInterval vale 1 y es distinto de 0 entro al 1er if y
    // se ejecuta la 1ra parte del if y se ejecuta el metodo stop();
    stop: function() {
        //clearinterval "anula" el metodo setInterval,
        clearInterval(this.stepInterval);
        console.log(this.stepInterval);
        this.stepInterval = 0; 
        // SETEO COMO NULL(VALOR INICIAL) CUANDO PARO EL AUTOPLAY
    },
  
    resetRandom:function(){
        //uso el Math.random()
        for(let row =0; row< this.height ; row++){
            for(let col =0; col<this.width ; col++){
                let currentCell = document.getElementById(row+"-"+col); 
                if(Math.random() >= 0.5){
                    currentCell.dataset.status = "dead";
                    currentCell.className = "dead";
                }else{
                    currentCell.dataset.status = "alive";
                    currentCell.className = "alive";
                }  
            }
        }
  
    },
  
  
  };
  
gameOfLife.createAndShowBoard();

  
  