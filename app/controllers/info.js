var terms = require("/legals/terms").terms;

function linkDsp(){
	Ti.Platform.openURL("http://www.directsp.com");
}

function linkLeon(){
	Ti.Platform.openURL("http://www.leonarts.it");
}

function linkTf(){
	Ti.Platform.openURL("http://thinkflamingo.weebly.com");
}

this.open = function() {
	$.info.opacity = 1;
};

for(var i = 0; i < terms.length; i++){
	switch(terms[i].type){
		case "title":
			$.scroll.add(Ti.UI.createLabel({
				text: terms[i].text,
				textAlign : 'center',
				font:{ fontSize: 16, fontWeight: "bold"},
				color : '#000',
				bottom: 5,
				left : 5,
				right : 5
			}));
			break;
		case "content":
			$.scroll.add(Ti.UI.createLabel({
				text: terms[i].text,
				textAlign : 'center',
				font:{ fontSize: 12, fontWeight: "normal"},
				color : '#000',
				bottom: 10,
				left : 5,
				right : 5
			}));
			break;
	}
}