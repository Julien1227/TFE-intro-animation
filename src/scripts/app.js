"use sctrict";

const startBtn = document.getElementById('begin');

//Web audio api
window.AudioContext = window.AudioContext || window.webkitAudioContext;
startBtn.addEventListener('click', (event) => {

    gsap.to(startBtn, {
        opacity: 0
    })

    var context = new AudioContext();
    var myBuffer;
    
    var request = new XMLHttpRequest();
    
    var o = context.createOscillator();
    o.start(0);
    
    var g = context.createGain();
    g.gain.value = 0;
    
    o.frequency.value = 0;
    
    o.connect(g);
    o.type = "triangle";
    g.connect(context.destination);
    
    
    
    const letters = document.querySelectorAll('#h1-letter');
    const letterColors = [];
    var time = 150; //ms
    
    const frqs = [],
    gains = [];
    
    const tl = gsap.timeline({});
    
    
    
    /* Pour chaque lettre, assigne une couleur random */
    const rgbColor = [];
    const hslColor = [];
    var count = 0;
    letters.forEach(element => {
        //Crée la couleur en HSL pour jouer la note plus tard
        let h = randomMinMax(0, 360),
        s = randomMinMax(70, 100),
        l = randomMinMax(40, 60);
        
        // Récupère les couleurs tsl
        hslColor.push([h, s, l]);
        
        // Récupère les couleurs rvg depuis la convertion des tsl
        rgbColor.push(HSLToRGB(h, s, l));
        
        element.setAttribute('style', 'color:rgb('+rgbColor[count][0]+', '+rgbColor[count][1]+', '+rgbColor[count][2]+')');
        setSoundOptions(rgbColor[count][0], +rgbColor[count][1], +rgbColor[count][2], s, l)
        count++;
        
    });
    console.log(frqs, gains);
    
    // ANIMATION GSAP
    tl.from(letters, {
        delay: 1,
        duration: 0.001,
        stagger: time/1000,
        color: "white",
        onComplete: showText
    })
    .to(letters, {
        color: "white"
    })
    
    function showText(){
        tl.to(letters, {
            duration: 0.05,
            stagger: 0.05,
            color: "black",
            onComplete: showText
        })
    }
    
    function setSoundOptions(red, green, blue, lum, sat) {
        let frq = Math.round((red + green*1.7 + blue*0.3) * 100) / 100;
        //Si la couleur est lumineuse, alors le son s'estompe également
        if(lum >= 50) {
            lum = 100 - lum;
        }
        
        gain = (sat/100)*(lum/100);
        gain = (Math.round(gain * 100) / 100)*2;
        
        //Si couleur invisible -> son 0
        if(lum == 0 || lum == 100 || sat == 0) {
            gain = 0;
        }
        
        gains.push(gain);
        frqs.push(frq);
    }
    
    //Joue chaque paramètre les uns après les autres
    setTimeout(function() {
        for(var i = 0; i < frqs.length; i++) {
            play(i);
        }
    }, 1000 - time);
    
    
    function play(i) {
        setTimeout(function() {
            o.frequency.value = frqs[i];
            g.gain.value = gains[i];
            
            g.gain.linearRampToValueAtTime(0.001, context.currentTime + (time-0.1));
        }, i*time);
    }
    
    setTimeout(function() {
        g.gain.value = 0;
    }, (1000 - time)+(frqs.length*time));
    
    setTimeout(function() {
        tl.to(letters, {
            delay: 1,
            opacity: 0,
            stagger: 0.05,
            scale: 0
        })
    }, (1000 - time)+(frqs.length*time));
});
    
    
    
    
    
function deleteElement(e) {
    e.remove();
}

//source: https://gist.github.com/brunomonteiro3/27af6d18c2b0926cdd124220f83c474d
function randomMinMax(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

//source: https://css-tricks.com/converting-color-spaces-in-javascript/
function HSLToRGB(h,s,l) {
    // Must be fractions of 1
    s /= 100;
    l /= 100;
  
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;  
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r, g, b];
}