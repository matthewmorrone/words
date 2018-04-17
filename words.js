/*Copyright (c) 2016 The Bitmill Inc. All rights reserved.*/
var wrequest = false;

var fqpath = "https://www.litscape.com/word_tools/ajax/wordfinder.php";
//var fqpath = "/word_tools/ajax/wordfinder.php";

var searchtype = "";
var params;
var querystr;
var isname = false;
//*********************************************************************
function Display() {
    this.mode = ["1", "A", "A", "0", "0", "0", "L"];
}

Display.prototype.setView = function() {
    var node = document.getElementById("colselect");
    var vmode = node.options[node.selectedIndex].id;

    vmode = vmode.substr(1);
    if (vmode >= 0 && vmode <= 9) {
        this.mode[0] = vmode + "";
    }
    else if (vmode == "10") {
        this.mode[0] = "T";
    }
    else {
        this.mode[0] = "0";
    }
    wordlist.displayResults();
}
Display.prototype.isNoColumns = function() {
    return this.mode[0] == "0";
}
Display.prototype.isSingleColumn = function() {
    return this.mode[0] == '1';
}
Display.prototype.showLength = function() {
    return this.mode[3] == 'L';
}
Display.prototype.showScrabble = function() {
    return this.mode[4] == 'S';
}
Display.prototype.showFriends = function() {
    return this.mode[5] == 'W';
}
Display.prototype.getDisplayType = function() {
    return this.mode[0];
}
Display.prototype.getSortType = function() {
    return this.mode[1];
}
Display.prototype.getSortDirection = function() {
    return this.mode[2];
}
Display.prototype.getSortString = function() {
    return this.mode[1] + "" + this.mode[2];
}
Display.prototype.aLeft = function() {
    this.mode[6] = "L";
    displayobj.doAlign();
}
Display.prototype.aRight = function() {
    this.mode[6] = "R";
    displayobj.doAlign();
}
Display.prototype.aCenter = function() {
    this.mode[6] = "C";
    displayobj.doAlign();
}
Display.prototype.getAlign = function() {
    return this.mode[6];
}
Display.prototype.doAlign = function() {
    var wc = document.getElementsByClassName('wcol');
    if (!wc) {
        return;
    }
    var align = "left";
    if (this.mode[6] == "C") {
        align = "center";
    }
    else if (this.mode[6] == "R") {
        align = "right";
    }
    var i = wc.length;
    while (i--) {
        wc[i].style.textAlign = align;
    }
    if (displayobj.getDisplayType() == 'T') {
        document.getElementById("i" + displayobj.getAlign()).checked = true;
    }
}
Display.prototype.setSort = function(smode) {
    var usmode = smode.toUpperCase();
    switch (usmode) {
        case "AA":
        case "AD":
        case "EA":
        case "ED":
        case "LA":
        case "LD":
        case "SA":
        case "SD":
        case "WA":
        case "WD":
            this.mode[1] = usmode[0];
            this.mode[2] = usmode[1];
            break;
        default:
            this.mode[1] = 'A';
            this.mode[2] = 'A';
    }
    wordlist.displayResults();
}
Display.prototype.getLength = function() {
    return this.mode[3];
}
Display.prototype.updateLengthFlag = function() {
    var node = document.getElementById('showlength');
    this.mode[3] = (!node || !node.checked) ? '0' : 'L';
    wordlist.displayResults();
}
Display.prototype.getScrabble = function() {
    return this.mode[4];
}
Display.prototype.updateScrabbleFlag = function() {
    var node = document.getElementById('showscrabble');
    this.mode[4] = (!node || !node.checked) ? '0' : 'S';
    wordlist.displayResults();
}
Display.prototype.getFriends = function() {
    return this.mode[5];
}
Display.prototype.updateFriendsFlag = function() {
    var node = document.getElementById('showfriends');
    this.mode[5] = (!node || !node.checked) ? '0' : 'W';
    wordlist.displayResults();
}
Display.prototype.view = function() {
    alert("mode=" + this.mode[0] + this.mode[1] + this.mode[2] + this.mode[3] + this.mode[4] + this.mode[5]);
}
var displayobj = new Display();

