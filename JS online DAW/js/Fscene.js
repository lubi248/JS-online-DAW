/*
 * General p5.js Reference: https://p5js.org/reference/
 *      Good for text, shapes, colors etc.
 * 
 * General p5.dom.js: https://p5js.org/reference/#/libraries/p5.dom
 *      Good for sliders, buttons, drop down menus etc.
 * 
 * text() reference: https://p5js.org/reference/#/p5/text
 * fill() reference: https://p5js.org/reference/#/p5/fill
 * createSlider() reference: https://p5js.org/reference/#/p5/createSlider
 * 
 */

// Create our 3 mixing desk channels

let playButton;
let sample;
  let master;
let resetButton;
let mixingDesk = []; 
let synthSelect;
let playDrumButton;
let stopDrumButton;
let firstNote;
let secondNote;
let thirdNote;
let fourthNote;
let fifthNote;
let noteInput = [];
let distortionSlider;
let masterGain;
let masterGain2;
let reverbSlid;
let synth = []; 
let newSynth; 
let seq = []; 
let newSeq;
let selectedSynth;
let newerSynth;
let gain
let gain1
let gain2
let gain3
let pan 
let pan1
let pan2
let pan3
let newSeq1
let newSeq2
let newSeq3
let newSeq4

function setup()
{
    createCanvas(1920, 1080);
    
   player = new Tone.Player({
                "url" : "drums.wav",
    })
    player.connect(Tone.Master);
    playDrumButton = createButton("Play drums");
    playDrumButton.position(50, 750);
    playDrumButton.mouseClicked(playSample);
    playDrumButton.class("rMute");
    
     player.connect(Tone.Master);
    stopDrumButton = createButton("Stop drums");
    stopDrumButton.position(150, 750);
    stopDrumButton.mouseClicked(stopSample);
    stopDrumButton.class("rMute");
    
    newChannel = createAudioChannel(mixingDesk.length, 50, 50,  0, "", "", "", "", "")
    
    mixingDesk = [newChannel];
    
    resetButton = createButton("Reset Mute");
    resetButton.position(102, 700); // Position the button
    resetButton.mouseClicked(resetMutes);
    resetButton.class("rMute");
    
    //reseterButton = createButton("Reset Solo");
    //reseterButton.position(150,700);
    //reseterButton.mouseClicked(resetSolos);
    //reseterButton.class("rSolo");
    
    
    playButton = createButton("Play");
    playButton.position(450,700);
    playButton.class("playButton");
    playButton.mouseClicked(playAudio);
    stopButton = createButton("Stop");
    stopButton.position(500,700);
    stopButton.mouseClicked(stopAudio);
    stopButton.class("stopButton");
    addButton = createButton("Add");
    addButton.position(555,700);
    addButton.mouseClicked(addChannel);
    addButton.class("addButton");
     
    
    masterVol= createSlider(0,100,0, 1);
    masterVol.class("slide");
    stereoEffect= createSlider(0,10,5);
    stereoEffect.class("slide");
    reverbSlid = createSlider(0,100,0,1);
    reverbSlid.class("slide");
    
    stereoEffector = new Tone.StereoWidener(stereoEffect.value()/10);
    stereoEffector.wet.value = 1;
    stereoEffector.connect(Tone.Master);
    
    reverbEffect = new Tone.JCReverb(reverbSlid.value());
    reverbEffect.wet.value = 1;
    reverbEffect.receive("reverbCatcher");
    
}


function draw()
{
    let calcx;
    let calcy = 50;
    background(135, 206, 235);
    
    fill(0); 
    textSize(32); 

   
    for(let i = 0; i < mixingDesk.length; i++)
    {
        calcx = i*175+50;
        let channel = mixingDesk[i];
        text("Volume: " + channel.volumeSlider.value(), calcx, calcy + 175);
        text("Pan: " + channel.panSlider.value(), calcx, calcy + 110);
        text('R.Send: ' + channel.sendSlider.value(),calcx, calcy+ 325);
        text('Synth: ' + channel.synthslider.value(),calcx, calcy+ 425);
        text('Distort: ' + channel.distortionSlider.value(),calcx, calcy+250);
       
        
    }
    let calcyy =50;
    let calcxx = 225;
    masterVol.position(calcxx,calcyy+850);
    text("Master: " + masterVol.value(), calcxx, calcyy + 900); 
    stereoEffect.position(calcxx+350,calcyy+850);
    text("stereo width: "+stereoEffect.value(), calcxx+350, calcyy+900);
    reverbSlid.position(calcxx+700,calcyy+850)
    text("Reverb: "+reverbSlid.value(), calcxx+700, calcyy+900);
    text("UnAbleton 0.0.1", calcxx+350, calcyy+1000);
}

    


