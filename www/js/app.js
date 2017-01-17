//新規登録画面のフォームチェック
var userID;
var userPW;
var userNickName;

function newregistCheck(){
    var flag = 0;
    var pass_flag = 0;
    var check_userPW = document.form1.check_userPW.value;
    userID = document.form1.userID.value;
    userPW = document.form1.userPW.value;
    userNickName = document.form1.userNickName.value;    
    
    //ユーザIDが半角英数字4~16字以内かチェック
    if(userID.match(/[^A-Za-z0-9]+/)){
        flag = 1;
	}
    else if(16 < userID.length || userID.length < 4) {
        flag = 1;
    }
 
    //パスワードが半角英数字4~16字以内かチェック
    if(userPW.match(/[^A-Za-z0-9]+/)){
		flag = 1;
	}
    else if(16 < userPW.length || userPW.length < 4) {
        flag = 1;
    }
    
    //パスワード確認時に一致しているかチェック
    if(userPW != check_userPW){
        flag = 1;
        //var elem = document.getElementById("test");
        //elem.innerHTML = "<span style='color: red; font-size: 12px'>パスワードが一致しません</span>";
    }
    
    //ユーザ名が10文字以内か空欄でないかチェック
    if(10 < userNickName.length || userNickName.length < 1) {
        flag = 1;
    }
    
    //flagが立ったらエラーが出る
	if(flag){
        ons.notification.alert({
            message: '入力が正しくありません。'
        });
        return false; // 送信を中止
	}
	else{
        /*
        var message = $("#userNickName").val(); //ユーザ名を取得
        socket.emit("emit_nickname", {user_name_value : message});//ユーザ名をサーバへ送信
        socket.emit("login_announce_on_myself", {user_name_value : message});
        console.log(message);
        */
        NewNavigator.pushPage('new2.html');
		return true; // 送信を実行
	}
}

//新規登録
function enrollAccount(file){
    var fileReader = new FileReader();
    var send_file = file;
    //var type = send_file.type;//♪L( ՞ਊ ՞)┘└( ՞ਊ ՞)」♪
    var data = {};
    
    var fileName = new Date().YYYYMMDDHHMMSS() + ".wav";
    fileReader.readAsBinaryString(send_file);
    
    fileReader.onload = function(event) {
    //data.type = type;//♪L( ՞ਊ ՞)┘└( ՞ਊ ՞)」♪
    console.log("emit_before");
    console.log(userNickName);
    
        socket.emit('enroll_account', {
        audio_file_value : event.target.result,
        file_name_value  : fileName,
        user_id_value    : userID, 
        user_pw_value    : userPW,
        user_name_value  : userNickName 
        });
        console.log("emit_after");
    };
}



//ログイン時のフォームチェック
function loginCheck(){
    var flag = 0;
    userID = document.form1.userID.value;
    var userPW = document.form1.userPW.value;
   
    //ユーザIDが半角英数字4~16字以内かチェック
    if(userID.match(/[^A-Za-z0-9]+/)){
    	flag = 1;
	}
    else if(16 < userID.length || userID.length < 4) {
        flag = 1;
    }

    //パスワードが半角英数字4~16字以内かチェック
    if(userPW.match(/[^A-Za-z0-9]+/)){
		flag = 1;
	}
    else if(16 < userPW.length || userPW.length < 4) {
        flag = 1;
    }
    
    //flagが立ったらエラーが出る
	if(flag){
        ons.notification.alert({
            message: '入力が正しくありません。'
        });
        return false; // 送信を中止
	}
	else{
        socket.emit("login_account", {
            user_id_value : userID,
            user_pw_value : userPW
        }); //onはreco-server.jsに記述
	}
}

//ログアウト確認
function logoutCheck(){    
    ons.notification.confirm({
      title : userNickName,    
      message: 'ログアウトしますか？',
      callback: function(idx) {
        switch (idx) {
          case 0:
              
            break;
          case 1:
            myNavigator.resetToPage('start.html');
            break;
        }
      }
    });
}



