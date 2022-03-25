$(document).ready(function(){
    webdb_Init_ifnotexist();
});

async function savecards(){    
    var fronthead = $('#front_header').val();
    var frontbody = $('#front_body').val();
    var backhead = $('#back_header').val();
    var backbody = $('#back_body').val();

    if(!(!fronthead && !frontbody && !backhead && !backbody)){        
        addCard(fronthead, frontbody, backhead, backbody);
    }

    webdb_SaveInFile();
}

function addCard(fronthead, frontbody, backhead, backbody){
    var card = new Card(0, fronthead, frontbody, backhead, backbody, 0, 0)
    webdb_AddCard_newid(card)
}

function nextcard(){
    var fronthead = $('#front_header').val();
    var frontbody = $('#front_body').val();
    var backhead = $('#back_header').val();
    var backbody = $('#back_body').val();

    addCard(fronthead, frontbody, backhead, backbody);
    clearinput();
}

function clearinput() {
    $('#front_header').val("");
    $('#front_body').val("");
    $('#back_header').val("");
    $('#back_body').val("");
}

function backbutton(){
    $('#exampleModalCenter').modal('show')
    
}

function modal_cancel(){    
    $('#exampleModalCenter').modal('hide')
}