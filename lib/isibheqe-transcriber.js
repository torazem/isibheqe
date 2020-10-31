var Transcriber = function(mappings) {
    this.bases = mappings["bases"];
    this.modifiers = mappings["modifiers"];
}

Transcriber.prototype.convert = function(text) {
	this.cursor = new Point(0, 0);
	this.buffer = new Array();
	this.currentVowel = undefined;
	this.sentence = new Array();
}

Transcriber.prototype.tokenize = function(phrase) {
    tokens = [];
    current_token = "";
    for (var i = 0; i < phrase.length; i++) {
        var letter = phrase[i];
        if(letter == " " || letter == "\n") {
            tokens.push(current_token);
            tokens.push(letter);
            current_token = ""
            continue;
        }

        current_token += letter;
        isBaseFound = Object.keys(this.bases).some((b) => {return current_token.endsWith(b)});
        if (isBaseFound) {
            tokens.push(current_token);
            current_token = "";
        }
    }

    return tokens;
}

Transcriber.prototype.transcribeToken = function(token) {
    if(token == " ") {
        return "space";
    }
    if(token == "\n") {
        return "enter";
    }
    var isSyllabicConstonant = (token[token.length - 1] == "'");
    if(isSyllabicConstonant) {
        return [this.bases[token]];
    }

    var tokenSuffix = token[token.length - 1];
    token = token.slice(0, token.length - 1);
    var mapped = [this.bases[tokenSuffix]]

    mapped.push(this.modifiers[token]);
    return mapped;
}
