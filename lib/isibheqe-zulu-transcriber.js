var ZuluTranscriber = function(bases, modifiers) {
    this.bases = bases;
    this.modifiers = modifiers;
}

ZuluTranscriber.prototype.convert = function(text) {
	this.cursor = new Point(0, 0);
	this.buffer = new Array();
	this.currentVowel = undefined;
	this.sentence = new Array();
}

ZuluTranscriber.prototype.tokenize = function(phrase) {
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
        if (letter in this.bases) {
            tokens.push(current_token);
            current_token = "";
        }
    }

    return tokens;
}

ZuluTranscriber.prototype.transcribeToken = function(token) {
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

    if(token[token.length - 1] == "w") {
        token = token.slice(0, token.length - 1)
        mapped.push(this.modifiers["w"]);
    }

    if(token[0] in ["m", "n"]) {
        var c = token[0];
        token = token.slice(1, token.length);
        mapped.push(this.modifiers[c]);
    }

    mapped.push(this.modifiers[token]);
    return mapped;
}
