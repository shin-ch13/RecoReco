console.log("読める");
// Capture configuration object
var captureCfg = {};

// Audio Buffer
var audioDataBuffer = [];

// Timers
var timerInterVal, timerGenerateSimulatedData;

var objectURL = null;

// Info/Debug
var totalReceivedData = 0;

// URL shim
window.URL = window.URL || window.webkitURL;

/**
 * Called continuously while AudioInput capture is running.
 */
function onAudioInputCapture(evt) {
    try {
        if (evt && evt.data) {
            // Increase the debug counter for received data
            totalReceivedData += evt.data.length;

            // Add the chunk to the buffer
            audioDataBuffer = audioDataBuffer.concat(evt.data);
        }
    }
    catch (ex) {
        alert("onAudioInputCapture ex: " + ex);
    }
}


/**
 * Called when a plugin error happens.
 */
function onAudioInputError(error) {
    alert("onAudioInputError event recieved: " + JSON.stringify(error));
}


/**
 *
 */


var reader = new FileReader(); //blobを読み込むためにFileReaderオブジェクトを作成


var startCapture = function () {
    console.log("動いている");
    try {
        console.log("読める");
        if (window.audioinput && !audioinput.isCapturing()) {

            var audioSourceElement = document.getElementById("audioSource"),
                audioSourceType = 0;
            
            
            captureCfg = {
                sampleRate:  audioinput.SAMPLERATE.VOIP_16000Hz,
                bufferSize: 8192,
                channels: audioinput.CHANNELS.MONO,
                format: audioinput.FORMAT.PCM_16BIT,
                audioSourceType:  0
            };
            
            
            audioinput.start(captureCfg);
            console.log("Microphone input started!");

            // Throw previously created audio
            /*
            document.getElementById("recording-list").innerHTML = "";
            if (objectURL) {
                URL.revokeObjectURL(objectURL);
            }
            */
            // Start the Interval that outputs time and debug data while capturing
            //
            //timerInterVal = setInterval(function () {
            //    if (audioinput.isCapturing()) {
            //        //document.getElementById("infoTimer").innerHTML = "" +
            //            new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1") +
            //            "|Received:" + totalReceivedData;
            //    }
            //}, 1000);

            //disableStartButton();
        }
    }
    catch (e) {
        alert("startCapture exception: " + e);
    }
};


/**
 *
 */

var wavURL = "";
var audiobuffer = 1;


var stopCapture = function () {
    try {
        if (window.audioinput && audioinput.isCapturing()) {
            
            if (timerInterVal) {
                clearInterval(timerInterVal);
            }
            
            
            if (isMobile.any() && window.audioinput) {
                audioinput.stop();
            }
            else {
                clearInterval(timerGenerateSimulatedData);
            }

            totalReceivedData = 0;
            //document.getElementById("infoTimer").innerHTML = "";

            console.log("Encoding WAV...b");
            var encoder = new WavAudioEncoder(captureCfg.sampleRate, captureCfg.channels);
            encoder.encode([audioDataBuffer]);
            console.log(encoder.size);
            console.log("Encoding WAV finished");

            var blob = encoder.finish("audio/wav"); //wavにエンコードしてblob形式で返す
            console.log("BLOB created");//ココから
            
            
            /*ヘッダのバイナリデータの解析*/
            reader.readAsArrayBuffer(blob);
            /*ヘッダのバイナリデータの解析*/
            
            reader.onload = function(e) {
                var little_endian = true;

        
                var data = e.target.result; //blobのバイナリデータのオブジェクトを読み込み
                var data_view = new DataView( data ); //blobを書き換えるためにdata_viewを作成
        
                data_view.setUint16( 28 , 0x7d00 , little_endian ); //ヘッダのbytes per second(データ転送速度)をFAから7Dに書き換え
                var ary_u8 = new Uint8Array( data ); //2byteずつの10進数の配列表示
                //console.log(ary_u8[29]);    //bytes per secondの中身確認
                
                var b = new Blob([ary_u8]); //ヘッダを書き換えたblobを新しく作成
                console.log("b"+b); //ちゃんとbがblobとして生成できているか確認
          
                 var result = confirm( "音声を送信しますか?" );//ココまでの間のわちゃわちゃしたやつ消しまして
                if(result){
                    console.log(" OK が押された");
                    enrollAccount(b);
                }else{
                    console.log(" CANCEL が押された");
                }
            }
        }
    }
    catch (e) {
        alert("stopCapture exception: " + e);
    }
};