//*********************************************************************
function Word(w, sv, wv) {
    this.w = w;
    this.sv = sv;
    this.wv = wv;
}
Word.prototype.getScrabbleString = function() {
    return this.w + " <span class=\"scrabble\">(" + this.sv + ")</span>";
}
Word.prototype.getAllString = function() {
    var wstr = this.w;
    if (!displayobj.showLength() && !displayobj.showScrabble() && !displayobj.showFriends()) {
        return wstr;
    }
    wstr += " (";
    if (displayobj.showLength()) {
        wstr += "<span class='wl'>" + (this.w.length < 10 ? ("&#160;" + this.w.length) : this.w.length) + "</span>,";
    }


    if (displayobj.showScrabble()) {
        wstr += "<span class='sv'>" + (this.sv < 10 ? ("&#160;" + this.sv) : this.sv) + "</span>,";
    }
    if (displayobj.showFriends()) {
        wstr += "<span class='fv'>" + (this.wv < 10 ? ("&#160;" + this.wv) : this.wv) + "</span>,";
    }
    wstr += ")";
    return wstr.replace(/,\)/g, ")");
}
Word.prototype.getTableHeader = function() {
    var wstr = "<tr><td class='wcol'>Word<br /><button class='' onclick='displayobj.aLeft();'>[</button>";
    wstr += "<button class='' onclick='displayobj.aCenter();'>|</button>";
    wstr += "<button class='' onclick='displayobj.aRight();'>]</button>";
    wstr += "</td>";
    if (displayobj.showLength()) {
        wstr += "<td class='wl'>Word Length</td>";
    }

    if (displayobj.showScrabble()) {
        wstr += "<td class='sv'>Scrabble Value</td>";
    }
    if (displayobj.showFriends()) {
        wstr += "<td class='fv'>Words with Friends Value</td>";
    }
    wstr += "</tr>";
    return wstr;
}
Word.prototype.getTableRow = function() {
    var wstr = "<tr><td class='wcol'>" + this.w + "</td>";
    if (displayobj.showLength()) {
    	wstr += "<td class='wl'>" + this.w.length + "</td>";
    }
    if (displayobj.showScrabble()) {
    	wstr += "<td class='sv'>" + this.sv + "</td>";
    }
    if (displayobj.showFriends()) {
    	wstr += "<td class='fv'>" + this.wv + "</td>";
    }
    wstr += "</tr>";
    return wstr;
}
Word.prototype.reverseWord = function() {
    if (this.w === null || this.w == "") {
        return;
    }
    var rstr = "";
    for (i = this.w.length - 1; i >= 0; i--) {
        rstr += this.w[i];
    }
    this.w = rstr;
}

function stringcmp(worda, wordb) {
    if (worda.w < wordb.w) {
        return -1;
    }
    if (worda.w > wordb.w) {
        return 1;
    }
    return 0;
}

function revstringcmp(worda, wordb) {
    if (worda.w > wordb.w) {
        return -1;
    }
    if (worda.w < wordb.w) {
        return 1;
    }
    return 0;
}

function lengthcmp(worda, wordb) {
    if (worda.w.length < wordb.w.length) {
        return -1;
    }
    if (worda.w.length > wordb.w.length) {
        return 1;
    }
    return stringcmp(worda, wordb);
}

function revlengthcmp(worda, wordb) {
    if (worda.w.length > wordb.w.length) {
        return -1;
    }
    if (worda.w.length < wordb.w.length) {
        return 1;
    }
    return revstringcmp(worda, wordb);
}

function scrabblecmp(worda, wordb) {
    if (worda.sv == 0) {
        return 1;
    }
    if (wordb.sv == 0) {
        return -1;
    }
    if (worda.sv == 0 && wordb.sv == 0) {
        return stringcmp(wordb.w, worda.w);
    }
    if (worda.sv < wordb.sv) {
        return -1;
    }
    if (worda.sv > wordb.sv) {
        return 1;
    }
    return stringcmp(wordb.w, worda.w);
}

