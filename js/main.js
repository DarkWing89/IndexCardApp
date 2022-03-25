const _card = document.querySelector('.card__inner');
var _html_newCards = document.getElementById('_newcards');
var _html_box1 = document.getElementById('_box1');
var _html_box2 = document.getElementById('_box2');
var _html_box3 = document.getElementById('_box3');
var _html_box4 = document.getElementById('_box4');
var _html_box5 = document.getElementById('_box5');
var _config = [10, 20, 30, 40, Number.MAX_SAFE_INTEGER];
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

    var cardinner = $('.card__inner')
    if (cardinner.hasClass('is-flipped')) {
        cardinner.removeClass('is-flipped');
        setTimeout(function () {
            webdb_ScanBoxForNewCard(5, selectNewCard_Callback);
        }, (300));
    }else{
        webdb_ScanBoxForNewCard(5, selectNewCard_Callback);
    }

}

async function selectNewCard_Callback(currentBox, count) {
    if (currentBox == 5) {
        if (count >= _config[4]) {
            webdb_SelectNextCardFromBox(5);
        } else {
            webdb_ScanBoxForNewCard(4, selectNewCard_Callback);
        }
    } else if (currentBox == 4) {
        if (count >= _config[3]) {
            webdb_SelectNextCardFromBox(4);
        } else {
            webdb_ScanBoxForNewCard(3, selectNewCard_Callback);
        }
    } else if (currentBox == 3) {
        if (count >= _config[2]) {
            webdb_SelectNextCardFromBox(3);
        } else {
            webdb_ScanBoxForNewCard(2, selectNewCard_Callback);
        }
    } else if (currentBox == 2) {
        if (count >= _config[1]) {
            webdb_SelectNextCardFromBox(2);
        } else {
            webdb_ScanBoxForNewCard(1, selectNewCard_Callback);
        }
    } else if (currentBox == 1) {
        if (count >= _config[0]) {
            webdb_SelectNextCardFromBox(1);
        } else {
            webdb_ScanBoxForNewCard(0, selectNewCard_Callback);
        }
    } else if (currentBox == 0) {
        if (count > 0) {
            webdb_SelectNextCardFromBox(0);
        } else {
            selectNewCardReverse_Callback(0, 0);
        }
    }
}

async function selectNewCardReverse_Callback(currentBox, count) {
    if (currentBox == 0) {
        if (count > 0) {
            webdb_SelectNextCardFromBox(0);
        } else {
            webdb_ScanBoxForNewCard(1, selectNewCardReverse_Callback);
        }
    } else if (currentBox == 1) {
        if (count > 0) {
            webdb_SelectNextCardFromBox(1);
        } else {
            webdb_ScanBoxForNewCard(2, selectNewCardReverse_Callback);
        }
    } else if (currentBox == 2) {
        if (count > 0) {
            webdb_SelectNextCardFromBox(2);
        } else {
            webdb_ScanBoxForNewCard(3, selectNewCardReverse_Callback);
        }
    } else if (currentBox == 3) {
        if (count > 0) {
            webdb_SelectNextCardFromBox(3);
        } else {
            webdb_ScanBoxForNewCard(4, selectNewCardReverse_Callback);
        }
    } else if (currentBox == 4) {
        if (count > 0) {
            webdb_SelectNextCardFromBox(4);
        } else {
            webdb_ScanBoxForNewCard(5, selectNewCardReverse_Callback);
        }
    } else if (currentBox == 5) {
        webdb_SelectNextCardFromBox(5);
    }
}

var _progress_0 = null;
var _progress_1 = null;
var _progress_2 = null;
var _progress_3 = null;
var _progress_4 = null;
var _progress_5 = null;

function updateCounts() {
    _progress_0 = null;
    _progress_1 = null;
    _progress_2 = null;
    _progress_3 = null;
    _progress_4 = null;
    _progress_5 = null;
    webdb_UpdateBoxCount(0, updateBox0);
    webdb_UpdateBoxCount(1, updateBox1);
    webdb_UpdateBoxCount(2, updateBox2);
    webdb_UpdateBoxCount(3, updateBox3);
    webdb_UpdateBoxCount(4, updateBox4);
    webdb_UpdateBoxCount(5, updateBox5);
}

function trySetProgress() {
    if (_progress_0 != null &&
        _progress_1 != null &&
        _progress_2 != null &&
        _progress_3 != null &&
        _progress_4 != null &&
        _progress_5 != null) {
        var sum = (_progress_0 + _progress_1 + _progress_2 + _progress_3 + _progress_4 + _progress_5) * 5;
        var progress = Math.round((_progress_1 + _progress_2 * 2 + _progress_3 * 3 + _progress_4 * 4 + _progress_5 * 5) * 100 / sum)
        var progressBar = $('.progress-bar');
        progressBar.css('width', progress + '%');
        progressBar.attr('aria-valuenow', progress);
        progressBar.html(progress + '%')
    }
}

function updateBox0(value) {
    _progress_0 = value;
    _html_newCards.innerHTML = value;
    trySetProgress();
}
function updateBox1(value) {
    _progress_1 = value;
    _html_box1.innerHTML = value;
    trySetProgress();
}
function updateBox2(value) {
    _progress_2 = value;
    _html_box2.innerHTML = value;
    trySetProgress();
}
function updateBox3(value) {
    _progress_3 = value;
    _html_box3.innerHTML = value;
    trySetProgress();
}
function updateBox4(value) {
    _progress_4 = value;
    _html_box4.innerHTML = value;
    trySetProgress();
}
function updateBox5(value) {
    _progress_5 = value;
    _html_box5.innerHTML = value;
    trySetProgress();
}

