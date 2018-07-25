function addClass(element, myClass) {
    element.className += myClass;
}

function removeClass(element, myClass) {
    var reg = new RegExp('(^| )' + myClass + '($| )', 'g');
    element.className = element.className.replace(reg, ' ');
}

//handles the view change
function changeView(elemA, elemB, myClass) {
    //vanish elemA elements
    for (x = 0; x < elemA.length; x++) {
        addClass(elemA[x], myClass);
    }
    //appear elemB elements
    for (x = 0; x <elemB.length; x++) {
        removeClass(elemB[x], myClass);
    }
}

function setSecretCard(first, second) {
    displayReveal(secret_key[decoder(first, second)]);
}

function Card(deck) {
    /* This is the Card class, which represents a 
    single card IN PLAY (imagine as held by a player, 
    or on the table. 
    It takes an optional deck argument to represent 
    from which deck the card was dealt from.*/
  
    //It has the following properties:
    this.size = (deck.size? deck.size: 52); //max index for card, deterined from deck size if associated (default=52)
    this.val = 0; //face value property, set with flip()
    this.suit = 0; //suit value property, set with flip()
    this.held = false; //indicated a card is 'held', and won't be affected by the next deal, set with hold()
    
    //And two methods to assign values to those properties
    this.flip = function() {
        var i = Math.floor(Math.random() * this.size);//generates a random value from 0 to 51 (or size of the deck)
        this.val = i % 13;//assigns the face value by dividing by 13 and returnung the remainder, 0-12
        this.suit = i % 4;//assigns the suit by dividing by 4 and returning the remainder, 0-3
        return i;//returns the cards assigned value index so the deck will know what was dealt
    };

    this.hold = function() {
        //if held, unhold
        if (this.held == true)
            this.held = false;
        //otherwise, hold
        else
            this.held = true;
    };

} 

function Deck(size) {
    /* This is the Deck object, which mostly is an 
    over-glorified array to tell a program when a card 
    is in play to prevent the same card (not a card of 
    the same value) from being dealt twice in the same hand.
    Takes an optional size argument, which can be used to
    make casino style games using more than one deck possible.
    */
  
    //Properties
    this.size = (size? size : 52);//default standard playing card deck, 52 cards less jokers, unless playing with multiple decks.
    this.dealt = new Array(this.size);//the index of dealt cards. False, card not played yet, True, card played already.
    
    //Methods
    this.shuffle = function() {
        //set all the cards to default "Not Dealt" status 
        for (i=0;i<this.size;i++) {
            this.dealt[i] = false;
        }
    };
  
    this.deal = function(x) {
        //takes the value returned by Card object's flip(), sets that card to true, to indicate it's played
        this.dealt[x] = true;
    };

}

function Hand(hand_size, deck_size) {
    /*The grand overseer of the card and deck objects, you'd call
    all the values and functions from the Hand object.
    The hand controls the size of the hand (defaults to five cards), 
    number of decks used(or more accurately number of cards in the deck), 
    starts the game by dealing unique cards to fill the hand and calling 
    the functions to set the necessary values, and controls the deal phase, 
    iterating over each card, checking if it is held, and dealing a new
    card when it finds any that are not.*/
    
    //Properties
    this.size = (hand_size? hand_size : 5);//sets the hand size, default 5
    this.deck = new Deck(deck_size);//sets the deck size, default normal 52 card deck
    this.card = new Array();//cards for this hand
    
    //Methods
    this.play = function() {
        //start each new hand by shuffling the deck
        this.deck.shuffle();
        
        //for the size of this hand, create new cards and...
        for (j=0;j<this.size;j++) {
            this.card[j] = new Card(this.deck);
        }
        
        //give each card a value
        this.deal();
    };
    
    
    this.deal = function() {
        //for each card...
        for (j=0;j<this.size;j++) {    
            var k;
            if (this.card[j].held == false) { //check if it's held...
                do {
                    k = this.card[j].flip(); // flip it if it isn't (flipping it assigns it a new value and suit)...
                } while (this.deck.dealt[k] == true) //until we find one that hasn't been dealt yet
                this.deck.deal(k);// indicate it's been dealt, so next time we don;t get the same card
            };
        }
    };
    
    this.sort = function() { //sorts cards by face value, useful for shorter checking functions which declare if a hand wins
        var test = new Array();
        for (i=0;i<this.card.length;i++){
            test[i] = this.card[i].val;
        }
        test.sort(function(a, b){return a-b});
		return test;
    };
}

var displayHand = function(hand) {
    var r = '';
    var s = '';
    var t = '';
    for (i=0;i<hand.size;i++){
        if (hand.card[i].suit % 2 == 0)
            r = 'black';
        else
            r = 'red';
        
        switch (hand.card[i].val) {
		    case 0:
			    t = ' A';
			    break;
		    case 10:
			    t = ' J';
			    break;
		    case 11:
			    t = ' Q';
			    break;
		    case 12:
			    t = ' K';
			    break;
			default:
			    t = " " + (hand.card[i].val + 1);
			    break;
	    }
        
        switch (hand.card[i].suit) {
		    case 0:
			    s = "\&spades\;";
			    break;
		    case 1:
			    s = "\&hearts\;";
			    break;
		    case 2:
			    s = "\&clubs\;";
			    break;
		    case 3:
			    s = "\&diams\;";
			    break;
	        }
           
        document.getElementById('p-card' + i).innerHTML = "<span style='color:" + r + ";'>" + t + "<br>" + s + "</span>";
    }

};