function revscrabblecmp(worda, wordb) {
    if (worda.sv > wordb.sv) {
        return -1;
    }
    if (worda.sv < wordb.sv) {
        return 1;
    }
    return revstringcmp(wordb, worda);
}

function friendscmp(worda, wordb) {
    if (worda.wv == 0) {
        return 1;
    }
    if (wordb.wv == 0) {
        return -1;
    }
    if (worda.wv == 0 && wordb.wv == 0) {
        return stringcmp(wordb.w, worda.w);
    }
    if (worda.wv < wordb.wv) {
        return -1;
    }
    if (worda.wv > wordb.wv) {
        return 1;
    }
    return stringcmp(worda, wordb);
}

function revfriendscmp(worda, wordb) {
    if (worda.wv > wordb.wv) {
        return -1;
    }
    if (worda.wv < wordb.wv) {
        return 1;
    }
    return revstringcmp(wordb, worda);
}


//*********************************************************************

function WordList() {
    this.wordarray = new Array();
}
WordList.prototype.clearWords = function() {
    this.wordarray = new Array();
}
WordList.prototype.addWord = function(wl) {
    var newword = new Word(wl.w, wl.s, wl.f);
    this.wordarray.push(newword);
}
WordList.prototype.view = function() {
    alert("In View: count=" + this.wordarray.length);
}
WordList.prototype.displaySingleLine = function() {
    var wordstr = "<table id=\'coltable\'><tr><td class=\'wcol\' style=\'width:100%;white-space:normal;\'>";
    var l = this.wordarray.length - 1;
    for (var i in this.wordarray) {
        wordstr += this.wordarray[i].getAllString();
        if (i < l) {
            wordstr += ", ";
        }
    }
    wordstr += "</td></tr></table>";
    (document.getElementById("wordlistdisplay")).innerHTML = wordstr;
}

WordList.prototype.displayColumns = function(cc) {
    var l = this.wordarray.length;
    var cwidth = 100 / cc;
    var extra = l % cc;
    var i = 0;
    var wordstr = "<table id='coltable'><tr>";
    for (var col = 0; col < cc; col++) {
        var wpc = Math.floor(l * 1.0 / cc);
        if (extra != 0) {
            wpc++;
            extra--;
        }
        wordstr += "<td class=\'wcol\' style=\'width:" + cwidth + "%;\'>";
        while (wpc != 0) {
            wordstr += this.wordarray[i].getAllString() + "<br />";
            wpc--;
            i++;
        }
        wordstr += "</td>";
    }
    wordstr += "</tr></table>";
    (document.getElementById("wordlistdisplay")).innerHTML = wordstr;


}

WordList.prototype.displayTable = function() {
    var wordstr = "<table class='wordlisttable'>" + this.wordarray[0].getTableHeader();
    for (var i in this.wordarray) {
    	wordstr += this.wordarray[i].getTableRow();
    }
    wordstr += "</table>";
    (document.getElementById("wordlistdisplay")).innerHTML = wordstr;
}

WordList.prototype.displayResults = function() {
    wordlist.sortWords();
    switch (displayobj.getDisplayType()) {
        case "0":
            wordlist.displaySingleLine();
            break;
        case "1":
            wordlist.displayColumns(1);
            break;
        case "2":
            wordlist.displayColumns(2);
            break;
        case "3":
            wordlist.displayColumns(3);
            break;
        case "4":
            wordlist.displayColumns(4);
            break;
        case "5":
            wordlist.displayColumns(5);
            break;
        case "6":
            wordlist.displayColumns(6);
            break;
        case "7":
            wordlist.displayColumns(7);
            break;
        case "8":
            wordlist.displayColumns(8);
            break;
        case "9":
            wordlist.displayColumns(9);
            break;
        case "T":
            wordlist.displayTable();
            break;
        default:
            alert("invalid display option");
    }
    displayobj.doAlign();
    var node = document.getElementById("i" + displayobj.getDisplayType());
    if (node != null) {
    	node.selected = "selected";
    }

    (document.getElementById("i" + displayobj.getAlign())).checked = true;
    (document.getElementById("showlength")).checked = (displayobj.getLength() == "L" ? true : false);

    if (isname == false) {
        (document.getElementById("showscrabble")).checked = (displayobj.getScrabble() == "S" ? true : false);
        (document.getElementById("showfriends")).checked = (displayobj.getFriends() == "W" ? true : false);
    }
    (document.getElementById(displayobj.getSortString())).checked = true;
}

