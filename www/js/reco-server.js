// This is a JavaScript file

//var connection_url = "https://recodemo.herokuapp.com/server.js"; //heroku
//var connection_url = "ws://192.168.11.58:2010"; //local
//var connection_url = "http://192.168.0.5:2010"; //local
//var connection_url = "ws://172.20.10.2:2010"; //local

var connection_url = "http://133.25.196.30:2010"; //法政サーバ
var socket = io.connect(connection_url); // C02. ソケットへの接続
var isEnter = false;
var userName = '';

//サーバとコネクトできたら実行(コネクトできるまではloading？)
socket.on("connect_response", function(data){
    console.log("connect");
});

/*
$("form").submit(function(e)
{
    var message = $("#recordname").val();
    var selectRoom = $("#password").val();
    $("#recordname").val('');
    console.log(message);
    console.log(selectRoom);
    if (isEnter)
    {
        // C03. client_to_serverイベント・データを送信する
        socket.emit("emit_chat", {message_value : message});
    }
    else
    {
        userName = message;
        var entryMessage = userName + "　さんが入室しました。";
        socket.emit("server_join", {select_room_value : selectRoom});
        // C05. client_to_server_broadcastイベント・データを送信する
        socket.emit("login_announce_for_others", {entry_message_value : entryMessage});
        // C06. client_to_server_personalイベント・データを送信する
        socket.emit("login_announce_on_myself", {user_name_value : userName});
        changeLabel();
    }
    e.preventDefault();
});
*/

    // C04. server_to_clientイベント・データを受信する

/*
socket.on("append_chat", function(data){
    //alert(data.list_of_enphasis_data_value);
    $("#chatLogs").append("<div>["+ data.user_name_value +"] <FONT size=\""+fontSize+"\" color=\"" + data.font_color_value + "\">"+ data.message_value  + "</FONT></div>");
});
*/

/*
socket.on("system_announce", function(data){
    $("#name_inroom").append("<span>" + data.system_log_value + "</span>");
});
*/

// var nickname;
// var roomname; //部屋名
// socket.on('make_room', function(data){
//     console.log("make_room");
//     roomname = data.roomname_value;
//     nickname = data.username_value;
//     
//     console.log("部屋名: "+roomname);
//     console.log("ユーザ名: "+nickname);
//     
// });

/*
socket.emit("login_announce_for_others", {entry_message_value : nickname});
*/



/*
var nickname; //部屋名
socket.on('create_nickname', function(data){
    message = data.message_value;
    nickname = data.message;
    console.log(nickname);
});
*/

/*
socket.on("append_chat", function(data){
    //alert(data.list_of_enphasis_data_value);
    $("#pass_inroom").append("<div>["+ data.user_name_value +"] <FONT size=\""+fontSize+"\" color=\"" + data.font_color_value + "\">"+ data.message_value  + "</FONT></div>");
});
*/

// function changeLabel() {
//     $(".userNameLabel").text("メッセージ：");
//     $("#rooms").prop("disabled", true);
//     $("button").text("送信");
//     isEnter = true;
// }


//書き起こし文章の受取と表示
/*
socket.on("transcript_response", function(data) {
    //文字が入っていないときは何も表示しない
    if(data.message_list_value.length != 0){
        $("#chatLogs").append("<div> ["+ data.user_name_value +"]");
    }
    for (i=0; i < data.message_list_value.length; i++){
        color = data.message_list_value[i].color;
        msg = data.message_list_value[i].word;
        fontSize = data.font_size_value[i].size;
        appendMsg(msg,color,fontSize);
    }
    scrollPage();
});
*/

socket.on("login_account_response", function(data){
    if(data.login_result_value=="true"){
        myNavigator.pushPage('home.html');
        userNickName = data.user_name_value;
    }
    else{
            ons.notification.alert({
                message: 'ログインに失敗しました'
            });
    }
})


                /*会話の書き起こし*/

