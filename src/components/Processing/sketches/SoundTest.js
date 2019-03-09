import p5 from 'p5';
import "p5/lib/addons/p5.sound";

const getRandomInt = (min=0,max) => {
    return Math.floor(Math.random()*(max-min+1)+min);
};

export default function(p) {
    let w, h;
    let pFields = [];
    let mic;
    let micLevel;

    p.setup = function() {
        w = p.max(window.innerWidth);
        h = p.max(window.innerHeight);
        p.createCanvas(w, h);
        p.frameRate(60);
        pFields = Array(10).fill(1).map(x => new ParticleField(10,getRandomInt(-window.innerWidth,window.innerWidth),0));

        mic = new p5.AudioIn();
        mic.start();
    };

    p.draw = function() {
        p.background(255);
        p.noCursor();

        micLevel = mic.getLevel()*-10000;

        if(micLevel < -250) {
            if(pFields.length < 50){
                pFields.push(new ParticleField(10,getRandomInt(-window.innerWidth,window.innerWidth),0));
            }
        }

        p.textFont('Avenir Next', 400);
        p.fill(200,0,0);
        p.fill(255,255,0);

        if(pFields.length > 10 && pFields.length <= 20){
            p.textSize(40);
            p.fill(20);
            p.noStroke();
            p.text("ummm....", window.innerWidth-701, 150);
            p.text("honey, what's wrong with their eyes?", window.innerWidth-701, 200);
        }
        if(pFields.length > 20){
            p.text("BIRD", 60, 300);
            p.text("ALERT", 60, 700);

            p.textSize(40);
            p.fill(255,0,0);
            p.noStroke();
            p.text("whoop whoop,", window.innerWidth-600, 200);
            p.text("SOUND THE ALARMS!!", window.innerWidth-600, 200);
        } else if(pFields.length <= 10) {
            p.textSize(40);
            p.fill(20);
            p.text("what a lovely day,", window.innerWidth-600, 200);
            p.text("not too many birds around", window.innerWidth-600, 250);
        }

        p.stroke(0);
        let lineOffset = window.innerHeight/2 + micLevel + 37;
        p.line(0,lineOffset,window.innerWidth,lineOffset);
        p.stroke(200);
        p.line(0,lineOffset+2,window.innerWidth,lineOffset+2);

        pFields.map(x => {
            x.yOffset = micLevel;
            x.update();
            return x.draw();
        });

        let cursor = new Particle(p.mouseX, p.mouseY);
        cursor.hasEyes = true;
        cursor.draw();
        p.textSize(10);
        p.fill(0);
        if(pFields.length <= 10) {
            p.text('birds love music', p.mouseX + 10, p.mouseY + 20);
        } else if(pFields.length > 10 && pFields.length <= 20) {
            p.text("maybe don't go too crazy", p.mouseX + 10, p.mouseY + 20);
        } else if(pFields.length > 20) {
            p.text("i can't believe you've done this", p.mouseX + 10, p.mouseY + 20);
        }
    };

    p.mouseMoved = function(){ p.getAudioContext().resume() };


    let ParticleField = function(numParticles, xOffset=0, yOffset=0) {
        this.yOffset = yOffset;
        this.xOffset = xOffset;
        this.particles = Array(numParticles).fill(1).map( x => new Particle(window.innerWidth/2+this.xOffset, window.innerHeight/2+this.yOffset));
        this.draw = function() {
            this.particles.map((x, i) => {
                p.fill(255-(i*(255/numParticles)),255,(i*(255/numParticles)),(i*(255/numParticles)));
                x.hasEyes = i === this.particles.length-1;
                x.hasEyes === true ? p.stroke(200) : p.noStroke();
                x.eyeOffset = getRandomInt(5,20);
                return x.draw();
            })
        };
        this.update = function() {
            this.particles.shift();
            this.particles.push(new Particle(window.innerWidth/2+this.xOffset, window.innerHeight/2+this.yOffset))
        }
    };

    let Particle = function(x, y, size=50, eyeOffset=10) {
        this.locX = x;
        this.locY = y;
        this.size = size;
        this.hasEyes = false;
        this.eyeOffset = eyeOffset;

        this.draw = function(){
            p.ellipse(this.locX, this.locY, this.size, this.size+30);
            this.drawEyes();
        };
        this.update = function(x, y) {
            this.locX = x;
            this.locY = y;
        };
        this.drawEyes = function(){
            if(this.hasEyes){
                //eyes
                //outer
                p.fill(255);
                p.ellipse(this.locX-10, this.locY, 15);
                p.ellipse(this.locX+10, this.locY, 15);
                //pupil
                p.fill(0);
                p.ellipse(this.locX-this.eyeOffset, this.locY, 5);
                p.ellipse(this.locX+this.eyeOffset, this.locY+1, 5);
                //beak
                p.fill(255,255,0);
                p.ellipse(this.locX, this.locY+5, 5, 7);
                //feet
                let xOffset = 7;
                let yOffset = 37;
                p.stroke(0);
                //left
                p.ellipse(this.locX+3+xOffset, this.locY+yOffset, 5, 7);
                p.ellipse(this.locX+xOffset, this.locY+yOffset, 5, 7);
                p.ellipse(this.locX-3+xOffset, this.locY+yOffset, 5, 7);
                //right
                p.ellipse(this.locX-3-xOffset, this.locY+yOffset, 5, 7);
                p.ellipse(this.locX-xOffset, this.locY+yOffset, 5, 7);
                p.ellipse(this.locX+3-xOffset, this.locY+yOffset, 5, 7);
            }
        }
    }
}