function delChannel()
{
    let i;
    let j;
    let calcx;
    let calcy = 50;
    let whichChannel;
    
    console.log("Deleting");

    if (mixingDesk.length > 1)
    {
        whichChannel = Number(this.id());
        console.log("Deleting "+whichChannel);
        
    
        mixingDesk[whichChannel].name.remove();
        mixingDesk[whichChannel].volumeSlider.remove();
        mixingDesk[whichChannel].panSlider.remove();
        mixingDesk[whichChannel].muteButton.remove();
        mixingDesk[whichChannel].delButton.remove();
        //mixingDesk[whichChannel].soloButton.remove();
        mixingDesk[whichChannel].radiob.remove();
        mixingDesk[whichChannel].synthslider.remove();
        mixingDesk[whichChannel].sendSlider.remove();
        mixingDesk[whichChannel].distortionSlider.remove();
        mixingDesk[whichChannel].notesInput[0].remove();
        mixingDesk[whichChannel].notesInput[1].remove();
        mixingDesk[whichChannel].notesInput[2].remove();
        mixingDesk[whichChannel].notesInput[3].remove();
        mixingDesk[whichChannel].notesInput[4].remove();
        
        mixingDesk.splice(whichChannel,1);

        
        for (i=0; i<mixingDesk.length; i++)
        {
            mixingDesk[i].delButton.id(String(i));
            calcx = i*175+50;       
            mixingDesk[i].volumeSlider.position(calcx,calcy+125);
            mixingDesk[i].panSlider.position(calcx, calcy+50);
            mixingDesk[i].muteButton.position(calcx+50, calcy+350);
            mixingDesk[i].name.position(calcx,calcy-35);
            mixingDesk[i].delButton.position(calcx+55,calcy+600);
            //mixingDesk[i].soloButton.position(calcx+75, calcy+350);
            mixingDesk[i].radiob.position(calcx+0, calcy+0);
            mixingDesk[i].synthslider.position(calcx, calcy+375);
            mixingDesk[i].sendSlider.position(calcx, calcy+275);
            mixingDesk[i].distortionSlider.position(calcx, calcy+200);
            mixingDesk[i].notesInput[0].position(calcx+25,calcy+450);
            mixingDesk[i].notesInput[1].position(calcx+25,calcy+475);
            mixingDesk[i].notesInput[2].position(calcx+25,calcy+500);
            mixingDesk[i].notesInput[3].position(calcx+25,calcy+525);
            mixingDesk[i].notesInput[4].position(calcx+25,calcy+550);
        }
        redraw();

    }
}

   

function createAudioChannel(noChans, setVolume, setPan, samplerOrSynth, Note1, Note2, Note3, Note4, Note5)
{
    
        let calcx = noChans*175+50;
        let calcy = 50;
        let setName = "channel "+String(noChans);
        console.log("Channel "+setName);
        let channel = {
        name: createInput(''),
       notesInput:[createInput(Note1,'Text'),createInput(Note2,'Text'),createInput(Note3,'Text'),createInput(Note4,'Text'),createInput(Note5,'Text')],
        volumeSlider: createSlider(0,100,setVolume),
        panSlider: createSlider(-50,50,0,1),
        sendSlider: createSlider(-60,6,-60, 1),
        distortionSlider: createSlider(0,100,0,1),
        muteButton: createCheckbox('Mute', false),
       // soloButton: createCheckbox('Solo', false),
        radiob: createRadio(),
         x: calcx,
        y: calcy,
            radioc: createRadio(),
            x:calcx,
            y:calcy,
        synthtype: samplerOrSynth,
        notesValues: [Note1, Note2, Note3, Note4, Note5],
        delButton: createButton("Delete"), 
            synthslider:createSlider (0,3,0,1)     
    }
        
        channel.delButton.class("delButton");
        channel.volumeSlider.class("slider");
        channel.panSlider.class("slider");
        channel.sendSlider.class("slider");
        channel.synthslider.class("slider");
        channel.distortionSlider.class("slider");

    
    channel.name.value(setName);
    channel.name.position (channel.x, channel.y - 35)
    channel.radiob.option('Mono','1');
    channel.radiob.option('Stereo','2');
    
  
    
    channel.volumeSlider.position(channel.x,channel.y +125);
    channel.panSlider.position(channel.x, channel.y+50);
    channel.sendSlider.position(channel.x, channel.y+275);
    channel.distortionSlider.position(channel.x, channel.y+200);
    channel.muteButton.position(channel.x+50, channel.y+350);
    channel.muteButton.changed(muteChannel);
    //channel.soloButton.position(channel.x+75, channel.y+350);
    //channel.soloButton.changed(soloChannel);
    channel.radiob.position(channel.x, channel.y);
    channel.synthslider.position(channel.x, channel.y+375);
    channel.delButton.position(calcx+55,calcy+600);
    channel.delButton.id(String(noChans));
    channel.delButton.mouseClicked(delChannel);
    
    for (i=0; i<5; i++)
    {
        channel.notesInput[i].position(channel.x+25, channel.y+(450+(i*25)));
        channel.notesInput[i].size(100);
        channel.notesInput[i].input(changeNotes);
    }
    
    

    return channel;
}



