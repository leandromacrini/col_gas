
function back(){
	$.pagesRimedi.scrollToView(0);
	$.backIconRimedi.visible = false;
	$.subIconRimedi.visible = true;
	$.subTitleRimedi.text = "Rimedi";
	setTimeout(function(){ $.detailRimedi.scrollTo(0,0); }, 200);
};

function openNonFare(){
	$.subIconRimedi.visible = false;
	$.backIconRimedi.visible = true;
	$.subTitleRimedi.text = "Cosa non fare";
	
	$.detailRimedi.removeAllChildren();
	
	$.detailRimedi.add(Ti.UI.createImageView({
		top: 10,
		width: "100%",
		image: "/images/cosaNonfare.png",
	}));
	
	$.detailRimedi.add(Ti.UI.createLabel({
		top: 10,
		width : "95%",
		color: "#999",
		font:{ fontSize: 20},
		text: "Far dormire il bambino durante le ore del giorno con un sonno che si prolunghi per molte ore perché è stato osservato che molti dei bambini che sono affetti da coliche gassose, dormono piuttosto a lungo durante il giorno. Se il bambino ha l’abitudine di dormire per più di 3 ore durante il giorno, dovrebbe essere svegliato e distratto, facendogli il bagnetto o intrattenendolo piacevolmente."
	}));
	
	$.detailRimedi.add(Ti.UI.createLabel({
		top: 10,
		width : "95%",
		color: "#999",
		font:{ fontSize: 20},
		text: "Non superalimentare il bambino: alcuni genitori sono convinti che il loro bambino sia “sempre affamato” e “mai  soddisfatti”."
	}));
	
	$.detailRimedi.add(Ti.UI.createLabel({
		top: 10,
		width : "95%",
		color: "#999",
		font:{ fontSize: 20},
		text: "L'uso di sondini rettali e termometri nel tentativo di favorire l'eliminazione dell'aria intestinale è sconsigliabile perché provoca solo irritazione nel bambino."
	}));
	
	$.detailRimedi.add(Ti.UI.createLabel({
		top: 10,
		width : "95%",
		color: "#999",
		font:{ fontSize: 20},
		text: "Ricorrere al trattamento farmacologico (probiotici, antispastici e antimeteorici) solo dopo aver consultato il proprio Pediatra, che va interpellato anche quando le coliche gassose si ripetono con una certa frequenza e gravità."
	}));
	
	$.pagesRimedi.scrollToView(1);
};
function openCosaFare(){
	$.subIconRimedi.visible = false;
	$.backIconRimedi.visible = true;
	$.subTitleRimedi.text = "Cosa fare";
	
	$.detailRimedi.removeAllChildren();
	
	$.detailRimedi.add(Ti.UI.createLabel({
		top: 10,
		width : "95%",
		color: "#999",
		font:{ fontSize: 20},
		text: "Cullare il bambino durante il giorno quando non sta piangendo: questa abitudine dovrebbe ridurre il pianto insistente e la frequenza delle coliche."
	}));
	
	$.detailRimedi.add(Ti.UI.createImageView({
		top: 10,
		width: "100%",
		image: "/images/cullare.png",
	}));
	
	$.detailRimedi.add(Ti.UI.createLabel({
		top: 10,
		width : "95%",
		color: "#999",
		font:{ fontSize: 20},
		text: "Bisognerebbe prendere l’abitudine di alimentare il bambino dopo che siano passate almeno 2 ore dall’ultimo pasto nel primo mese di vita e 3-4 ore nei mesi successivi. Questi sono in genere i tempi minimi indispensabili perché lo stomaco si vuoti e la digestione si completi."
	}));
	
	$.detailRimedi.add(Ti.UI.createLabel({
		top: 10,
		width : "95%",
		color: "#999",
		font:{ fontSize: 20},
		text: "Attuare terapie posizionali (vedi) come per esempio porre il bambino a pancia sotto e battendogli lievemente sul dorso, o in posizione supina massaggiandogli delicatamente l’addome."
	}));
	
	$.detailRimedi.add(Ti.UI.createLabel({
		top: 10,
		width : "95%",
		color: "#999",
		font:{ fontSize: 20},
		text: "Cercare aiuto e collaborazione tra parenti e amici o di una baby-sitter. Se la madre si trova a gestire il problema da sola o con scarsi risultati, tendenzialmente accentuerà la situazione, deteriorando il rapporta con il bambino."
	}));
	
	$.detailRimedi.add(Ti.UI.createLabel({
		top: 10,
		width : "95%",
		color: "#999",
		font:{ fontSize: 20},
		text: "È indispensabile che la mamma abbia un po’ di relax e di riposo: il neonato con le coliche, nella maggior parte sei casi, può essere facilmente aiutato da una mamma efficiente e rilassata. La mancanza di sonno e lo stress portano spesso ad acuire il problema, difficilmente a risolverlo. E’ importante che la mamma si conceda almeno un’attività che la distragga (ad esempio leggere un libro, fare una passeggiata, mantenersi in contatto con amiche o colleghe)."
	}));
	
	$.detailRimedi.add(Ti.UI.createLabel({
		top: 10,
		width : "95%",
		color: "#999",
		font:{ fontSize: 20},
		text: "Ricorrere al trattamento farmacologico (probiotici, antispastici e antimeteorici) solo dopo aver consultato il proprio Pediatra, che va interpellato anche quando le coliche gassose si ripetono con una certa frequenza e gravità."
	}));
	
	$.pagesRimedi.scrollToView(1);
};
function openCambiarePosizione(){
	$.subIconRimedi.visible = false;
	$.backIconRimedi.visible = true;
	$.subTitleRimedi.text = "Posizioni";
	
	$.detailRimedi.removeAllChildren();
	
	$.detailRimedi.add(Ti.UI.createLabel({
		top: 10,
		width : "95%",
		color: "#999",
		font:{ fontSize: 20},
		text: "Se abitualmente cercate di calmare il bambino cullandolo a pancia in su e questo non aiuta, provate un'altra posizione. Provate a calmarlo tenendolo rivolto verso il basso - con la mano sotto la pancia e la testa sull'avambraccio. La pressione sulla sua pancia può infatti  aiutare ad alleviare il disagio provocato dalla presenza di gas."
	}));
	
	$.detailRimedi.add(Ti.UI.createImageView({
		top: 10,
		width: "100%",
		image: "/images/cambiarepos1a.png",
	}));
	
	$.detailRimedi.add(Ti.UI.createLabel({
		top: 10,
		width : "95%",
		color: "#999",
		font:{ fontSize: 20},
		text: "Un'altra posizione è simile alla precedente, la testa però non appoggiata sull’avambraccio ma sulla mano ed è il corpo ad essere steso sull’avambraccio."
	}));
	
	$.detailRimedi.add(Ti.UI.createImageView({
		top: 10,
		width: "100%",
		image: "/images/cambiarepos2a.png",
	}));
	
	$.pagesRimedi.scrollToView(1);
};
function openMassaggio(){
	$.subIconRimedi.visible = false;
	$.backIconRimedi.visible = true;
	$.subTitleRimedi.text = "Massaggio";
	
	$.detailRimedi.removeAllChildren();
	
	$.detailRimedi.add(Ti.UI.createLabel({
		top: 10,
		width : "95%",
		color: "#000",
		font:{ fontSize: 20},
		text: "Mani calde sull'addome"
	}));
	
	$.detailRimedi.add(Ti.UI.createLabel({
		top: 10,
		width : "95%",
		color: "#999",
		font:{ fontSize: 20},
		text: "Appoggiare delicatamente le vostre mani calde sulla pancia del bambino e iniziare un leggero movimento in senso orario."
	}));
	
	$.detailRimedi.add(Ti.UI.createImageView({
		top: 10,
		width: "100%",
		image: "/images/massaggio1.png",
	}));
	
	$.detailRimedi.add(Ti.UI.createLabel({
		top: 10,
		width : "95%",
		color: "#000",
		font:{ fontSize: 20},
		text: "Piegare le ginocchia del bambino"
	}));
	
	$.detailRimedi.add(Ti.UI.createLabel({
		top: 10,
		width : "95%",
		color: "#999",
		font:{ fontSize: 20},
		text: "Prendere dolcemente le ginocchia del bambino, portarle piano a piegarsi verso l’addome e tenerle in quella posizione per alcune secondi."
	}));
	
	$.detailRimedi.add(Ti.UI.createImageView({
		top: 10,
		width: "100%",
		image: "/images/massaggio2.png",
	}));
	
	$.pagesRimedi.scrollToView(1);
};
function openMusicaDolce(){
	$.subIconRimedi.visible = false;
	$.backIconRimedi.visible = true;
	$.subTitleRimedi.text = "Musica dolce";
	
	$.detailRimedi.removeAllChildren();
	
	$.detailRimedi.add(Ti.UI.createImageView({
		top: 10,
		width: "100%",
		image: "/images/musicadolce1.jpg",
	}));
	
	$.detailRimedi.add(Ti.UI.createLabel({
		top: 10,
		width : "95%",
		color: "#999",
		font:{ fontSize: 20},
		text: "Un rumore di sottofondo costante e dolce aiuta il bambino a calmarsi. Questo può essere un rumore “bianco” come quello dell’acqua che scorre, o una musica dolce tenuta a basso volume: entrambi hanno la capacità di coprire i rumori esterni e favorire il rilassamento."
	}));
	
	$.pagesRimedi.scrollToView(1);
};
function openMovimento(){
	$.subIconRimedi.visible = false;
	$.backIconRimedi.visible = true;
	$.subTitleRimedi.text = "Movimento";
	
	$.detailRimedi.removeAllChildren();
	
	$.detailRimedi.add(Ti.UI.createImageView({
		top: 10,
		width: "100%",
		image: "/images/figura_7.png",
	}));
	
	$.detailRimedi.add(Ti.UI.createLabel({
		top: 10,
		width : "95%",
		color: "#999",
		font:{ fontSize: 20},
		text: "Il bambino nel grembo materno era abituato ad essere in movimento semi-costante essendo al contempo in un ambiente protetto e sicuro. Imitare questo movimento, dal cullarlo camminando per casa fino a portarlo a fare un giro in macchina facilita il rilassamento ed aiuta il bambino a riaddormentarsi."
	}));

	$.pagesRimedi.scrollToView(1);
};
function openProbiotici(){
	$.subIconRimedi.visible = false;
	$.backIconRimedi.visible = true;
	$.subTitleRimedi.text = "Probiotici";
	
	$.detailRimedi.removeAllChildren();
	
	$.detailRimedi.add(Ti.UI.createLabel({
		top: 10,
		width : "95%",
		color: "#999",
		font:{ fontSize: 20},
		text: "Recentemente è stato osservato come, nei neonati che soffrono di coliche, sia presente un microbiota fecale meno diversificato e con una minore conta di lattobacilli. Queste evidenze hanno fornito il razionale a supporto dell’utilizzo dei probiotici nei bambini che soffrono di coliche."
	}));
	
	$.pagesRimedi.scrollToView(1);
};

this.open = function() { };