//部屋作成時のフォームチェック
function roommakeCheck(){
    var flag = 0;
    var recordname = document.form2.recordname.value;
    var password = document.form2.password.value;
   
   //記録名に記号がないか空欄ではないかチェック
	if(recordname.match(/[^a-zA-Zａ-ｚＡ-Ｚ0-9ぁ-んァ-ン一-龥]+/)){
		flag = 1;
	}
    else if(recordname.length < 1) {
        flag = 1;
    }

    //パスワードが半角英数字4~16字以内かチェック
    if(password.match(/[^A-Za-z0-9]+/)){
		flag = 1;
	}
    else if(16 < password.length || password.length < 4) {
        flag = 1;
    }
    
    //flagが立ったらエラーが出る
	if(flag){
        ons.notification.alert({
            message: '入力が正しくありません。'
        });
			return false; // 送信を中止
	}
	else{
        
        var roomname = $("#recordname").val(); //記録名(部屋名)
        var pass = $("#password").val(); //部屋のパスワード
        
        console.log(userID+","+roomname+","+pass);
    //ユーザID、部屋名、部屋のパスワードをサーバへ送信
        socket.emit('make_room', {
            userID_value : userID,
            room_name_value : roomname,
            room_pw_value : pass
        });
        
        socket.on("make_room_response", function(data){
            /*
            if(data.result_value=="TRUE"){
                myNavigator.pushPage('recording.html');
                var elem = document.getElementById("name_inroom");
                elem.innerHTML = roomname;
            }
            else{
                ons.notification.alert({
                    message: '部屋の作成に失敗しました'
                });
            }
            */
            
            myNavigator.pushPage('recording.html');
            var elem = document.getElementById("name_inroom");
            elem.innerHTML = roomname;
        });
        
        
        //recording.htmlに移動後に実行される関数
        myNavigator.on('postpush',function(event){
            //部屋名を追加
            //$("#name_inroom").append("<div>["+ roomname +"]</div>");
            document.getElementById("name_inroom").innerHTML="[" + roomname + "]";
            //参加者(ユーザ名)を追加
            $("#nickname_inroom").append("<span>"+ userNickName +" </span>");
        });	}
}


//部屋参加時のフォームチェック
function roomjoinCheck(){
    var flag = 0;
    var recordname_join = document.form3.recordname_join.value;
    var hostid = document.form3.hostid.value;

   //記録名に記号がないか空欄ではないかチェック
    if(recordname_join.match(/[^a-zA-Zａ-ｚＡ-Ｚ0-9ぁ-んァ-ン一-龥]+/)){
		flag = 1;
	}
    else if(recordname_join.length < 1) {
        flag = 1;
    }

    //ホストIDが半角英数字4~16字以内かチェック
    if(hostid.match(/[^A-Za-z0-9]+/)){
		flag = 1;
	}
    else if(16 < hostid.length || hostid.length < 4) {
        flag = 1;
    }
    
    //flagが立ったらエラーが出る
	if(flag){
		 ons.notification.alert({
            message: '入力が正しくありません。'
        });		
        return false; // 送信を中止
	}
	else{
        
		return true; // 送信を実行
	}
}

    
document.addEventListener ("deviceready", onDeviceReady, false);

//This function is executed when Cordova loading completed.
function onDeviceReady () {
    window.alert ('Loading Cordova is completed、Camera is now ready to be used.');
}

function snapPicture () {
    navigator.camera.getPicture (onSuccess, onFail, 
        { quality: 50, destinationType: Camera.DestinationType.DATA_URL});


    //A callback function when snapping picture is success.
    function onSuccess (imageData) {
        var image = document.getElementById ('picture');
        image.src = "data:image/jpeg;base64," + imageData;
        console.log(imageData);
    }

    //A callback function when snapping picture is fail.
    function onFail (message) {
        alert ('Error occured: ' + message);
    }
}
    
    
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady () {
    window.alert ('Loading Cordova is completed');
}

function getPhoto () {
//Specify the source to get the photos.
navigator.camera.getPicture(onSuccess, onFail, 
    { quality: 50,destinationType: Camera.DestinationType.FILE_URI,
    sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM });
    
    function onSuccess (imageURI) {
    var largeImage = document.getElementById ('picture');
    largeImage.style.display = 'block';
    largeImage.src = imageURI;
    }
    
    function onFail (message) {
      alert('An error occured: ' + message);
    }
}