WordList.prototype.sortWords = function() {
    if (this.wordarray === null) {
        return;
    }
    var sortstr = displayobj.getSortString();
    switch (sortstr) {
        case "AA":
            this.wordarray.sort(stringcmp);
            break;
        case "AD":
            this.wordarray.sort(revstringcmp);
            break;
        case "EA":
            wordlist.reverseWordsInArray();
            this.wordarray.sort(stringcmp);
            wordlist.reverseWordsInArray();
            break;
        case "ED":
            wordlist.reverseWordsInArray();
            this.wordarray.sort(revstringcmp);
            wordlist.reverseWordsInArray();
            break;
        case "LA":
            this.wordarray.sort(lengthcmp);
            break;
        case "LD":
            this.wordarray.sort(revlengthcmp);
            break;
        case "SA":
            this.wordarray.sort(scrabblecmp);
            break;
        case "SD":
            this.wordarray.sort(revscrabblecmp);
            break;
        case "WA":
            this.wordarray.sort(friendscmp);
            break;
        case "WD":
            this.wordarray.sort(revfriendscmp);
            break;
    }
}
WordList.prototype.reverseList = function() {
    if (!wordarray) {
        return;
    }
    this.wordarray.reverse();
    displayWordList();
}
WordList.prototype.reverseWordsInArray = function() {
    for (var j in this.wordarray) {
        this.wordarray[j].reverseWord();
    }
}

var wordlist = new WordList();

//*********************************************************************


var flextext = "";

function captureFlextext() {
    if (flextext == "") {
        var node1 = document.getElementById("textcontent1");
        if (node1 != null) {
            flextext = node1.innerHTML;
        }
    }
}

function shiftFlextextUp() {
    var node1 = document.getElementById("textcontent1");
    var node2 = document.getElementById("textcontent2");
    if (node2 != null) {
        node2.style.display = "none";
        node2.innerHTML = "&#160";
    }
    if (node1 != null) {
        node1.innerHTML = flextext;
        node1.style.display = "block";
    }
}

function shiftFlextextDown() {
    var node1 = document.getElementById("textcontent1");
    var node2 = document.getElementById("textcontent2");
    if (node1 != null) {
        node1.style.display = "none";
        node1.innerHTML = "&#160";
    }
    if (node2 != null) {
        node2.innerHTML = flextext;
        node2.style.display = "block";
    }
}