function muteChannel()
{
    
    let button = this;

    if (this.checked())
    {
        console.log('muted!');
    } 
    else 
    {
        console.log('unmuted!');
    }
}

function soloChannel()
{
    let button = this;
    
    if (this.checked())
        {
            console.log('solo!');
        }
    else
        {
            console.log('unsolo!');
        }
}


function resetMutes()
{
    for(let i = 0; i < mixingDesk.length; i++)
    {
        let channel = mixingDesk[i];
        channel.muteButton.checked(false);
    }
}


function resetSolos()
{
    for(let i = 0; i < mixingDesk.length; i++)
    {
        let channel = mixingDesk[i];
        channel.soloButton.checked(false);
    }
}

function playAudio()
{
    
    console.log("music")
    
    masterGain = new Tone.Gain(masterVol.value()/100);
    
    masterGain2 = new Tone.Gain(1/mixingDesk.length);
    masterGain2.connect(masterGain);
    masterGain.connect(Tone.Master);
    
    
    reverbEffect.connect(masterGain2);
    
    
            newSynth = mixingDesk[0].synthslider.value();
            console.log (newSynth);
                if (newSynth == 0)
                    {
        
                        newerSynth = new Tone.Sampler({
                "C1" : "piano.wav",
    });
                    }
                if (newSynth == 1)
                    {
                        newerSynth = new Tone.Synth();
                    }
             if (newSynth == 2)
                    {
                        newerSynth = new Tone.PluckSynth();
                    }
             if (newSynth == 3)
                    {
                        newerSynth = new Tone.MembraneSynth();
                    } 
           
    
  
    
    gain = new Tone.Gain((mixingDesk[0].volumeSlider.value()/100)*(1-mixingDesk[0].muteButton.checked()));
  
    
    pan = new Tone.Panner(mixingDesk[0].panSlider.value()/50);
    newerSynth.connect(gain);
    gain.connect(pan);
    pan.connect(Tone.Master);
    
    pan.connect(stereoEffector);
    effects1 = new
    Tone.Distortion(mixingDesk[0].distortionSlider.value()/100);
    pan.connect(effects1);
    effects1.connect(masterGain2);
    sendBus1 = newerSynth.send("reverbCatcher",mixingDesk[0].sendSlider.value());
    
    
    
    newSeq1 = new Tone.Sequence(
            function (time, note) {
                newerSynth.triggerAttackRelease(note,"4n");
            },mixingDesk[0].notesValues,"4n"
            );
    
    newSeq1.start();
    
      newSynth1 = mixingDesk[1].synthslider.value();
            console.log (newSynth1);
                if (newSynth1 == 0)
                    {
        
                        newerSynth1 = new Tone.Sampler({
                "C1" : "piano.wav",
    });
                    }
                if (newSynth1 == 1)
                    {
                        newerSynth1 = new Tone.Synth();
                    }
             if (newSynth1 == 2)
                    {
                        newerSynth1 = new Tone.PluckSynth();
                    }
             if (newSynth1 == 3)
                    {
                        newerSynth1 = new Tone.MembraneSynth();
                    } 
           
    
  
    
    gain1 = new Tone.Gain((mixingDesk[1].volumeSlider.value()/100)*(1-mixingDesk[1].muteButton.checked()));
  
    
    pan1 = new Tone.Panner(mixingDesk[1].panSlider.value()/50);
    newerSynth1.connect(gain1);
    gain1.connect(pan1);
    pan1.connect(Tone.Master);
    
    pan1.connect(stereoEffector);
    effects2 = new
    Tone.Distortion(mixingDesk[1].distortionSlider.value()/100);
    pan1.connect(effects2);
    effects2.connect(masterGain2);
    sendBus2 = newerSynth1.send("reverbCatcher",mixingDesk[1].sendSlider.value());
    
    
    
    newSeq2 = new Tone.Sequence(
            function (time, note) {
                newerSynth1.triggerAttackRelease(note,"4n");
            },mixingDesk[1].notesValues,"4n"
            );
    
    newSeq2.start();
    
    newSynth2 = mixingDesk[2].synthslider.value();
            console.log (newSynth2);
                if (newSynth2 == 0)
                    {
        
                        newerSynth2 = new Tone.Sampler({
                "C1" : "piano.wav",
    });
                    }
                if (newSynth2 == 1)
                    {
                        newerSynth2 = new Tone.Synth();
                    }
             if (newSynth2 == 2)
                    {
                        newerSynth2 = new Tone.PluckSynth();
                    }
             if (newSynth2 == 3)
                    {
                        newerSynth2 = new Tone.MembraneSynth();
                    } 
           
    
  
    
    gain2 = new Tone.Gain((mixingDesk[2].volumeSlider.value()/100)*(1-mixingDesk[2].muteButton.checked()));
  
    
    pan2 = new Tone.Panner(mixingDesk[2].panSlider.value()/50);
    newerSynth2.connect(gain2);
    gain2.connect(pan2);
    pan2.connect(Tone.Master);
    
    pan2.connect(stereoEffector);
    effects3 = new
    Tone.Distortion(mixingDesk[2].distortionSlider.value()/100);
    pan2.connect(effects3);
    effects3.connect(masterGain2);
    sendBus3 = newerSynth2.send("reverbCatcher",mixingDesk[2].sendSlider.value());
    
    
    
    newSeq3 = new Tone.Sequence(
            function (time, note) {
                newerSynth2.triggerAttackRelease(note,"4n");
            },mixingDesk[2].notesValues,"4n"
            );
    
    newSeq3.start();
    
    newSynth3 = mixingDesk[3].synthslider.value();
            console.log (newSynth3);
                if (newSynth3 == 0)
                    {
        
                        newerSynth3 = new Tone.Sampler({
                "C1" : "piano.wav",
    });
                    }
                if (newSynth3 == 1)
                    {
                        newerSynth3 = new Tone.Synth();
                    }
             if (newSynth3 == 2)
                    {
                        newerSynth3 = new Tone.PluckSynth();
                    }
             if (newSynth3 == 3)
                    {
                        newerSynth3 = new Tone.MembraneSynth();
                    } 
           
    
  
    
    gain3 = new Tone.Gain((mixingDesk[3].volumeSlider.value()/100)*(1-mixingDesk[3].muteButton.checked()));
  
    
    pan3 = new Tone.Panner(mixingDesk[3].panSlider.value()/50);
    newerSynth3.connect(gain3);
    gain3.connect(pan3);
    pan3.connect(Tone.Master);
    
    pan3.connect(stereoEffector);
    effects4 = new
    Tone.Distortion(mixingDesk[3].distortionSlider.value()/100);
    pan.connect(effects4);
    effects4.connect(masterGain2);
    sendBus2 = newerSynth3.send("reverbCatcher",mixingDesk[3].sendSlider.value());
    
    
    
    newSeq4 = new Tone.Sequence(
            function (time, note) {
                newerSynth3.triggerAttackRelease(note,"4n");
            },mixingDesk[3].notesValues,"4n"
            );
    
    newSeq4.start();
    

    Tone.Transport.start();
    
   
}
 

    
function stopAudio()
{
    console.log("no music")
    
   newSeq1.stop;
    newSeq2.stop;
    newSeq3.stop;
    newSeq4.stop;
    Tone.Transport.stop();
            
        
}

function addChannel()
{
   
    newChannel = createAudioChannel(mixingDesk.length, 50, 50,  0, "" , "", "" ,"" , "");
    mixingDesk.push(newChannel);
}

function playSample()
{
    player.start();
}

function stopSample()
{
    player.stop();
}

function changeNotes()
{
    {
    let i;
    let j;
    for (i=0; i<mixingDesk.length; i++)
        {
            for (j=0; j<5; j++)
                {
                   if (mixingDesk[i].notesInput[j].value() == '')
                    {
                           mixingDesk[i].notesValues[j]=null;
                        console.log("blank");
                    } else
                    {
                        mixingDesk[i].notesValues[j]=mixingDesk[i].notesInput[j].value();
                        
                        console.log("Copied "+mixingDesk[i].notesValues[j]);
                    }
                }
        }
}
    
}