/*ここからコピペ
var recognition;
var nowRecognition = false;
var $finalSpan = document.querySelector('#final_span');
var $interimSpan = document.querySelector('#interim_span');

function start () {
    recognition = new webkitSpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = function (e) {
        var finalText = '';
        var interimText = '';
        for (var i = 0; i < e.results.length; i++) {
            if (e.results[i].isFinal) {
                finalText += e.results[i][0].transcript;
            } else {
                interimText += e.results[i][0].transcript;
            }
        }
//        appendMsg('i'+interimText+'\n');
//        appendMsg('f'+finalText+'\n');
        if(interimText==''){
            appendMsg('Final:'+finalText);//一定以上の時間が経過すると連続で音声認識できなくなる
            stop();
            start();
        }
    };
    console.log('onresult end');
    recognition.start();
    nowRecognition = true;
    console.log('test');
    
};

function stop () {
    recognition.stop();
    nowRecognition = false;
}

function clickStart() {
    // unsupported.
    if (!'webkitSpeechRecognition' in window) {
        alert('Web Speech API には未対応です.');
        return;
    }

    if (nowRecognition) {
        console.log('stop');
        stop();
        this.value = '音声認識を継続的に行う';
        this.className = '';
    } else {
        console.log('start');
        start();
        this.value = '音声認識を止める';
        this.className = 'select';
    }
}

var x = 100;

function larger ()
{
    if(document.getElementById){
        x *= 1.2; document.getElementById('content').style.fontSize = x + '%';
        x *= 1.2; document.getElementById('col').style.fontSize = x + '%';
    }
}    

function smaller ()
{
    if(document.getElementById){
        x /= 1.2; document.getElementById('content').style.fontSize = x + '%';
        x /= 1.2; document.getElementById('col').style.fontSize = x + '%';
    }
}   


function chgColorR()
{ 
  if(document.getElementById)
  {
    document.getElementById("content").style.color = "red"; 
    document.getElementById("col").style.color = "red";
  }
}

function chgColorB()
{ 
  if(document.getElementById)
  {
    document.getElementById("content").style.color = "blue"; 
    document.getElementById("col").style.color = "blue";
  }
}


//テキスト表示
function getTextContents(text) {
    document.getElementById("content").innerHTML = text;
    //content.innerHTML = '<p>認識された言葉</p>' +
                   //'<input type="text" value="' + text + '" >';
}

*/




/*              音声認識機能                */

// スクロール機能
function scrollPage() {
    // 現在の縦スクロール位置
    var scrollPosition = document.getElementById("chatLogs").scrollTop;
    // スクロール要素の高さ
    var scrollHeight = document.getElementById("chatLogs").scrollHeight;
    //現在のスクロール位置をページトップに変更
    document.getElementById("chatLogs").scrollTop = scrollHeight;
}

function appendMsg(msg,color,size) {
    $("#chatLogs").append("<span id=\"messageView\" style=\"color:"+color+"; font-size:"+size+"px; \">"+msg+"</span>");
    //if(){
    //    scrollPage();
    //}
}



//黒文字の出力
/*
function appendMsg(text) {
    console.log("export"+vol);
    //文字の大きさを変更
    if(vol>0.015){
        $("#top_histList").append("<div id='largetext'>"+text+"</div>");
    }
    else if(vol>0.007){
        $("#top_histList").append("<div id='middletext'>"+text+"</div>");
    }
    else{
        $("#top_histList").append("<div id='smalltext'>"+text+"</div>");
    }
    scrollPage();
}

//赤文字の出力
function appendMsgred(text) {
    console.log("export"+vol);
    //文字の大きさを変更
    if(vol>0.015){
        $("#top_histList").append("<div id='largetext' class='redtext'>"+text+"</div>");
    }
    else if(vol>0.007){
        $("#top_histList").append("<div id='middletext' class='redtext'>"+text+"</div>");
    }
    else{
        $("#top_histList").append("<div id='smalltext' class='redtext'>"+text+"</div>");
    }
    scrollPage();
}

*/