function getFormatButtons() {
    var fbstr = "<div class='controlsdiv'><div class='controls'>Columns<br /><select id='colselect' onchange='displayobj.setView()'><option id='i1' selected='selected'>1</option><option id='i2'>2</option><option id='i3'>3</option><option id='i4'>4</option><option id='i5'>5</option><option id='i6'>6</option><option id='i7'>7</option><option id='i8'>8</option><option id='i9'>9</option><option id='i10'>Table</option><option id='i0'>None</option></select></div>";
    fbstr += "<div class='controls'>Align<br /><input id='iL' name='a' onclick='displayobj.aLeft();' type='radio' checked='checked'><label for='iL'>L</label><input id='iC' class='sortrb' name='a' onclick='displayobj.aCenter();' type='radio'><label for='iC'>C</label><input id='iR' class='sortrb' name='a' onclick='displayobj.aRight();' type='radio'><label for='iR'>R</label></div>";
    fbstr += "<div class='controls'>Alphabetical<br />(word start)<br /><input id='AA' name='s' onclick='displayobj.setSort(\"AA\")' type='radio'><label for='AA'>&#8593;</label><input id='AD' name='s' onclick='displayobj.setSort(\"AD\")' type='radio'><label for='AD'>&#8595;</label></div>";
    fbstr += "<div class='controls'>Alphabetical<br />(word end)<br /><input id='EA' name='s' onclick='displayobj.setSort(\"EA\")' type='radio'><label for='EA'>&#8593;</label><input id='ED' name='s' onclick='displayobj.setSort(\"ED\")' type='radio'><label for='ED'>&#8595;</label></div>";
    fbstr += "<div class='controls'><span class='wl'>Length</span><br /><input id='showlength' type='checkbox' onclick='displayobj.updateLengthFlag();'>Display<br /><input id='LA' name='s' onclick='displayobj.setSort(\"LA\")' type='radio'><label for='LA'>&#8593;</label><input id='LD' name='s' onclick='displayobj.setSort(\"LD\")' type='radio'><label for='LD'>&#8595;</label></div>";
    if (isname == false) {
        fbstr += "<div class='controls'><span class='sv'>Scrabble&#174;&#160;*</span><br /><input id='showscrabble' type='checkbox' onclick='displayobj.updateScrabbleFlag();'>Display<br /><input id='SA' name='s' onclick='displayobj.setSort(\"SA\")' type='radio'><label for='SA'>&#8593;</label><input id='SD' name='s' onclick='displayobj.setSort(\"SD\")' type='radio'><label for='SD'>&#8595;</label></div>";
        fbstr += "<div class='controls'><span class='fv'>Words&#160;With Friends&#8482;&#160;*</span><br /><input id='showfriends' type='checkbox' onclick='displayobj.updateFriendsFlag();'>Display<br /><input id='WA' name='s' onclick='displayobj.setSort(\"WA\")' type='radio'><label for='WA'>&#8593;</label><input id='WD' name='s' onclick='displayobj.setSort(\"WD\")' type='radio'><label for='WD'>&#8595;</label></div>";
    }
    fbstr += "<div class='clearleft'>&#160;</div></div>";

    var node = document.getElementById("fdbuttondiv");
    node.innerHTML = fbstr;
}

function hideFormatButtons() {
    var node = document.getElementById("fdbuttondiv");
    node.innerHTML = "";
}


//*********************************************************************
function dosearch() {
    captureFlextext();
    hideSearchResult();
    if (!wrequest) {
        searchtype = (document.getElementById("sform")).attributes["class"].value;

        var retval = getParameters();

        if (!retval) {
            return false;
        }
        setStatusMessage("<h1>Processing request ...</h1>");
        (document.getElementById("findwords")).disabled = "disabled";

        var node = document.getElementById("dicname");
        if (node != null) {
            var nstr = node.innerHTML;
            //alert(nstr);
            isname = (nstr.indexOf("Name") != -1);
            //if(isname) alert("isname true");
            //else alert("isname false");
        }

        querystr = getQueryString();
        //alert(querystr);

        wreq();
    }
    return false; //Important: dont touch this return value;
}

