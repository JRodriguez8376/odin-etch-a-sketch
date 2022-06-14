const buttons = document.querySelectorAll('.button');
const header = document.querySelector('.header');
const pad = document.querySelector('#pad');
const palette = document.querySelector('#palette');
const resetButton = document.querySelector('#reset');
const brushButton = document.querySelector('#brush');
const eraserButton = document.querySelector('#eraser');
const toggleGridButton = document.querySelector('#gridlines');

let maxCells = 16;
const maxPad = 640;
const colorsPad = 90;
const colorsNum = 3;
const colorsList = [
[255, 0, 0, 0.1], //red
[0, 0, 255, 0.1], //blue,
[255, 255, 0, 0,1], //yellow
[255, 165, 0, 0.1], //orange
[0, 255, 0, 0.1],    //green
[128, 0, 128, 0.1], //Purple
[255, 255, 255, 0.1], //white
"rainbow",
[0, 0, 0, 0.1]  //black
];
let rainbowPalette = "";
let currentColor = "white";
let draw = false;
let erase = false;
let setRainbow =false;
let prevSquare = null;
let grid = true;
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

//Turns the pad's grid on and off
function toggleGrid() {
    if(grid) {
        document.querySelectorAll('.column')
        .forEach(elem =>elem.classList.add('no-grid'));
        document.querySelectorAll('.column')
        .forEach(elem =>elem.classList.remove('add-grid'));
        grid = false;
        toggleGridButton.classList.add('button-on');
    } else {
        document.querySelectorAll('.column')
        .forEach(elem =>elem.classList.add('add-grid'));
        document.querySelectorAll('.column')
        .forEach(elem =>elem.classList.remove('no-grid'));
        grid = true;
        toggleGridButton.classList.remove('button-on');
    }
}

function updateBrushButton() {
    draw = draw ? false : true;
    erase = false;
    prevSquare = null;
    if(draw) {
        eraserButton.classList.remove('button-on');
        brushButton.classList.add('button-on');
    } else {
        brushButton.classList.remove('button-on');
    }
    
}

function updateEraseButton() {
    erase = erase ? false : true;
    draw = false;
    
    if(erase) {
        eraserButton.classList.add('button-on');
        brushButton.classList.remove('button-on');
    } else {
        eraserButton.classList.remove('button-on');
    }
}
//checks current grid setting
function gridSetting() {
    if(grid) {
        document.querySelectorAll('.column')
        .forEach(elem =>elem.classList.add('add-grid'));
        document.querySelectorAll('.column')
        .forEach(elem =>elem.classList.remove('no-grid'));
        grid = true;
        toggleGridButton.classList.remove('button-on');
    } else {
        document.querySelectorAll('.column')
        .forEach(elem =>elem.classList.add('no-grid'));
        document.querySelectorAll('.column')
        .forEach(elem =>elem.classList.remove('add-grid'));
        grid = false;
        toggleGridButton.classList.add('button-on');
    }
}

function setOpacity(rgb) {
    let rgbaVal = getRGBFloats(rgb);
    rgbaVal[3] =0.1;
    return("rgba(" + rgbaVal.toString() + ")");
    
}
function addOpacity(rgb) {

    //Normalize opacity to at most 1
    if(rgb[3] < 1) {
        rgb[3] +=0.1;
    } else {
        rgb[3] = 1;
    }
    return("rgba(" + rgb.toString() + ")");

}
function mixColor(newColor, oldColor) {

    let mixColor = getRGBFloats(newColor);
    oldColor = getRGBFloats(oldColor);
    for(let i = 0; i<3; i++) {
        oldColor[i] += mixColor[i]*.10;
        if(oldColor[i] > 255) {
            oldColor[i]=255;
        }
    }
    return oldColor;
}

//Turn the RGB strings into float arrays
function getRGBFloats(rgb) {
    let start = rgb.indexOf("(");
    return rgbaVal = rgb.slice(start+1,-1).split(',').map(stringVals => {
        return(parseFloat(stringVals, 10));
    });
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
                square.style.backgroundColor=`rgba(${color[0]}, ${color[1]}, ${color[2]}, 1 )`;
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
        gridSetting();
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
    resetButton.classList.add('.button-on');
    let cells = prompt("Enter number of rows and cells");
    if(Number.isInteger(cells)) {
        if(cells <=1) {
            alert("Minimum cells is 2x2")
            cells = 2;
        } else if(cells >100) {
            alert("Max cell size is 100x100");
            cells = 100;
        }
    } else {
        alert("Only numbers 1-100 allowed");
    }
    
    createPad(cells);
    resetButton.classList.remove('.button-on');
}

function randomColor() {
    return Math.floor(Math.random()*256);
}

//Event listeners

//Toggle Brush/Erase/Grid functionality on keypresses
document.addEventListener('keypress', e => {
    console.log(e);
    if(e.key === 'b') {   
        
        draw = draw ? false : true;
        erase = false;
        prevSquare = null;
        if(draw) {
            eraserButton.classList.remove('button-on');
            brushButton.classList.add('button-on');
        } else {
            brushButton.classList.remove('button-on');
        }
    }
    if(e.key === 'e' ) {

        erase = erase ? false : true;
        draw = false;
        
        if(erase) {
            eraserButton.classList.add('button-on');
            brushButton.classList.remove('button-on');
        } else {
            eraserButton.classList.remove('button-on');
        }
    }    
    if(e.key==='g') {
        toggleGrid();
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
            if(!div.style.backgroundColor || div.style.backgroundColor=='white') {
                div.style.backgroundColor = `rgba(${randomColor()}, ${randomColor()}, ${randomColor()},`+.1+`)`;
            }
            div.style.backgroundColor = addOpacity(mixColor(`rgba(${randomColor()}, ${randomColor()}, ${randomColor()},`+.1+`)`, getComputedStyle(div).backgroundColor)); 
        } else {
            if(!div.style.backgroundColor || div.style.backgroundColor=='white') {
                div.style.backgroundColor = currentColor;
            } else {
                div.style.backgroundColor = addOpacity(mixColor(currentColor, getComputedStyle(div).backgroundColor));
            }         
        }
    } else if(div.classList.contains('column') && erase) {
        //Erase is active
        div.style.backgroundColor='white';
    }
}, {passive:true});

//Looks for click event on the color picker, grabs color
palette.addEventListener('click', e => {
    console.log(e);
    const div = document.elementFromPoint(e.clientX, e.clientY);
    if(div.id=='rainbow') {
        setRainbow=true;
    } else if(div.classList.contains('colors-column')) {
            currentColor = setOpacity(getComputedStyle(div).backgroundColor);
    } 
});
resetButton.addEventListener('click', resetPad);
brushButton.addEventListener('click', updateBrushButton);
eraserButton.addEventListener('click', updateEraseButton);
toggleGridButton.addEventListener('click', toggleGrid);

createPalette(colorsNum);
setInterval(colorShiftTimer, 10);
createPad(maxCells);

    

