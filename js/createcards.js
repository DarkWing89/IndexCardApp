const newCards = []

async function savecards(){    
    var fronthead = $('#front_header').val();
    var frontbody = $('#front_body').val();
    var backhead = $('#back_header').val();
    var backbody = $('#back_body').val();

    if(!(!fronthead && !frontbody && !backhead && !backbody)){        
        addCard(fronthead, frontbody, backhead, backbody);
    }

    var jsonstring = JSON.stringify(newCards);
    const opts = {
        types:[{
            description: 'Json File',
            accept: {'application/json': ['.json']}
        }],
        excludeAcceptAllOption: true,
        multiple: false
    };
    fileHandle = await window.showSaveFilePicker(opts);
    let stream = await fileHandle.createWritable()
    await stream.write(jsonstring);
    await stream.close();
}

function addCard(fronthead, frontbody, backhead, backbody){
    var card = new Card(newCards.length+1, fronthead, frontbody, backhead, backbody, 0, 0)
    newCards.push(card);
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