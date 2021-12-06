class SmilMediaPlayerClass{

    constructor(){
        this.opened = false;
        console.log("Created");
    }
    

    play(){
        if(this.isOpen()){
            if(this.elapsedTime == 0){
                this.contentDiv.innerHTML = "";
                for(let element of this.contentElements){
                    this.contentDiv.innerHTML += `
                    <p class="smil-text" id="${element.id}" style="display:none;">${element.textContent}</p>
                    `;
                }
                for(let element of this.contentElements){
                    if(element.beginTime === Math.floor(this.elapsedTime)){
                        document.getElementById(element.id).style.display = "block";

                    }
                    if(element.beginTime + element.duration === Math.floor(this.elapsedTime)){
                        document.getElementById(element.id).style.display = "none";
                    }
                }
            }

            this.playFunctionRunning = true;
            this.playButton.innerHTML = `<i class="fas fa-pause"></i>`;
            console.log(`Video Duration is: ${this.videoDuration}`);
            this.videoPlaying = true;
            console.log("Video is playing");

            let startTime = new Date();
            let originalTime = this.elapsedTime;
            let lastTime = this.elapsedTime;
            (function callback(player){
                let now = new Date();
                let timeFromPlay = (now - startTime)/1000;
                player.elapsedTime = originalTime + timeFromPlay;
                if(Math.floor(player.elapsedTime) !== lastTime){
                    lastTime = Math.floor(player.elapsedTime);

                    for(let element of player.contentElements){
                        if(element.beginTime === Math.floor(player.elapsedTime)){
                            document.getElementById(element.id).style.display = "block";

                        }
                        if(element.beginTime + element.duration === Math.floor(player.elapsedTime)){
                            document.getElementById(element.id).style.display = "none";
                        }
                    }
                }


                if(player.elapsedTime >= player.videoDuration){
                    player.videoPlaying = false;
                    player.videoDone = true;
                    player.elapsedTime = player.videoDuration;
                    player.playButton.innerHTML = `<i class="fas fa-redo"></i>`
                }

                if(player.progressBar !== null){
                    let progress = (player.elapsedTime/player.videoDuration)*100;
                    player.progressBar.style.width = `${progress}%`;
                }
                if(player.elapsedTimeP !== null){
                    player.elapsedTimeP.innerHTML = `${player.elapsedTime.toFixed(2)}/${player.videoDuration.toFixed(2)}`;
                }

                if(!player.videoPlaying || player.elapsedTime >= player.videoDuration){
                    console.log("Done");
                    player.playFunctionRunning = false;
                } else {
                    setTimeout(function(){callback(player);}, 1);
                }
            }(this));

        }
    }

    pause(){
        if(this.isOpen()){
            this.playButton.innerHTML = `<i class="fas fa-play"></i>`;
            this.videoPlaying = false;
            console.log("Video has been paused");
        }
    }

    stop(){
        if(this.isOpen()){
            this.videoPlaying = false;
            (function waitPlayFunction(player){
                if(player.playFunctionRunning){
                    setTimeout(()=>{waitPlayFunction(player);}, 1);
                } else {
                    player.elapsedTime = 0.00;
                    player.playButton.innerHTML = `<i class="fas fa-play"></i>`;
                    if(player.progressBar !== null){
                        player.progressBar.style.width = `0%`;
                    }
                    if(player.elapsedTimeP !== null){
                        player.elapsedTimeP.innerHTML = `${player.elapsedTime.toFixed(2)}/${player.videoDuration.toFixed(2)}`;
                    }
                    player.contentDiv.innerHTML = "";
                    console.log("Video has been stopped");
                }
            })(this);
        }
    }

    replay(){
        if(this.isOpen()){
            this.playButton.innerHTML = `<i class="fas fa-pause"></i>`;
            this.videoPlaying = true;
            this.videoDone = false;
            this.elapsedTime = 0.00;
            if(this.progressBar !== null){
                this.progressBar.style.width = `0%`;
            }
            if(this.elapsedTimeP !== null){
                this.elapsedTimeP.innerHTML = `${this.elapsedTime.toFixed(2)}/${this.videoDuration.toFixed(2)}`;
            }

            this.play();
            console.log("Video is being replayed");
        }
    }

    videoIsDone(){
        if(this.isOpen()){
            return this.videoDone;
        } else {
            return false;
        }
    }

    videoIsPlaying(){
        if(this.isOpen()){
            return this.videoPlaying;
        } else {
            return false;
        }
    }



    open(message, videoTitle=""){
        console.log("10");
        let error = false;
        try{
            this.parser = new SmilParser(message);
            this.contentElements = this.parser.getParElements();
        } catch(e){
            error = true;
            window.alert(`Error Parsing File ${e}`);
        }

        if(error){
            return false;
        }

        this.videoPlaying = false;
        this.elapsedTime = 0.00;
        this.videoDuration = 0;
        this.videoDone = false;
        this.playFunctionRunning = false;

        if(this.isOpen() === false){
            console.log("20");
            let body = document.querySelector("body");
            let playerHTML = 
            `
            <div class="smil-media-player-background-shade" style="display: fixed" id="smil_media_player_background_shade"></div>
            <div class="smil-media-player-container" id="smil_media_player_container">
                <div class="row" style="width: 100%; background-color: lightgray;">
                    <div class="col-sm-11">
                        ${videoTitle}
                    </div>
                    <div class="col-sm-1 no-padding">
                        <button class="smil-media-player-button" onclick="SMIL_MEDIA_PLAYER.close()"><i class="fas fa-times fa-2x"></i></button>
                    </div>
                </div>
                <div class="row smil-media-player">
                    <div class="col smil-media-player-content" id="smil_player_content">

                    </div>
                </div>
                <div class="row" style="width: 100%">
                    <div class="col no-padding">
                        <div class="progress smil-progress">
                            <div
                            id="progress_bar"
                            class="progress-bar smil-progress-bar"
                            role="progressbar"
                            ></div>
                        </div>
                    </div>
                </div>
                <div class="row" style="width: 100%; background-color: lightgray;">
                    <div class="col-sm-1 no-padding">
                        <button class="smil-media-player-button" id="play_button" onclick="SMIL_MEDIA_PLAYER.toggleVideo()"><i class="fas fa-play"></i></button>
                    </div>
                    <div class="col-sm-1 no-padding">
                        <button class="smil-media-player-button" onclick="SMIL_MEDIA_PLAYER.stop()"><i class="fas fa-stop"></i></button>
                    </div>
                    <div class="col-sm-10 col-smil-elapsed-time" id="elapsed_time">
                    0.00/0.00
                    </div>
                </div>
            </div>
            `;

            body.insertAdjacentHTML("afterbegin", playerHTML);

            this.contentDiv = document.getElementById('smil_player_content');
            this.playButton = document.getElementById('play_button');
            this.progressBar = document.getElementById('progress_bar');
            this.elapsedTimeP = document.getElementById('elapsed_time');

            //Get Video duration
            for(let element of this.contentElements){
                let duration = element.beginTime + element.duration;
                if(duration > this.videoDuration){
                    this.videoDuration = duration;
                }
            }

            this.elapsedTimeP.innerHTML = `${this.elapsedTime.toFixed(2)}/${this.videoDuration.toFixed(2)}`;
            this.opened = true;
            
            return true;
        } else {
            return false;
        }
    }


    isOpen(){
        return this.opened;
    }


    close(){
        if(this.isOpen()){
            this.videoPlaying = false;
            (function waitPlayFunction(player){
                if(player.playFunctionRunning){
                    setTimeout(()=>{waitPlayFunction(player);}, 1);
                } else {
                    document.getElementById("smil_media_player_background_shade").remove();
                    document.getElementById("smil_media_player_container").remove();
                    player.opened = false;
                    console.log("Video has been stopped");
                    if(player.closeFunction !== undefined){
                        player.closeFunction();
                    }
                }
            })(this);
        }
    }


    onClose(closeFunction){
        this.closeFunction = closeFunction;
    }


    toggleVideo(){
        if(!SMIL_MEDIA_PLAYER.videoIsPlaying() && !SMIL_MEDIA_PLAYER.videoIsDone()){
            SMIL_MEDIA_PLAYER.play();
        } else if(!SMIL_MEDIA_PLAYER.videoIsPlaying() && SMIL_MEDIA_PLAYER.videoIsDone()){
            SMIL_MEDIA_PLAYER.replay();
        } else {
            SMIL_MEDIA_PLAYER.pause();
        }
    
    }


}

window.SMIL_MEDIA_PLAYER = new SmilMediaPlayerClass();

window.SmilPlayer = function(){
    return SMIL_MEDIA_PLAYER;
}