var chat = $("#chat"), messageINP = $("#message"), sound = "https://freesound.org/data/previews/399/399191_5549581-lq.mp3";

var chatbox = document.querySelector('.chat');

var d = new Date();
var n = d.toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute:'2-digit'
  });

// <brain>
// THIS IS A BRAIN OF BOT
var topicJSON = [{ask:"hi", ans:["Hello ;)"]},
                 {ask:"hello", ans:["Hi ;)"]},
                 {ask:"How are you?", ans:["I'm fine, thanks! You?"]},
                 {ask:"Good", ans:["Great!! :)"]}
                ];
// </brain>

function renderAvaiable(){
  let html = "";
  for(let i=0; i<topicJSON.length; i++){
    if(i != 0){
      html += ", ";
    }
    html += topicJSON[i].ask;
  }

  $("#avaiable").text(html);
}
renderAvaiable();

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function answer(){
  console.clear();
  //Find topic in main JSON
  let lastMeMessage = chat.find(".me:last").text();

  console.log("Last Message from Me: " + lastMeMessage);

  let regTopic = new RegExp(lastMeMessage, "gmi");
  let topicSel = null;

  for(let i=0; i<topicJSON.length; i++){
    if( regTopic.test( topicJSON[i].ask ) ){
      console.log(`${topicJSON[i].ask} is the same like ${lastMeMessage}`);
      topicSel = i;
      break;
    }
    else{
      console.log(`${topicJSON[i].ask} is NOT the same like ${lastMeMessage}`);
    }
  }

  console.log("Founded matching topic ask: ");
  console.log(topicSel);

  //Find answer in selected JSON
  if(topicSel != null){
    let selectedAnswers = topicJSON[ topicSel ]['ans'];
    let finAnswer = selectedAnswers[ getRandomInt(0, selectedAnswers.length-1) ];

    sendMessage(finAnswer ,"bot");
  }
  else{
    sendMessage("Could you be more specific, please?" ,"bot");
  }

}

function checkChat(){
  setTimeout(function(){
    answer();
  }, 1000);
}

function sendMessage(mes, who){
  if(who == "bot"){
    chat.append(`<div class="text-success" style="font-weight: bold; font-size: 22px;"> BOT: </div>` + `<div class="card bg-light border-0 shadow-sm p-0 mb-3"><div class="card-body"><p class="mb-0 ${who}">${mes}</p></div></div>` + `<div class="text-white"><p class="mb-0 ">${n}</p></div>`);
  }
  else{
    chat.append(`<div class="text-primary" style="font-weight: bold; font-size: 22px;"> You: </div>` + `<div class="card text-white bg-primary border-0 shadow-sm p-0 mb-3"><div class="card-body"><p class="mb-0  ${who}">${mes}</p></div></div>` + `<div class="text-white"><p class="mb-0 ">${n}</p></div>`);
  }

  let audio = new Audio(sound).play();

  if(who == "me") checkChat();
}

function getMessageInput(){
  messageINP.val( messageINP.val().replace(/^\s+|\s+$/g,'')  );

  if(messageINP.val() == "") return;
  sendMessage( messageINP.val(), "me" );
  messageINP.val("");
}

messageINP.on("keydown", function(e){
  if(e.keyCode == 13){
     getMessageInput();
     event.preventDefault();
     document.getElementById("#send").click();
  }
});

$("#send").on("click", function(){
  getMessageInput();
});

// micro

const searchForm = document.querySelector("#search-form");
const searchFormInput = searchForm.querySelector("input"); // <=> document.querySelector("#search-form input");

// The speech recognition interface lives on the browser’s window object
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; // if none exists -> undefined

if(SpeechRecognition) {
  console.log("Your Browser supports speech Recognition");
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "tr";

  searchForm.insertAdjacentHTML("beforeend", '<button class="btn btn-outline-primary" style="position: relative; bottom: 38px; right: 45px;" type="button"><i class="fas fa-microphone"></i></button>');
  /*searchFormInput.style.paddingRight = "855px";*/


  const micBtn = searchForm.querySelector("button");
  const micIcon = micBtn.firstElementChild;

  micBtn.addEventListener("click", micBtnClick);
  function micBtnClick() {
    if(micIcon.classList.contains("fa-microphone")) { // Start Voice Recognition
      recognition.start(); // First time you have to allow access to mic!
    }
    else {
      recognition.stop();
    }
  }

  recognition.addEventListener("start", startSpeechRecognition); // <=> recognition.onstart = function() {...}
  function startSpeechRecognition() {
    micIcon.classList.remove("fa-microphone");
    micIcon.classList.add("fa-microphone-slash");
    searchFormInput.focus();
    console.log("Voice activated, SPEAK");
  }

  recognition.addEventListener("end", endSpeechRecognition); // <=> recognition.onend = function() {...}
  function endSpeechRecognition() {
    micIcon.classList.remove("fa-microphone-slash");
    micIcon.classList.add("fa-microphone");
    searchFormInput.focus();
    console.log("Speech recognition service disconnected");
  }

  recognition.addEventListener("result", resultOfSpeechRecognition); // <=> recognition.onresult = function(event) {...} - Fires when you stop talking
  function resultOfSpeechRecognition(event) {
    console.log(event);
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;

    if(transcript.toLowerCase().trim()==="stop recording") {
      recognition.stop();
    }
    else if(!searchFormInput.value) {
      searchFormInput.value = transcript;
    }
    else {
      if(transcript.toLowerCase().trim()==="go") {
        searchForm.submit();
      }
      else if(transcript.toLowerCase().trim()==="reset input") {
        searchFormInput.value = "";
      }
      else {
        searchFormInput.value = transcript;
      }
    }
    // searchFormInput.value = transcript;
    // searchFormInput.focus();
    // setTimeout(() => {
    //   searchForm.submit();
    // }, 500);
  }
}
else {
  console.log("Your Browser does not support speech Recognition");
}


$(function () {
  // var $targetText = $('.js-txtEntered').text();
  var $speakButton = $('.js-speakButton');

  $($speakButton).click('click', function () {
    var $targetText = $('.js-txtEntered').text();
    responsiveVoice.speak(
      $targetText,
      "Turkish Male",
      {
        rate: 1,
        pitch: 1,
        volume: 1
      }
    );
  });

});

//Reverse wheel direction
document.querySelector('.messages-container').addEventListener('wheel', function(e) {
  if(e.deltaY) {
    e.preventDefault();
    e.currentTarget.scrollTop -= parseFloat(getComputedStyle(e.currentTarget).getPropertyValue('font-size')) * (e.deltaY < 0 ? -1 : 1) * 2;
  }
});

//The rest of the JS just handles the test buttons and is not part of the solution
send = function() {
  var inp = document.querySelector('.text-input');
  document.querySelector('.scroll').insertAdjacentHTML('beforeend', '<p>' + inp.value);
  inp.value = '';
  inp.focus();
}
resize = function() {
  var inp = document.querySelector('.text-input');
  inp.style.height = inp.style.height === '50%' ? null : '50%';
}