socket.on('transcript_response', function(data){
    console.log("transcript_response");
    
            
    //会話記録の初期化
    var elem = document.getElementById("chatLogs");
    elem.innerHTML = "";
    
    modal.hide();        
    var before_username = "";
    for(j=0; j < data.message_list_value.length;){
        $("#chatLogs").append("<div> ["+ data.message_list_value[j].name +"]");
        do{
            $("#chatLogs").append("<FONT size=\""+data.message_list_value[j].size+"\" color=\"" + data.message_list_value[j].color + "\">"+ data.message_list_value[j].word  + "</FONT>");
            if(data.message_list_value[j].br==="true")
            {
                $("#chatLogs").append("<br>");
            }
            before_username = data.message_list_value[j].name;
            j++;
            if(data.message_list_value.length == j){
                break;
            }
        }while(data.message_list_value[j].name == before_username);
    }
    $("#chatLogs").append("<br></div>");
});



//ファイルアップロードやつ

function upload(file){
    console.log("upload");
    var fileReader = new FileReader();
	var send_file = file;
	//var type = send_file.type;//♪L( ՞ਊ ՞)┘└( ՞ਊ ՞)」♪
	var data = {};

	fileReader.readAsBinaryString(send_file);//んでココでblobをバイナリにコンバートして

	fileReader.onload = function(event) {
		//data.file = event.target.result;
		//data.name = "uploadFile";
        var fileName = new Date().YYYYMMDDHHMMSS() + ".wav";
		//data.type = type;//♪L( ՞ਊ ՞)┘└( ՞ਊ ՞)」♪
		socket.emit('transcript',
        {
    	    audio_file_value : event.target.result,
            file_name_value  : fileName
		});//送信！
	};
}



                    /*会話記録*/



//記録閲覧から記録一覧画面に戻る時に記録名をサーバに問い合わせる
function recordname_back() {
    myNavigator.resetToPage('histry.html');
    myNavigator.on('postpush',function(event){
        //サーバに記録名一覧をリクエストする
        console.log("get_record_room_list");
        socket.emit("get_record_room_list");
    });
}

//記録一覧画面に遷移したら記録名をサーバに問い合わせる
function recordname_test() {
    myNavigator.pushPage('histry.html');
    myNavigator.on('postpush',function(event){
        //サーバに記録名一覧をリクエストする
        console.log("request record_list");
        socket.emit("get_record_room_list");        
    });
}
//サーバから会話記録の一覧受け取るとこ
socket.on("get_record_room_list_response", function(data){
    console.log("get_record_room_list_response");
    //初期化
    var elem = document.getElementById("top_histList");
    elem.innerHTML = "";
    for(i=0; i<data.record_room_list_value.length; i++){
        $("#top_histList").append("<input class=\"test\" id=\""+data.record_room_list_value[i].room_id+"\" type=\"button\"; value=\""+data.record_room_list_value[i].room_name+"\"; onclick=\"push(this)\";></input>");
    }
});

//会話記録選択してページ遷移、会話記録を表示するところ
function push(select_record){
    console.log("room_id: "+select_record.id+"  room_name: "+select_record.value);
    myNavigator.pushPage('kirokueturan.html');
    myNavigator.on('postpush',function(event){
        //ボタンのvalueをサーバに送信
        console.log("emit request_record_room_id: "+select_record.id);
        socket.emit("request_record", { room_id_value : select_record.id });
        //socket.emit('record_request');
        
    });
}

//サーバから会話記録の内容を受け取って表示する
socket.on('request_record_response', function(data){
    console.log("request_record_response");
            
    //会話記録の初期化
    var elem = document.getElementById("top_histList2");
    elem.innerHTML = "";
            
    //document.getElementById("top_histList2").innerHTML = data.record_text_value;
    var before_username = "";
    for(j=0; j < data.message_list_value.length;){
        $("#top_histList2").append("<div> ["+ data.message_list_value[j].name +"]");
        do{
            //console.log("会話記録表示");
            $("#top_histList2").append("<FONT size=\""+data.message_list_value[j].size+"\" color=\"" + data.message_list_value[j].color + "\">"+ data.message_list_value[j].word  + "</FONT>");
            console.log(data.message_list_value[j].br);
            if(data.message_list_value[j].br==="true")
            {
                $("#top_histList2").append("<br>");
            }
            before_username = data.message_list_value[j].name;
            j++;
            if(data.message_list_value.length == j){
                break;
            }
        }while(data.message_list_value[j].name == before_username);
    }
    $("#top_histList2").append("<br></div>");
});






                    /*部屋参加*/