//speechrecognizer 書き起こし
function recognizeSpeech() {
    var maxMatches = 1;
    var promptString = "Speak now"; // optional
    var language = "ja-JP";                     // optional

    window.plugins.speechrecognizer.startRecognize(function(result){
    alert(result);
    
    
    }, function(errorMessage){
            console.log("Error message: " + errorMessage);
    }, maxMatches, promptString, language);
}

/*さらにコピペ(http://jellyware.jp/kurage/iot/webspeechapi.html)*/
var nowRecognition = false;
var recognition;

//var mediaRecorder;

function ctrlRecognition(text){
    //押したらボタンの文字と色変えるやつ
    //appendMsg("上岡","こんにちは","red","13px");
    if(nowRecognition == false){
        function startRecognition(){
            nowRecognition = true;
            document.getElementById("recbtn").className="zmdi zmdi-pause-circle zmdi-hc-5x";
            document.getElementById("recbtn").style.color='LightCoral';
            //text.style.background='#F7D468';
            //scrollPage();
            //startCapture();　//録音開始
            //alert("部屋名"+roomname);
            //$("#name_inroom").append("<div>"+roomname+"</div>");
            startCapture();
            StartTimer();
            capture_flag = 1;
            console.log("start");
        }
    }
    else{
        function stopRecognition(){
        nowRecognition = false;
        document.getElementById("recbtn").className="zmdi zmdi-play-circle zmdi-hc-5x";
        document.getElementById("recbtn").style.color='LimeGreen';
        //text.style.background='skyblue';
        modal.show();
        stopCapture_write();//録音終了
        StopTimer();
        capture_flag = 0;
        socket.emit("record_finish");
        }
    }
    
    console.log("button"+nowRecognition);
    
    /*
    function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
        navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
    }
    var mediaConstraints = {
        audio: true
    };
    */
    // if (nowRecognition) {
        
        //stopRecognition();  //音声認識終了
        //stop(); //音量取得終了
        
        //録音終了
        //mediaRecorder.stop();
        //mediaRecorder.stream.stop();
        //録音保存
        //mediaRecorder.save();
        //console.log(mediaRecorder.save());
        
        //stopCapture();//録音終了
        
    // } else {
        // 
        //startRecognition(); //音声認識開始
        //start();    //音量取得開始
        //startCapture();　//録音開始
        //captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);//録音開始
        /*
        if(micVolume != null) {

          function audioSuccessCallback() {
              micVolume.read(function(reading){
                  console.log(reading.volume);
                  micVolume.stop();
              }, function(error){
                  console.log("Microhpne error");
                  console.log(error);
              });
          };

          function audioErrorCallback() {
              console.log("Microhpne error");
          };

          setInterval(function(){
            micVolume.start(audioSuccessCallback, audioErrorCallback);
          }, 100);

      } else {
          console.log("Audio plugin is not defined");
      }

    */
        
        //recognizeSpeech();
    // }
    
    /*
    
    function onMediaSuccess(stream) {
        var audio = document.createElement('audio');
        audio = mergeProps(audio, {
            controls: true,
            muted: true,
            src: URL.createObjectURL(stream)
        });
        
        
        audio.play();
        audiosContainer.appendChild(audio);
        audiosContainer.appendChild(document.createElement('hr'));
        mediaRecorder = new MediaStreamRecorder(stream);
        mediaRecorder.stream = stream;
        
        var recorderType = 'WebAudio API (WAV)';
        if (recorderType === 'WebAudio API (WAV)') {
            mediaRecorder.recorderType = StereoAudioRecorder;
            mediaRecorder.mimeType = 'audio/wav';
        }

        // don't force any mimeType; use above "recorderType" instead.
        // mediaRecorder.mimeType = 'audio/webm'; // audio/ogg or audio/wav or audio/webm

        mediaRecorder.ondataavailable = function(blob) { //stop() メソッドが実行されると ondataavailable(event) が呼び出され、その中で blob 形式の音声データを取得
            console.log(blob);
            
            var a = document.createElement('a');
            a.target = '_blank';
            a.innerHTML = 'Open Recorded Audio No. ' + (index++) + ' (Size: ' + bytesToSize(blob.size) + ') Time Length: ' + getTimeLength(timeInterval);
            a.href = URL.createObjectURL(blob);
            console.log(a.href);
            
            audiosContainer.appendChild(a);
            audiosContainer.appendChild(document.createElement('hr'));
        
        };
        var timeInterval = 5000;
        if (timeInterval) timeInterval = parseInt(timeInterval);
        else timeInterval = 5 * 1000;
        // get blob after specific time interval
        mediaRecorder.start(timeInterval);
    }
    function onMediaError(e) {
        console.error('media error', e);
    }
    
    var audiosContainer = document.getElementById('audios-container');
    var index = 1;
    // below function via: http://goo.gl/B3ae8c
    function bytesToSize(bytes) {
        var k = 1000;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Bytes';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }
    // below function via: http://goo.gl/6QNDcI
    function getTimeLength(milliseconds) {
        var data = new Date(milliseconds);
        return data.getUTCHours() + " hours, " + data.getUTCMinutes() + " minutes and " + data.getUTCSeconds() + " second(s)";
    }
    */
}