function wreq() {
    if (wrequest.abort) wrequest.abort();
    try {
        wrequest = new XMLHttpRequest();
    }
    catch (ms1) {
        try {
            wrequest = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (ms2) {
            try {
                wrequest = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e) {
                alert("wordsearch.js:" + e.toString());
                wrequest = false;
                return;
            }
        }
    }
    setStatusMessage("Processing request ...");
    wrequest.open("GET", fqpath + "?" + querystr.toLowerCase());
    wrequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    wrequest.onreadystatechange = wcallback;
    wrequest.send(null);
}

function wcallback() {
    if (wrequest === false) return;
    //alert("readystate"+wrequest.readyState);
    if (wrequest.readyState == 4) { //alert("wrequest.status"+wrequest.status);
        if (wrequest.status == 200) {
            try {
                if (wrequest.responseText) { //alert(wrequest.responseText);
                    outputWordResults(wrequest.responseText);
                }
            }
            catch (e) {
                wrequest.onreadystatechange = function() {};
                if (wrequest.abort) {
                    wrequest.abort();
                }
                alert("wrequest Failed");
                hideSearchResult();
                shiftFlextextUp();
            }
            wrequest.abort();
            wrequest = false;
            (document.getElementById("findwords")).disabled = false;
        }
    }
}

function outputWordResults(jsonstr) {
    //alert(jsonstr);
    var validjson = !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(jsonstr.replace(/"(\\.|[^"\\])*"/g, '')));
    if (!validjson) {
        alert("Security Violation");
        resetWF();
        return;
    }
    var obj = eval('(' + jsonstr + ')');
    if (obj.status == "autherror") {
        setStatusMessage("Unable to do search. Reload the page and try again.");
        if (window.location.hostname == "www.litscape.com") {
            window.location.reload(true);
        }
        else if (window.location.hostname == "litscape") {
            window.location.reload(true);
        }
        else {
            window.location.replace("https://www.litscape.com/word_tools/word_search.html");
        }
    }
    else if (obj.status == "busyerror") {
        alert("Server busy. Try again.");
        setStatusMessage("Server busy. Try again.");
        hideSearchResult();
        shiftFlextextUp();
    }
    else if (obj.status == "success") {
        if (obj.search.searchtype == "submitword") {

            var node = document.getElementById("searchresult");
            if (node) {
                node.innerHTML = "<p>" + obj.statusmessage + "</p>";
                node.style.display = "block";
                setStatusMessage("");
            }
            return;
        }
        var wordcount = obj.resultset.wordlist.length;
        var message = obj.resultset.message;
        if (wordcount == 0) {
            if (isname) {
            	setStatusMessage("No names found.");
            }
            else {
            	setStatusMessage("No words found.");
            }

            hideSearchResult();
            shiftFlextextUp();
        }
        else {
            if (isname) {
            	setStatusMessage(wordcount + (wordcount == 1 ? " name" : " names") + " found.<br />See results below.");
            }
            else {
            	setStatusMessage(wordcount + (wordcount == 1 ? " word" : " words") + " found.<br />See results below.");
            }

            wordlist.clearWords();
            for (var i in obj.resultset.wordlist) {
                wordlist.addWord(obj.resultset.wordlist[i]);
            }

            getFormatButtons();

            var sr = document.getElementById("searchresult");
            sr.innerHTML = "<div id='wordlistdisplay'></div>";
            sr.style.display = "block";
            wordlist.displayResults();

            shiftFlextextDown();

            if (isname == false) {
                var node = document.getElementById("explanation");
                if (node) {
                    node.innerHTML = "<p>* Note that the score of a word in these games depends not only what letters you play but also where you play them. The values presented here are just the letter sums. How a word plays relative to previously played words and the value squares that you hit affect the resulting score. To find out the best places to play a word on the board for maximum score, try our latest <a href=\"/word_analysis/\">Word Analysis Tool</a>. It gives definitions, word growth patterns (how do you get there and where can you go by extending words), sequences, all words within and without (+1 letter, +2 letters), and best plays, all from one fast and convenient interface, at your fingertips. In best plays, it calculates and displays the score of words at all possible positions on the board, allowing you to determine your optimal play, by score, position, and/or by length, for both the word and words within the word. The best plays are determined for both Scrabble and Words With Friends.</p><p>A score of 0 indicates that the word is not playable in these games. The word may be too long to fit on the board, or the frequency of letters, blanks included, will not allow it. <strong>Note that these tools only give you words that match the search criteria. You still need to apply you own judgment on whether it is legal to play them according to the rules of each game, in terms of proper nouns, compound words, etc.</strong></p>";
                }
            }
        }
    }
    else if (obj.status == "error") {
        alert("Error: " + obj.statusmessage);
        resetWF();
    }
}

function getQueryString() {
    var auth = "c2428b6a57e0";
    var qstr = "";
    for (var key in params) {
        qstr += (key + "=" + params[key] + "&");
    }
    qstr += ("auth=" + auth);
    return qstr;
}

function getParameters() {
    params = new Array();

    var node = document.getElementById("dicname");
    var dicstr = node.innerHTML;

    if (dicstr.indexOf("Mammoth") != -1) {
        if (dicstr.indexOf("Uncensored") != -1) {
            params["dic"] = "mammothuncensored";
        }
        else {
            params["dic"] = "mammothcensored";
        }
    }
    else if (dicstr.indexOf("Enable") != -1) {
        if (dicstr.indexOf("Uncensored") != -1) {
            params["dic"] = "enableuncensored";
        }
        else {
            params["dic"] = "enablecensored";
        }
    }
    else if (dicstr.indexOf("Scrabble") != -1) {
        if (dicstr.indexOf("Uncensored") != -1) {
            params["dic"] = "scrabbleuncensored";
        }
        else {
            params["dic"] = "scrabblecensored";
        }
    }
    else if (dicstr.indexOf("Name") != -1) {
        params["dic"] = "names";
    }
    else if (dicstr.indexOf("Default") != -1) {
        params["dic"] = "default";
    }
    else {
        params["dic"] = "notset";
    }

    params["searchtype"] = searchtype;
    switch (searchtype) {
        case "startswith":
        case "endswith":
        case "containssequence":
        case "containsminimally":
        case "containsonly":
        case "containsonlywc":
        case "containsonlywcwc":
        case "wordsmadefrom":
        case "scrambo":
        case "soundex":
        case "metaphone":
            node = document.getElementById("str");
            node.value = node.value.replace(/[^a-zA-Z]/g, "").substring(0, 30).toLowerCase();
            if (node.value == "") {
                alert("You need to enter a value.");
                node.focus();
                return false;
            }
            params["str"] = node.value;
            getLengthParameters();

            break;

        case "submitword":
            node = document.getElementById("str");
            node.value = node.value.replace(/[^a-zA-Z]/g, "").substring(0, 30).toLowerCase();
            if (node.value == "") {
                alert("You need to enter a value.");
                node.focus();
                return false;
            }
            params["str"] = node.value;
            if (document.getElementById("addword").checked) {
                params["reason"] = "addword";
            }
            else if (document.getElementById("inappropriateword").checked) {
                params["reason"] = "inappropriateword";
            }
            else if (document.getElementById("notaword").checked) {
                params["reason"] = "notaword";
            }
            break;

        case "patternmatch":
            node = document.getElementById("str");
            node.value = (node.value.replace(/[^a-zA-Z*?]/g, ""));
            node.value = node.value.replace(/\*{2,}/g, "*").substring(0, 30).toLowerCase();

            if (node.value == "") {
                alert("You need to enter a value.");
                node.focus();
                return false;
            }
            if (node.value == "*") {
                alert("You need to be more specific.");
                node.focus();
                return false;
            }

            str = node.value.replace(/\?/g, "%3F");
            params["str"] = str.replace(/\*/g, "%2A");
            getLengthParameters();
            break;

        case "anagram":
            node = document.getElementById("str");
            node.value = node.value.replace(/[^a-zA-Z]/g, "").substring(0, 30).toLowerCase();
            if (node.value == "") {
                alert("You need to enter a value.");
                node.focus();
                return false;
            }
            params["str"] = node.value;
            params["lentype"] = "fixedlen";
            params["num1"] = (trim(node.value)).length;
            break;

        default:
            break;
    }
    return true;
}

function resetWF() {
    if (wrequest !== false) {
        wrequest.onreadystatechange = function() {};
        wrequest.abort();
        wrequest = false;
    }

    thisfile = "" + window.self.parent.location;
    if (thisfile.indexOf("suggest_a_word.php") != -1) {
        setStatusMessage("&#160;");
    }
    else {
        setStatusMessage("Do a word finder search.<br />Results will display below.");
        shiftFlextextUp();
    }

    (document.getElementById("findwords")).disabled = false;
    hideFormatButtons();
    hideSearchResult();

    var node = document.getElementById("explanation");
    if (node) {
        node.innerHTML = "&#160;";
    }

    node = (document.getElementById("anylen"));
    if (node) {
        node.checked = "checked";
    }
    adjustLengthInputs();
    node = document.getElementById("str");
    if (node) {
        node.value = "";
        node.focus();
    }

    return false;
}

function getLengthType() {
    var node = document.getElementById("anylen");
    if (!node) {
        return null;
    }
    if (node.checked) {
        return "anylen";
    }
    else if ((document.getElementById("fixedlen")).checked) {
        return "fixedlen";
    }
    else if ((document.getElementById("rangelen")).checked) {
        return "rangelen";
    }
    return null;
}

function adjustLengthInputs() {
    var longestword = 52;
    var node = document.getElementById("dicname");
    var dicstr = node.innerHTML;
    if (dicstr.indexOf("Enable") != -1) {
        longestword = 28;
    }

    var str = "";
    switch (getLengthType()) {
        case "anylen":
            str = "";
            break;
        case "fixedlen":
            str = getSelectBox("num1", 1, longestword, 6) + " letters";
            break;
        case "rangelen":
            str = getSelectBox("num1", 1, longestword, 3);
            str += " to " + getSelectBox("num2", 1, longestword, 15) + " letters";
            break;
        default:
            return;
    }
    node = document.getElementById("lengthinputs");
    node.innerHTML = str;
    return;
}

function getSelectedValue(selid) {
    var node = document.getElementById(selid);
    return node.options[node.selectedIndex].value;
}

function getLengthParameters() {
    switch (getLengthType()) {
        case "anylen":
            params["lentype"] = "anylen";
            break;
        case "fixedlen":
            params["lentype"] = "fixedlen";
            params["num1"] = getSelectedValue("num1");
            break;
        case "rangelen":
            params["lentype"] = "rangelen";
            params["num1"] = getSelectedValue("num1");
            params["num2"] = getSelectedValue("num2");
            break;
        default:
            break;
    }
}

function getSelectBox(id, low, high, def) {
    var str = "<select id='" + id + "'>";
    for (var i = low; i <= high; i++) {
        if (i == def) {
            str += ("<option value='" + i + "' selected='selected'>" + i + "</option>");
        }
        else {
            str += "<option value='" + i + "'>" + i + "</option>";
        }
    }
    str += "</select>";
    return str;
}

function trim(str) {
    var t = new String(str);
    return t.replace(/^[ \t\n]+|[ \t\n]+$/g, "");
}

function testalpha(e) {
    var chascii;
    if (window.event) {
        chascii = e.keyCode;
    }
    else if (e.which) {
        chascii = e.which;
    }
    if (((document.getElementById("str")).value).length >= 30) {
        return !(chascii >= 32 && chascii <= 126);
    }
    if ((chascii >= 65 && chascii <= 90) || (chascii >= 97 && chascii <= 122)) {
        return true;
    }
    return !(chascii >= 32 && chascii <= 126);
}

function testalphapattern(e) {
    var chascii;
    if (window.event) {
        chascii = e.keyCode;
    }
    else if (e.which) {
        chascii = e.which;
    }
    if (((document.getElementById("str")).value).length >= 30) {
        return !(chascii >= 32 && chascii <= 126);
    }
    if (chascii == 63) {
        return true;
    }
    if (chascii == 42) {
        return ((document.getElementById("str")).value.slice(-1) != "*");
    }
    if ((chascii >= 65 && chascii <= 90) || (chascii >= 97 && chascii <= 122)) {
        return true;
    }
    return !(chascii >= 32 && chascii <= 126);
}








function restoreDisplayState() {
    displayobj.doAlign();
}



function hideSearchResult() {
    var sr = document.getElementById("searchresult");
    if (sr) {
        sr.style.display = "none";
    }

}

function setStatusMessage(msgstr) {
    var node = document.getElementById("statusdiv");
    if (!node) {
        return;
    }
    node.innerHTML = msgstr;
}

function doWordAnalysis() {
    var node = document.getElementById("wastr");
    if (!node) {
        return;
    }
    node.value = node.value.replace(/[^a-zA-Z]/g, "").substring(0, 30).toLowerCase();
    window.location.assign("/wordanalysis/" + node.value);
}

//Used by the menus:
function clearCheckBoxes() {
    (document.getElementById("drop-wordtools")).checked = false;
    (document.getElementById("drop-literature")).checked = false;
    (document.getElementById("drop-about")).checked = false;
    (document.getElementById("hamburger")).checked = false;
    return false;
}

function adjustCheckBoxes(me) {
    if (me != "tools") {
        (document.getElementById("drop-wordtools")).checked = false;
    }
    if (me != "literature") {
        (document.getElementById("drop-literature")).checked = false;
    }
    if (me != "about") {
        (document.getElementById("drop-about")).checked = false;
    }
    return false;
}