function back(){
	$.pagesGuida.scrollToView(0);
	$.backIconGuida.visible = false;
	$.subIconGuida.visible = true;
	$.subTitleGuida.text = "Rimedi";
	setTimeout(function(){ $.detailGuida.scrollTo(0,0); }, 200);
};

function openCosa(){
	$.subIconGuida.visible = false;
	$.backIconGuida.visible = true;
	$.subTitleGuida.text = "Cosa sono";
	
	$.pagesGuida.scrollToView(1);
	$.detailImageGuida.image = "/images/baby-1.jpg";
	$.detailTextGuida.text = "Le coliche gassose rappresentano un disturbo estremamente frequente nelle prime settimane di vita e consistono in attacchi improvvisi di irritabilità, irrequietezza o pianto che possono durare anche ore. L’esordio è, generalmente nel tardo pomeriggio o la sera e, generalmente, al termine di ogni episodio il bambino di addormenta.";
};

function openSintomi(){
	$.subIconGuida.visible = false;
	$.backIconGuida.visible = true;
	$.subTitleGuida.text = "Sintomi";
	
	$.pagesGuida.scrollToView(1);
	$.detailImageGuida.image = "/images/baby-2.jpg";
	$.detailTextGuida.text = "Si presentano con crisi di pianto (più o meno sempre nello stesso momento della giornata), accompagnate da rigurgito ed agitazione.";
};

function openCause(){
	$.subIconGuida.visible = false;
	$.backIconGuida.visible = true;
	$.subTitleGuida.text = "Cause";
	
	$.pagesGuida.scrollToView(1);
	$.detailImageGuida.image = "/images/baby-3.jpg";
	$.detailTextGuida.text = "Ad oggi le cause delle coliche gassose non sono del tutto note, ma recenti studi hanno ipotizzato un coinvolgimento della microflora intestinale (meno diversificata e con una minore conta di lattobacilli) come causa del dolore e degli altri sintomi che provocano il pianto del bambino.";
};