function startRecognition() {
    console.log("start"+nowRecognition);
    window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
    recognition = new webkitSpeechRecognition();
    var finalTextA='';
    recognition.lang = 'ja';
    recognition.interimResults = true;
    recognition.continuous = true;
    //nowRecognition = true;
  
//     recognition.onerror = function() {
//         if(flag_speech == 0)
//           startRecognition();
//     };
// 
//     
//     recognition.onsoundend = function() {
//           startRecognition();
//     };
    
    
    recognition.onresult = function(event) {
        var results = event.results;
        
        for (var i = event.resultIndex; i < results.length; i++) {
            if (results[i].isFinal)
            {
                finalTextA += results[i][0].transcript;
                //startRecognition();
                if(finalTextA.match(/あ/) || finalTextA.match(/か/) || finalTextA.match(/さ/) || finalTextA.match(/た/) || finalTextA.match(/な/)){
                    appendMsgred("name: "+finalTextA);
                }
                else{
                    appendMsg("name: "+finalTextA);
                }
            }
            else
            {
                flag_speech = 1;
            }
        }
    };
    flag_speech = 0;
    recognition.start();
}

function stopRecognition(){
    console.log('stop');
    recognition.stop();
    nowRecognition = false;
}


/*              音量取得機能                */
var audioContext = null;
var meter = null;
var canvasContext = null;
var WIDTH=500;
var HEIGHT=50;
var rafID = null;
var fin = 0;

//音量取得開始ボタンをおしたとき
start = function() {
    fin = 0;
    startprocess(); //音量取得
    StartTimer(); //音量間隔
};

//音声取得終了ボタンをおしたとき
stop = function(){
    fin = 1; //音声取得を終了するflag
    createAudioMeter(); //終了するための関数呼び出し
    StopTimer(); //音量取得間隔のタイマーをリセットする関数呼び出し
    audioContext.close(); //AudioContextのメモリを解放
};

//Web Audio APIを利用する準備
startprocess = function() {
    

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
    audioContext = new AudioContext(); //最大6個しか作成できないのでメモリ解放の必要あり

    try {
        navigator.getUserMedia = 
            navigator.getUserMedia ||
        	navigator.webkitGetUserMedia ||
        	navigator.mozGetUserMedia;

        navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, didntGetStream);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }

};

//startprocessでエラーでたとき
function didntGetStream() {
    alert('Stream generation failed.');
}

var mediaStreamSource = null;

//よくわからない
function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    // kick off the visual updating
    //drawLoop(); メーター表示の関数呼び出し
}

