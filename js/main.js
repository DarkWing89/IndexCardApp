const _card = document.querySelector('.card__inner');
var _html_newCards = document.getElementById('_newcards');
var _html_box1 = document.getElementById('_box1');
var _html_box2 = document.getElementById('_box2');
var _html_box3 = document.getElementById('_box3');
var _html_box4 = document.getElementById('_box4');
var _html_box5 = document.getElementById('_box5');
var _config = [10, 20, 30, 40, 50];
var _currentCard;

_card.addEventListener('click', function () {
    _card.classList.toggle('is-flipped');
})

async function click_loadcards() {
    const opts = {
        types: [{
            description: 'Json File',
            accept: { 'application/json': ['.json'] }
        }],
        excludeAcceptAllOption: true,
        multiple: false
    };
    [fileHandle] = await window.showOpenFilePicker(opts);
    try {
        let fileData = await fileHandle.getFile();
        let text = await fileData.text();
        var cards = JSON.parse(text);
        await webdb_Init(cards);
        //indb_Init(cards);
        selectNewCard();
    } catch (err) {
        alert("File could not be loaded");
    }
}

function click_correct() {
    webdb_CardCorrect(_currentCard);
}

function click_wrong() {
    webdb_CardWrong(_currentCard);
}

function click_save() {
    webdb_SaveInFile();
}

function selectNewCard() {    
    updateCounts();
    webdb_ScanBoxForNewCard(5);
}

async function selectNewCard_Callback(currentBox, count) {
    if (currentBox == 5) {
        if (count >= _config[4]) {
            webdb_SelectNextCardFromBox(5);
        } else {
            webdb_ScanBoxForNewCard(4);
        }
    } else if (currentBox == 4) {
        if (count >= _config[3]) {
            webdb_SelectNextCardFromBox(4);
        } else {
            webdb_ScanBoxForNewCard(3);
        }
    } else if (currentBox == 3) {
        if (count >= _config[2]) {
            webdb_SelectNextCardFromBox(3);
        } else {
            webdb_ScanBoxForNewCard(2);
        }
    } else if (currentBox == 2) {
        if (count >= _config[1]) {
            webdb_SelectNextCardFromBox(2);
        } else {
            webdb_ScanBoxForNewCard(1);
        }
    } else if (currentBox == 1) {
        if (count >= _config[0]) {
            webdb_SelectNextCardFromBox(1);
        } else {
            webdb_SelectNextCardFromBox(0);
        }
    }
}

function updateCounts() {
    webdb_UpdateBoxCount(0, updateBox0);
    webdb_UpdateBoxCount(1, updateBox1);
    webdb_UpdateBoxCount(2, updateBox2);
    webdb_UpdateBoxCount(3, updateBox3);
    webdb_UpdateBoxCount(4, updateBox4);
    webdb_UpdateBoxCount(5, updateBox5);
}

function updateBox0(value) {
    _html_newCards.innerHTML = value;
}
function updateBox1(value) {
    _html_box1.innerHTML = value;
}
function updateBox2(value) {
    _html_box2.innerHTML = value;
}
function updateBox3(value) {
    _html_box3.innerHTML = value;
}
function updateBox4(value) {
    _html_box4.innerHTML = value;
}
function updateBox5(value) {
    _html_box5.innerHTML = value;
}

