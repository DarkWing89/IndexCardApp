var _db;

function webdb_OnSuccess() { }

function webdb_OnError(e, r) {
    alert("An error occurred while using webdb.\nCode: " + r.code + "\nMessage: " + r.message)
}

async function webdb_Init(cards) {
    _db = window.openDatabase('indexCards', '1.0', 'indexCards', 65535);
    await _db.transaction(function (transaction) {
        let sql = 'CREATE TABLE Cards ' +
            '(Id INTEGER NOT NULL PRIMARY KEY, ' +
            'Front_Head VARCHAR(100), ' +
            'Front_Body VARCHAR(5000), ' +
            'Back_Head VARCHAR(100), ' +
            'Back_Body VARCHAR(5000), ' +
            'Box INTEGER, ' +
            'BoxSeq INTEGER)';
        transaction.executeSql(sql);
    });

    await _db.transaction(function (transaction) {
        let sql = 'DELETE FROM Cards';
        transaction.executeSql(sql);
    });

    for (let c of cards) {
        await _db.transaction(function (tx) {
            let insertsql = 'INSERT INTO Cards (Id, Front_Head, Front_Body, Back_Head, Back_Body, Box, BoxSeq) VALUES (?, ?, ?, ?, ?, ?, ?)';
            tx.executeSql(insertsql,
                [c.Id, c.Front_Head, c.Front_Body, c.Back_Head, c.Back_Body, c.Box, c.BoxSeq],
                webdb_OnSuccess,
                webdb_OnError
            );
        });
    }

}

function webdb_UpdateBoxCount(number, updateCallback) {
    _db.transaction(function (transaction) {
        var sql = 'SELECT Count(*) AS Count FROM Cards WHERE Box=?'
        transaction.executeSql(sql, [number],
            function (tx, results) {
                updateCallback(results.rows.item(0).Count);
            },
            webdb_OnError);
    });
}

async function webdb_ScanBoxForNewCard(number, updateCallback) {
    var result;
    _db.transaction(function (transaction) {
        var sql = 'SELECT Count(*) AS Count FROM Cards WHERE Box=?'
        transaction.executeSql(sql, [number],
            function (tx, results) {
                updateCallback(number, results.rows.item(0).Count);
            },
            webdb_OnError);
    });
    return result;
}

async function webdb_SelectNextCardFromBox(number) {
    _db.transaction(function (transaction) {
        var sql;
        if (number == 0 || number == 5) {
            sql = 'SELECT * FROM Cards WHERE Box=?'
        } else {
            sql = 'SELECT * FROM Cards WHERE Box=? ORDER BY BoxSeq ASC LIMIT 1'
        }
        transaction.executeSql(sql, [number],
            function (tx, results) {
                var card = results.rows.item(0);
                if (results.rows.length > 1) {
                    card = results.rows.item(getRandomInt((results.rows.length - 1)));
                }
                _currentCard = new Card(card.Id, card.Front_Head, card.Front_Body, card.Back_Head, card.Back_Body, card.Box, card.BoxSeq);
                if (card.Box == 0) {
                    $('#Question_Headline').html("Frage (Neu)");
                    $('#Answer_Headline').html("Antwort (Neu)");
                } else {
                    $('#Question_Headline').html("Frage (Box " + card.Box + ")");
                    $('#Answer_Headline').html("Antwort (Box " + card.Box + ")");
                }
                $('#Front_Head').html(card.Front_Head);
                $('#Front_Body').html(card.Front_Body);
                $('#Back_Head').html(card.Back_Head);
                $('#Back_Body').html(card.Back_Body);
            },
            webdb_OnError);
    });
}

async function webdb_CardWrong(card) {
    _db.transaction(function (transaction) {
        var sql = 'SELECT BoxSeq FROM Cards WHERE Box=? ORDER BY BoxSeq DESC LIMIT 1'
        transaction.executeSql(sql, [1],
            function (tx, results) {
                var seq = 0;
                if (results.rows.length > 0) {
                    seq = results.rows.item(0).BoxSeq + 1;
                }
                webdb_CardWrong_Callback(card, seq)
            },
            webdb_OnError);
    });
}

function webdb_CardWrong_Callback(card, newseq) {
    _db.transaction(function (transaction) {
        var sql = 'UPDATE Cards SET Box = ?, BoxSeq = ? WHERE Id=?'
        transaction.executeSql(sql, [1, newseq, card.Id],
            function (tx, results) {
                webdb_CardMovedOutOfBox_Callback(card.Box);
            },
            webdb_OnError);
    });
}

function webdb_CardMovedOutOfBox_Callback(box) {
    if (box == 0) {
        selectNewCard();
    }
    else {
        _db.transaction(function (transaction) {
            var sql = 'UPDATE Cards SET BoxSeq = BoxSeq-1 WHERE Box=?'
            transaction.executeSql(sql, [box],
                function (tx, results) {
                    selectNewCard();
                },
                webdb_OnError);
        });
    }
}

async function webdb_CardCorrect(card) {
    if (card.Box == 5) {
        webdb_SelectNextCardFromBox(5);
    } else {
        _db.transaction(function (transaction) {
            var sql = 'SELECT BoxSeq FROM Cards WHERE Box=? ORDER BY BoxSeq DESC LIMIT 1'
            transaction.executeSql(sql, [card.Box + 1],
                function (tx, results) {
                    var seq = 0;
                    if (results.rows.length > 0) {
                        seq = results.rows.item(0).BoxSeq + 1;
                    }
                    webdb_CardCorrect_Callback(card, seq);
                },
                webdb_OnError);
        });
    }
}

function webdb_CardCorrect_Callback(card, newseq) {
    _db.transaction(function (transaction) {
        var sql = 'UPDATE Cards SET Box = ?, BoxSeq = ? WHERE Id=?'
        transaction.executeSql(sql, [card.Box + 1, newseq, card.Id],
            function (tx, results) {
                webdb_CardMovedOutOfBox_Callback(card.Box);
            },
            webdb_OnError);
    });
}

function webdb_SaveInFile() {
    _db.transaction(function (transaction) {
        var sql = 'SELECT * FROM Cards'
        transaction.executeSql(sql, undefined,
            function (tx, results) {
                var cards = [];
                for (i = 0; i < results.rows.length; i++) {
                    var c = results.rows.item(i);
                    cards.push(new Card(c.Id, c.Front_Head, c.Front_Body, c.Back_Head, c.Back_Body, c.Box, c.BoxSeq));
                }
                var json = JSON.stringify(cards);
                webdb_SaveInFileCallback(json)
            },
            webdb_OnError);
    });
}

async function webdb_SaveInFileCallback(jsonstring) {
    const opts = {
        types: [{
            description: 'Json File',
            accept: { 'application/json': ['.json'] }
        }],
        excludeAcceptAllOption: true,
        multiple: false
    };
    fileHandle = await window.showSaveFilePicker(opts);
    let stream = await fileHandle.createWritable()
    await stream.write(jsonstring);
    await stream.close();
}