/*
function  drawLoop( time ) {
    
    // clear the background
    canvasContext.clearRect(0,0,WIDTH,HEIGHT);

    // check if we're currently clipping
    if (meter.checkClipping())
        canvasContext.fillStyle = "red";
    else
        canvasContext.fillStyle = "green";

    // draw a bar based on the current volume
    canvasContext.fillRect(0, 0, meter.volume*WIDTH*1.4, HEIGHT);
    
    // set up the next visual callback
    rafID = window.requestAnimationFrame( drawLoop );
}
*/
//音量取得するための準備
var processor;
createAudioMeter = function(audioContext,clipLevel,averaging,clipLag) {
    if(fin != 1){
    console.log("音量取得開始");
    processor = audioContext.createScriptProcessor(512);
	processor.onaudioprocess = volumeAudioProcess;
	processor.clipping = false;
	processor.lastClip = 0;
	processor.volume = 0;
	processor.clipLevel = clipLevel || 0.98;
	processor.averaging = averaging || 0.95;
	processor.clipLag = clipLag || 750;
    
	// this will have no effect, since we don't copy the input to the output,
	// but works around a current Chrome bug.
	processor.connect(audioContext.destination);

	processor.checkClipping =
		function(){
			if (!this.clipping)
				return false;
			if ((this.lastClip + this.clipLag) < window.performance.now())
				this.clipping = false;
			return this.clipping;
		};
    }
	if(fin == 1){
        console.log("音量取得終了");
        processor.disconnect();
		this.onaudioprocess = null;
	}
	return processor;
};

var array = new Array(100); //音量を格納する配列
var n = 0; //Array配列のカウンタ

//音量の処理するとこ
volumeAudioProcess = function( event ) {
	var buf = event.inputBuffer.getChannelData(0);
    var bufLength = buf.length;
	var sum = 0;
    var x;
	// Do a root-mean-square on the samples: sum up the squares...
    for (var i=0; i<bufLength; i++) {
    	x = buf[i];
    	if (Math.abs(x)>=this.clipLevel) {
    		this.clipping = true;
    		this.lastClip = window.performance.now();
    	}
    	sum += x * x;
    }

    // ... then take the square root of the sum.
    var rms =  Math.sqrt(sum / bufLength);

    // Now smooth this out with the averaging factor applied
    // to the previous sample - take the max here because we
    // want "fast attack, slow release."
    this.volume = Math.max(rms, this.volume*this.averaging);
    
    array[n] = this.volume;
    n++;
};

/*
var StartTimer, StopTimer , Timer, timerID;
timerID = 0;

//音量間隔を決めるとこ
StartTimer = function() {
    timerID = setInterval(Timer, 2000); //2000ms(2秒間)
};

//音声取得が終了したときにタイマーのリセット
StopTimer = function() {
    clearInterval(timerID);
};

*/
var vol;

//一定間隔で音量を取得し、文字の大きさを変更する関数呼び出し
Timer = function() {
    /*
    var volsum = 0;
    for(var j = 0; j < n; j++){
      volsum = array[j] + volsum;
    }
  
    vol = volsum/(n);
    console.log("vol: "+vol);
    n = 0;
    */
};


//文字サイズ変更するとこ
/*
var fonsiz = 100;

function larger ()
{
    fonsiz = 120; document.getElementById('text').style.fontSize = fonsiz + '%';
}

function middle ()
{    
    fonsiz = 100; document.getElementById('text').style.fontSize = fonsiz + '%';
}


function smaller ()
{
    fonsiz = 80; document.getElementById('text').style.fontSize = fonsiz + '%';
}
*/



/*              録音機能            */

//cordovaの準備確認
document.addEventListener("deviceready", onDeviceReady, false);
    
function onDeviceReady() {
    console.log(navigator.device.capture);
    console.log(cordova.file);
    console.log(FileTransfer);
}
    
    
// キャプチャー操作の正常終了時の処理
//
function captureSuccess(mediaFiles) {
    var i, len;
    document.getElementById("myAudio").src = mediaFiles[0].fullPath;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        // ------------------------------------------------------------
        // 確認ボタン付きのダイアログボックスを表示して結果を得る
        // ------------------------------------------------------------
        var result = confirm( "音声を送信しますか?" );

        if(result){
            console.log(" OK が押された");
            uploadFile(mediaFiles[i]);
        }else{
         console.log(" CANCEL が押された");
        }
    }
} 

// エラー発生時の処理
//
function captureError(error) {
    var msg = 'キャプチャー中にエラーが発生しました: ' + error.code;
    navigator.notification.alert(msg, null, 'エラー');
}

// ボタンがクリックされた場合の処理
//
function captureAudio() {
    // デバイスのオーディオ録音アプリを起動し、
    // ユーザーに1つまでオーディオの録音を許可する
    navigator.device.capture.captureAudio(captureSuccess, captureError, {limit: 1});
    navigator.notification.alert('本文');
}

    
// ファイルをサーバーにアップロード