var displaySpread = function(arr, row) {
    var r = '';
    var s = '';
    var t = '';
    var _arry = arr;
    for (var i = 0; i < _arry.length; i++){
        if (_arry[i].suit % 2 == 0)
            r = 'black';
        else
            r = 'red';
        
        switch (_arry[i].val) {
		    case 0:
			    t = ' A';
			    break;
		    case 10:
			    t = ' J';
			    break;
		    case 11:
			    t = ' Q';
			    break;
		    case 12:
			    t = ' K';
			    break;
			default:
			    t = " " + (_arry[i].val + 1);
			    break;
	    }
        
        switch (_arry[i].suit) {
		    case 0:
			    s = "\&spades\;";
			    break;
		    case 1:
			    s = "\&hearts\;";
			    break;
		    case 2:
			    s = "\&clubs\;";
			    break;
		    case 3:
			    s = "\&diams\;";
			    break;
	        }
           
        document.getElementById(String(row) + '-card' + i).innerHTML = "<span style='color:" + r + ";'>" + t + "<br>" + s + "</span>";
    }

};

var displayReveal = function(mylist) {
    var r = '';
    var s = '';
    var t = '';
    var cards = [];
    for (var i = 0; i < mylist.length; i++){
        if (mylist[i].suit % 2 == 0)
            r = 'black';
        else
            r = 'red';
        
        switch (mylist[i].val) {
		    case 0:
			    t = ' A';
			    break;
		    case 10:
			    t = ' J';
			    break;
		    case 11:
			    t = ' Q';
			    break;
		    case 12:
			    t = ' K';
			    break;
			default:
			    t = " " + (mylist[i].val + 1);
			    break;
	    }
        
        switch (mylist[i].suit) {
		    case 0:
			    s = "\&spades\;";
			    break;
		    case 1:
			    s = "\&hearts\;";
			    break;
		    case 2:
			    s = "\&clubs\;";
			    break;
		    case 3:
			    s = "\&diams\;";
			    break;
	    }
           
        cards.push("<span style='color:" + r + ";'>" + t + "<br>" + s + "</span>");
        
    }
    document.getElementById("secret_card").innerHTML = "<div class=\"card-lg\" >"+ cards[0]+"</div><div class=\"card-lg\" >"+ cards[1]+"</div>";

};

function decoder(row1, row2) {
    switch (row1) {
        case 'A':
            switch (row2) {
                case 'A':
                    return 'U';
                    break;
                case 'B':
                    return 'M';
                    break;
                case 'C':
                    return 'T';
                    break;
                case 'D':
                    return 'S';
                    break;
            }
            break;
        case 'B':
            switch (row2) {
                case 'A':
                    return 'M';
                    break;
                case 'B':
                    return 'N';
                    break;
                case 'C':
                    return 'E';
                    break;
                case 'D':
                    return 'O';
                    break;
            }
            break;
        case 'C':
            switch (row2) {
                case 'A':
                    return 'T';
                    break;
                case 'B':
                    return 'E';
                    break;
                case 'C':
                    return 'D';
                    break;
                case 'D':
                    return 'I';
                    break;
            }
            break;
        case 'D':
            switch (row2) {
                case 'A':
                    return 'S';
                    break;
                case 'B':
                    return 'O';
                    break;
                case 'C':
                    return 'I';
                    break;
                case 'D':
                    return 'C';
                    break;
            }
            break;
    }
}

function onLoad() {
    var hand = new Hand(20);
    hand.play();
    displayHand(hand);

    var pairs = [];
    for (var i = 0; i < 20; i+=2) {
        var pair = [];
        pair.push(hand.card[i]);
        pair.push(hand.card[i+1]);
        pairs.push(pair);
    }

    var secret_key = {M: pairs[0], U: pairs[1], T: pairs[2], S: pairs[3],
        N: pairs[4], O: pairs[5], E: pairs[6], I: pairs[7], D: pairs[8],
        C: pairs[9]};
    
    var secret_code = [
        [secret_key.M[0], secret_key.U[0], secret_key.T[0], secret_key.U[1], secret_key.S[0]],
        [secret_key.N[0], secret_key.O[0], secret_key.M[1], secret_key.E[0], secret_key.N[1]],
        [secret_key.D[0], secret_key.E[1], secret_key.T[1], secret_key.I[0], secret_key.D[1]],
        [secret_key.C[0], secret_key.O[1], secret_key.C[1], secret_key.I[1], secret_key.S[1]]
    ]

    for (var i = 0; i < secret_code.length; i++) {
        displaySpread(secret_code[i], i);
    }

    removeClass(document.getElementById("page-0"), "hidden");

    return secret_key;
}

function goToPage1() {
    addClass(document.getElementById("page-0"), "hidden");
    removeClass(document.getElementById("page-1"), "hidden");
}

function goToPage2() {
    addClass(document.getElementById("page-1"), "hidden");
    removeClass(document.getElementById("page-2"), "hidden");
}