//記録検索画面に遷移したら記録名(コネクトしてるもの全て)をサーバに問い合わせる
function recordsearch_test() {
        /*
        var  searchName= '';
        searchName = document.search_room.name.value;
        //サーバに検索結果に一致する記録名一覧をリクエストする
        socket.emit("get_room_list",
        {
            search_room_name : searchName
        });
        */
        socket.emit("get_room_list");
}
//サーバから記録名を受け取るとこ
socket.on("get_room_list_response", function(data){
    console.log("get_room_list_response");
    //top_recordListの初期化
    var elem = document.getElementById("top_recordList"); 
    elem.innerHTML = "";
    for(i=0; i<data.room_list_value.length; i++){
        $("#top_recordList").append("<input class=\"test\" id=\""+data.room_list_value[i].room_id+"\" type=\"button\"; value=\""+data.room_list_value[i].room_name+"\"; onclick=\"push2(this)\";></input>");
    }
});


var joinRoomname;
var joinRoomid;
//パスワード入力画面してページ遷移、会話記録を表示するところ
function push2(select_searchroom){
    console.log("room_id: "+select_searchroom.id+"  room_name: "+select_searchroom.value);
    
    joinRoomname='';
    joinRoomname=select_searchroom.value;
    
    joinRoomid='';
    joinRoomid=select_searchroom.id;
    
    JoinNavigator.pushPage('join2.html');
    JoinNavigator.on('postpush',function(event){
            
        var elem = document.getElementById("Roomname");
        elem.innerHTML = "";
        $("#Roomname").append(joinRoomname);

    });
}

//パスワード入力画面に入力されたパスワードの認証
function passsearch_test() {
    var roomPW = '';
    roomPW = document.form_pass.roomPW.value;
    console.log("join_room "+joinRoomid+" "+roomPW);
    socket.emit("join_room",
    { 
        room_id_value : joinRoomid,
        room_pw_value : roomPW
    });
    
}

socket.on("join_room_response",function(data){
        console.log("join_result");
        if(data.join_result_value=="true")
        {
            /*
            ons.notification.alert({
                message: '成功'
            });
            */
            myNavigator.pushPage('recording.html');
            console.log(joinRoomname);
            document.getElementById("name_inroom").innerHTML = joinRoomname;
        }
        else
        {
            ons.notification.alert({
                message: 'パスワードが違います'
            });
        }

        //console.log(userID+","+joinRoomname+","+roomPW);
        //ユーザID、部屋名、部屋のパスワードをサーバへ送信
        /*
        socket.emit('room_join', {
            userID_value : userID,
            room_name_value : joinRoomname,
            room_pass_value : roomPW
        });
        
        socket.on("return_room_join", function(data){
            console.log("response: "+data.table_callback_value);
            if(data.table_callback_value){
                myNavigator.pushPage('recording.html');
                var elem = document.getElementById("name_inroom");
                elem.innerHTML = data.room_name_value;
            }
            else{
                ons.notification.alert({
                    message: 'エラーが発生しました。'
                });
                return false; // 送信を中止
            }
        });
        
        
        //recording.htmlに移動後に実行される関数
        myNavigator.on('postpush',function(event){
            //部屋名を追加
            //$("#name_inroom").append("<div>["+ roomname +"]</div>");
            document.getElementById("name_inroom").innerHTML="[" + roomname + "]";
            //参加者(ユーザ名)を追加
            $("#nickname_inroom").append("<span>"+ nickname +" </span>");
        });
        */
});