// function uploadFile(path) {
//      var ft = new FileTransfer();
//      
//      var options = new FileUploadOptions();
//      options.fileKey = "file";
//      options.fileName = new Date().YYYYMMDDHHMMSS() + ".wav";;
//      options.httpMethod = "POST";
//      options.mimeType = "audio/wav";
// 
//     var upload_url = "https://192.168.11.58/uploader.php"; //localhost
// 
//     // ファイルのアップロード
//     ft.upload(
//         path,
//         // "http://www.ne.jp/asahi/music/myuu/wave/cat1.wav", //アップロード元
//         
//         //encodeURI("http://172.20.10.4:2010"), //アップロード先        
//         //encodeURI("https://recodemo.herokuapp.com/server.js"), //アップロード先
//         encodeURI(upload_url), //アップロード先
//         
//         //成功時
//         function(result) {
//             console.log(upload_url+"へ送信");
//             console.log('アップロード成功: ' + result.responseCode);
//             console.log(result.bytesSent + ' バイト送信');
//         },
//         //失敗時
//         function(error) {
//             console.log('ファイルのアップロードに失敗 ' + path + ': ' + error.code);
//         },
//         //オプション
//         options,
//         true
//     );
// 
// }

/*コピペの術ここから
function uploadFile(uploadFileURL) {
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = new Date().YYYYMMDDHHMMSS() + ".wav";;
    options.mimeType = "audio/wav";

    var params = {};
    params.value1 = "test";
    params.value2 = "param";

    options.params = params;

    var fileTransfer = new FileTransfer();
    fileTransfer.upload(uploadFileURL, encodeURI("http://192.168.11.58/uploader.php"), onUploadSuccess, onUploadFail, options);
    function onUploadSuccess(result) {
        console.log("Code = " + result.responseCode);
        console.log("Response = " + result.response);
        console.log("Sent = " + result.bytesSent);
    }

    function onUploadFail(error) {
        console.log("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }
}
/*コピペの術ここまで*/

function disp(){

    // 「OK」時の処理開始 ＋ 確認ダイアログの表示
    if(window.confirm('保存せずに記録を終了してもよろしいですか？')){
    	//location.href = "home.html"; // home.html へジャンプ
        myNavigator.pushPage('home.html');
	}
}

function disp1(){

    // 「OK」時の処理開始 ＋ 確認ダイアログの表示
    if(window.confirm('チケットを1枚消費し記録を保存して終了してもよろしいですか？')){
    	//location.href = "home.html"; // home.html へジャンプ
        myNavigator.pushPage('home.html');
	}
}

function disp2(){

    // 「OK」時の処理開始 ＋ 確認ダイアログの表示
    if(window.confirm('記録を削除してもよろしいですか？')){
        //location.href = "home.html"; // home.html へジャンプ
        myNavigator.pushPage('histry.html');
	}
}

function disp3(){

    // 「OK」時の処理開始 ＋ 確認ダイアログの表示
    if(window.confirm('変更内容を破棄しますか？')){
        //location.href = "home.html"; // home.html へジャンプ
        myNavigator.pushPage("kirokueturan.html");
    }
}

function disp4(){

    // 「OK」時の処理開始 ＋ 確認ダイアログの表示
    if(window.confirm('変更内容を保存しますか？')){
        //location.href = "home.html"; // home.html へジャンプ
        myNavigator.pushPage('kirokueturan.html');
    }
}

function disp5(){

    // 「OK」時の処理開始 ＋ 確認ダイアログの表示
    if(window.confirm('変更内容を保存しますか？')){
        //location.href = "home.html"; // home.html へジャンプ
        myNavigator.pushPage('kirokuhennsyuu.html');
    }
}


var nowSampleRecognition = true;
function ctrlSampleRecognition(){
    //押したらボタンの画像変えるやつ
    if(nowSampleRecognition){
        nowSampleRecognition = false;
        document.getElementById("sampRec").src="image/stop.png";
        startCapture();
    }
    else{
        nowSampleRecognition = true;
        document.getElementById("sampRec").src="image/play.png";
        stopCapture();
    }

}



