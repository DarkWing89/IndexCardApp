var _dbName = "IndexCardDB";
var _dbVersion = 1;
let db = null;

function indb_Init(cards){
    const request = window.indexedDB.open(_dbName, _dbVersion);

    request.onupgradeneeded = e => {
        db = e.target.result;
        db.createObjectStore("Cards",{keyPath: "Id"}) 
    }

    request.onsuccess = e => {
        db = e.target.result;
        const tx = db.transaction("Cards", "readwrite");
        const cardsTable = tx.objectStore("Cards")
        for(let currentcard of cards){
            cardsTable.add(currentcard)
        }
    }    
        
}