var b;
var stopCapture_write = function () {
    try {
        if (window.audioinput && audioinput.isCapturing()) {
            
            if (timerInterVal) {
                clearInterval(timerInterVal);
            }
            
            
            if (isMobile.any() && window.audioinput) {
                audioinput.stop();
            }
            else {
                clearInterval(timerGenerateSimulatedData);
            }

            totalReceivedData = 0;
            //document.getElementById("infoTimer").innerHTML = "";

            console.log("Encoding WAV...a");
            encoder = new WavAudioEncoder(captureCfg.sampleRate, captureCfg.channels);
            encoder.encode([audioDataBuffer]);

            console.log("Encoding WAV finished");

            var blob = encoder.finish("audio/wav"); //wavにエンコードしてblob形式で返す
            console.log("BLOB created");//ココから
            
            console.log(blob.size);
            
                        
            /*ヘッダのバイナリデータの解析*/
            reader.readAsArrayBuffer(blob);
            /*ヘッダのバイナリデータの解析*/
            
            console.log(blob.size);

            reader.onload = function(e) {
                console.log("blob_header");
                var little_endian = true;

        
                var data = e.target.result; //blobのバイナリデータのオブジェクトを読み込み
                var data_view = new DataView( data ); //blobを書き換えるためにdata_viewを作成
        
                data_view.setUint16( 28 , 0x7d00 , little_endian ); //ヘッダのbytes per second(データ転送速度)をFAから7Dに書き換え
                var ary_u8 = new Uint8Array( data ); //2byteずつの10進数の配列表示
                //console.log(ary_u8[29]);    //bytes per secondの中身確認
                
                b = new Blob([ary_u8]); //ヘッダを書き換えたblobを新しく作成
                console.log("b"+b); //ちゃんとbがblobとして生成できているか確認

                upload(b);
                audioDataBuffer = []; //ここで初期化？
                audioinput.disconnect();
            }
        }
    }
    catch (e) {
        //alert("stopCapture exception: " + e);　一番最初だけエラー出るからコメントアウトした
    }
};


/*                  秒間隔でデータをサーバへ送る                     */

var StartTimer, StopTimer , Timer, timerID, capture_flag, Capture;
timerID = 0;
capture_flag = 0;

StartTimer = function() {
    timerID = setInterval(Capture, 6000000); //600000ms(10分間)
};


//録音終了ボタンおしたときに呼び出す
//30秒のインターバルをリセット
//app.jsの470あたりの終了ボタンの関数に追加の必要


StopTimer = function() {
    clearInterval(timerID);
    console.log("finish");
};


Capture = function(){
    console.log("restart");
    stopCapture_write(); //録音OFF
    
    audioReady();

    // Audio Buffer
    audioDataBuffer = [];

    startCapture(); //録音ON
}


/*                                             */



/**
 *
 */
//var initUIEvents = function () {
//    document.getElementById("startCapture").addEventListener("click", startCapture);
//    document.getElementById("stopCapture").addEventListener("click", stopCapture);
//};


/**
 * When cordova fires the deviceready event, we initialize everything needed for audio input.
 */
var onDeviceReady = function () {
    audioReady();
};

function audioReady(){
    if (window.cordova && window.cordova.file && window.audioinput) {
    
            //initUIEvents();
    
            console.log("Use 'Start Capture' to begin...");
    
            // Subscribe to audioinput events
            
            window.addEventListener('audioinput', onAudioInputCapture, false);
            window.addEventListener('audioinputerror', onAudioInputError, false);
        }
        else {
            console.log("Missing: cordova-plugin-file or cordova-plugin-audioinput!");
            //disableAllButtons();
    }
}

// Make it possible to run the demo on desktop
if (!window.cordova) {
    // Make it possible to run the demo on desktop
    console.log("Running on desktop!");
    onDeviceReady();
}
else {
    // For Cordova apps
    document.addEventListener('deviceready', onDeviceReady, false);
}



