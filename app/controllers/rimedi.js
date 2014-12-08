
function back(){
	$.pagesRimedi.scrollToView(0);
	$.backIconRimedi.visible = false;
	$.subIconRimedi.visible = true;
	$.subTitleRimedi.text = "Rimedi";
	setTimeout(function(){ $.detailRimedi.scrollTo(0,0); }, 200);
};

function openCosaFare(){
	$.subIconRimedi.visible = false;
	$.backIconRimedi.visible = true;
	$.subTitleRimedi.text = "Cosa fare";
	
	$.pagesRimedi.scrollToView(1);
	$.detailImageRimedi.image = "/images/rimedi-1.png";
	$.detailTextRimedi.text = "Cullare il bambino durante il giorno quando non sta piangendo: questa abitudine dovrebbe ridurre il pianto insistente e la frequenza delle coliche.\n\nBisognerebbe prendere l’abitudine di alimentare il bambino dopo che siano passate almeno 2 ore dall’ultimo pasto nel primo mese di vita e 3-4 ore nei mesi successivi. Questi sono in genere i tempi minimi indispensabili perché lo stomaco si vuoti e la digestione si completi.\n\nAttuare terapie posizionali (vedi) come per esempio porre il bambino a pancia sotto e battendogli lievemente sul dorso, o in posizione supina massaggiandogli delicatamente l’addome.\n\nCercare aiuto e collaborazione tra parenti e amici o di una baby-sitter. Se la madre si trova a gestire il problema da sola o con scarsi risultati, tendenzialmente accentuerà la situazione, deteriorando il rapporta con il bambino.\n\nE’ indispensabile che la mamma abbia un po’ di relax e di riposo: il neonato con le coliche, nella maggior parte sei casi, può essere facilmente aiutato da una mamma efficiente e rilassata. La mancanza di sonno e lo stress portano spesso ad acuire il problema, difficilmente a risolverlo. E’ importante che la mamma si conceda almeno un’attività che la distragga (ad esempio leggere un libro, fare una passeggiata, mantenersi in contatto con amiche o colleghe). \n\nRicorrere al trattamento farmacologico (probiotici, antispastici e antimeteorici) solo dopo aver consultato il proprio Pediatra, che va interpellato anche quando le coliche gassose si ripetono con una certa frequenza e gravità.";
};

function openNonFare(){
	$.subIconRimedi.visible = false;
	$.backIconRimedi.visible = true;
	$.subTitleRimedi.text = "Cosa non fare";
	
	$.pagesRimedi.scrollToView(1);
	$.detailImageRimedi.image = "/images/rimedi-2.png";
	$.detailTextRimedi.text = "Far dormire il bambino durante le ore del giorno con un sonno che si prolunghi per molte ore perché è stato osservato che molti dei bambini che sono affetti da coliche gassose, dormono piuttosto a lungo durante il giorno. Se il bambino ha l’abitudine di dormire per più di 3 ore durante il giorno, dovrebbe essere svegliato e distratto, facendogli il bagnetto o intrattenendolo piacevolmente.\n\nNon superalimentare il bambino: alcuni genitori sono convinti che il loro bambino sia “sempre affamato” e “mai  soddisfatti”.\n\nL'uso di sondini rettali e termometri nel tentativo di favorire l'eliminazione dell'aria intestinale è sconsigliabile perché provoca solo irritazione nel bambino.\n\nRicorrere al trattamento farmacologico (probiotici, antispastici e antimeteorici) solo dopo aver consultato il proprio Pediatra, che va interpellato anche quando le coliche gassose si ripetono con una certa frequenza e gravità.";
};
function openCambiarePosizione(){
	$.subIconRimedi.visible = false;
	$.backIconRimedi.visible = true;
	$.subTitleRimedi.text = "Posizioni";
	
	$.pagesRimedi.scrollToView(1);
	$.detailImageRimedi.image = "/images/rimedi-3.png";
	$.detailTextRimedi.text = "Se abitualmente cercate di calmare il bambino cullandolo a pancia in su e questo non aiuta, provate un'altra posizione. Provate a calmarlo tenendolo rivolto verso il basso - con la mano sotto la pancia e la testa sull'avambraccio. La pressione sulla sua pancia può infatti  aiutare ad alleviare il disagio provocato dalla presenza di gas.\n\nUn'altra posizione è simile alla precedente, la testa però non appoggiata sull’avambraccio ma sulla mano ed è il corpo ad essere steso sull’avambraccio.";
};
function openMassaggio(){
	$.subIconRimedi.visible = false;
	$.backIconRimedi.visible = true;
	$.subTitleRimedi.text = "Massaggio";
	
	$.pagesRimedi.scrollToView(1);
	$.detailImageRimedi.image = "/images/rimedi-4.png";
	$.detailTextRimedi.text = "Mani calde sull'addome\n\nAppoggiare delicatamente le vostre mani calde sulla pancia del bambino e iniziare un leggero movimento in senso orario.\n\n\nPiegare le ginocchia del bambino\n\nPrendere dolcemente le ginocchia del bambino, portarle piano a piegarsi verso l’addome e tenerle in quella posizione per alcune secondi. Spazio disegno";
};
function openMusicaDolce(){
	$.subIconRimedi.visible = false;
	$.backIconRimedi.visible = true;
	$.subTitleRimedi.text = "Musica dolce";
	
	$.pagesRimedi.scrollToView(1);
	$.detailImageRimedi.image = "/images/rimedi-5.png";
	$.detailTextRimedi.text = "Un rumore di sottofondo costante e dolce aiuta il bambino a calmarsi. Questo può essere un rumore “bianco” come quello dell’acqua che scorre, o una musica dolce tenuta a basso volume: entrambi hanno la capacità di coprire i rumori esterni e favorire il rilassamento.";
};
function openMovimento(){
	$.subIconRimedi.visible = false;
	$.backIconRimedi.visible = true;
	$.subTitleRimedi.text = "Movimento";
	
	$.pagesRimedi.scrollToView(1);
	$.detailImageRimedi.image = "/images/rimedi-6.png";
	$.detailTextRimedi.text = "Il bambino nel grembo materno era abituato ad essere in movimento semi-costante essendo al contempo in un ambiente protetto e sicuro. Imitare questo movimento, dal cullarlo camminando per casa fino a portarlo a fare un giro in macchina facilita il rilassamento ed aiuta il bambino a riaddormentarsi.";
};
function openProbiotici(){
	$.subIconRimedi.visible = false;
	$.backIconRimedi.visible = true;
	$.subTitleRimedi.text = "Probiotici";
	
	$.pagesRimedi.scrollToView(1);
	$.detailImageRimedi.image = "/images/rimedi-7.png";
	$.detailTextRimedi.text = "Ad oggi le cause delle coliche gassose non sono del tutto note, ma recenti studi hanno ipotizzato un coinvolgimento della microflora intestinale (meno diversificata e con una minore conta di lattobacilli) come causa del dolore e degli altri sintomi che provocano il pianto del bambino.";
};
