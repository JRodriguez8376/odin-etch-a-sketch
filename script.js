const header = document.querySelector('.header');
const pad = document.querySelector('#pad');
const palette = document.querySelector('#palette');
const resetButton = document.querySelector('#reset');
let maxCells = 16;
const maxPad = 800;
const colorsPad = 90;
const colorsNum = 3;
let colorsList = ["red", "blue", "yellow", "orange", "green", "violet", "white", "rainbow", "black" ];
let rainbowPalette = "";
let currentColor = "red";
let draw = false;
let erase = false;
let setRainbow =false;
let prevSquare = null;
/**
 * Shifting RGB code.
 * Originated from gn-venpy on Github, slightly modified to pick a specific reference
 * Source: www.github.com/gn-venpy/rainbow-html-background/blob/main/index.html
 */
let r =255;
let    g = 0;
let    b = 0;
function rgb(r, g, b) {
    return "rgb("+r+","+g+","+b+")";
}
function colorShiftTimer() {
    if(r < 255 && g == 0 && b == 0) {
        r++;
    } else if (r == 255 && g < 255 && b == 0) {
        g++;
    } else if (r > 0 && g == 255 && b == 0) {
        r--;
    } else if (r == 0 && g == 255 && b < 255) {
        b++;
    } else if (r == 0 && g > 0 && b == 255) {
        g--;
    } else if (r < 255 && g == 0 && b == 255) {
        r++;
    } else if (r == 255 && g == 0 && b > 0) {
        b--;
    }
    rainbowPalette.style.backgroundColor = rgb(r,g,b);
}

//Create the color choice palette
function createPalette(cells) {
    let sides = colorsPad/cells;
    for(let i=0; i<cells; i++) {
        let row = document.createElement('div');
        row.classList.add('colors-row');
        row.style.minHeight= `${sides}px`;
        row.style.minWidth= `${sides}px`;
        palette.appendChild(row);
        for(let j=0;j<cells;j++) {
            let square = document.createElement('div');
            square.classList.add('colors-column');
            let color = colorsList.shift();
            if(color == "rainbow") {
                square.id = "rainbow";
                rainbowPalette = square;
            } else {
                square.style.backgroundColor=color;
            }
            row.appendChild(square);
        }
    }
}
//Draws empty grid that can take color assignment
function createPad(cells) {
    let sides = maxPad/cells;
    for(let i=0; i<cells; i++) {
        let row = document.createElement('div');
        row.classList.add('row');
        row.style.minHeight= `${sides}px`;
        row.style.minWidth= `${sides}px`;
        pad.appendChild(row);
        for(let j=0;j<cells;j++) {
            let square = document.createElement('div');
            square.classList.add('column');
           
            row.appendChild(square);
        }
    }
}
function removePad() {
    //Find all elements that contain the pad's row OR column class
    // Then remove them one by one
    document.querySelectorAll('.row,.column')
        .forEach(elem =>elem.remove());
}
//Delete old pad, create new pad using current max rows and columns
function resetPad() {
    removePad();
    let cells = prompt("Enter number of rows and cells");
    if(cells <=1) {
        alert("Minimum cells is 2x2")
        cells = 2;
    } else if(cells >100) {
        alert("Max cell size is 100x100");
        cells = 100;
    }
    createPad(cells);
    
}
function randomColor() {
    return Math.floor(Math.random()*256);
}
//Event listeners

//Toggle Brush functionality
document.addEventListener('keypress', (e) => {
    console.log(e);
    if(e.key === 'b') {   
        draw = draw ? false : true;
        erase = false;
        prevSquare = null;
    }
    if(e.key === 'e' ) {
        erase = erase ? false : true;
        draw = false;
    }    
});

//Paint where mouse is looking, if valid

pad.addEventListener('mousemove', e => {
    //Grab current mouse location
    const div = document.elementFromPoint(e.clientX, e.clientY);

    //Check if null, or the brush location hasn't changed
    if(prevSquare == null) {
        prevSquare = div;
    } else if(prevSquare == div) {
        return;
    }
    prevSquare = div;
    if(div.classList.contains('column') && draw) {
        //Brush is active
        if(setRainbow) {
            div.style.backgroundColor=`rgb(${randomColor()}, ${randomColor()}, ${randomColor()}) `;
            
        } else {
            div.setAttribute('style', `background: ${currentColor}`)
        }
    } else if(div.classList.contains('column') && erase) {
        //Erase is active
        div.setAttribute('style', 'background: white')
    }
}, {passive:true});

//Looks for click event on the color picker, grabs color
palette.addEventListener('click', e => {
    console.log(e);
    const div = document.elementFromPoint(e.clientX, e.clientY);
    if(div.id=='rainbow') {
        setRainbow=true;
    } else if(div.classList.contains('colors-column')) {
            currentColor = getComputedStyle(div).backgroundColor;
    } 
});

//Button event listener to reset pad
resetButton.addEventListener('click', resetPad);



createPalette(colorsNum);
setInterval(colorShiftTimer, 10);
createPad(maxCells);


