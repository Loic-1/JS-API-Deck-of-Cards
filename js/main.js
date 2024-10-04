// fonction qui fait le fetch(), qui contacte l'API
async function callAPI(uri) {
    console.log("-- callAPI - start --");
    console.log("url = ", uri);

    try {
        // fetch(), appel à l'API et réception de la réponse
        const response = await fetch(uri);
        console.log("response = ", response);

        // récupération des données JSON reçues de l'API
        const data = await response.json();
        console.log("data = ", data);

        console.log("-- callAPI - end --");

        // renvoi des données
        return data;
    } catch (error) {
        console.error(error.message);
    }
}

// constante globale : l'URI du endpoint de demande de nouveau deck
const API_ENDPOINT_NEW_DECK = `https://deckofcardsapi.com/api/deck/new/`;//je savais pas qu'il fallait utiliser des backticks j'ai perdu 3 heures à la maison

// fausse URI pour test
// const API_ENDPOINT_NEW_DECK = `https://deckofcardsapi.com/api/deck/ne/`;

// fonction de demande de nouveau deck
async function getNewDeck() {
    console.log(">> getNewDeck");

    return await callAPI(API_ENDPOINT_NEW_DECK);
}

// variable globale : l'id du deck utilisé, dans lequel on pioche
let idDeck = null;

// fonctions (syntaxe de fonction fléchée) qui renvoient des URI dynamiques de demande du deck et de pioche
const getApiEndPointShuffleDeck = () => `https://deckofcardsapi.com/api/deck/${idDeck}/shuffle/`;

// fonction de demande de mélange du deck
async function shuffleDeck() {
    console.log(">> shuffleDeck");

    return await callAPI(getApiEndPointShuffleDeck());
}

// fonctions (syntaxe de onction fléchée) qui renvoient des URI dynamiques de demande de mélange du deck et de pioche
const getApiEndPointDrawCard = () => `https://deckofcardsapi.com/api/deck/${idDeck}/draw/?count=1`;

// fonction de demande de pioche dans le deck
async function drawCard() {
    console.log(">> drawCard");

    return await callAPI(getApiEndPointDrawCard());
}

// supprime les cartes de l'ancien deck du DOM
const cleanDomCardsFromPreviousDeck = () =>
    // récupération des cartes (classe CSS "card")
    document.querySelectorAll(".card")
        // et pour chacune de ces cartes
        .forEach((card) =>
            // suppression du DOM
            card.remove()
        )
    ;

// fonction de réinitialisation (demande de nouveau deck + demande de mélange de ce nouveau deck)
async function actionReset() {
    // vider dans le DOM les cartes de l'ancien deck
    cleanDomCardsFromPreviousDeck();

    // récupération d'un nouveau deck
    const newDeckResponse = await getNewDeck();

    // récupération de l'id de ce nouveau deck dans les données reçues et mise à jour de la variable globale
    idDeck = newDeckResponse.deck_id;

    // changement couleur actionDrawButton en noir et curseur et normal
    actionDrawButton.style.color = "var(--main-font-color)";
    actionDrawButton.style.cursor = "pointer"
    actionDrawButton.style.backgroundColor = "var(--button-background-color)"
    // actionDrawButton.style.borderStyle = "inset";
    counter.innerText = "";

    // mélange du deck
    await shuffleDeck();
}

// éléments HTML utiles pour les évènements et pour la manipulation du DOM
const cardsContainer = document.getElementById("cards-container");

// ajoute une carte dans le DOM (dans la zone des cartes piochées) d'après l'URI de son image
function addCardToDomByImgUri(imgUri) {
    // création de l'élément HTML "img", de classe CSS "card" et avec pour attribut HTML "src" l'URI reçue en argument
    const imgCardHtmlElement = document.createElement("img");
    imgCardHtmlElement.classList.add("card");
    imgCardHtmlElement.src = imgUri;

    // ajout de cette image dans la zone des cartes piochées (en dernière position, dernier enfant de cardsContainer)
    cardsContainer.append(imgCardHtmlElement);
}

// fonction qui demande à piocher une carte, puis qui fait l'appel pour l'intégrer dans le DOM
async function actionDraw() {
    // appel à l'API pour demander au croupier de piocher une carte et de nous la renvoyer
    const drawCardResponse = await drawCard();

    // regarde s'il reste au moins une carte dans le deck et vérifie si la dernière carte a bien été reçue
    if (drawCardResponse.remaining >= 0 && drawCardResponse.success == true) {
        console.log("drawCardResponse = ", drawCardResponse);

        // récupération de l'URI de l'image de cette carte dans les données reçues
        const imgCardUri = drawCardResponse.cards[0].image;

        // ajout de la carte piochée dans la zone des cartes piochées
        addCardToDomByImgUri(imgCardUri);

        counter.innerText = "Remaining cards : " + drawCardResponse.remaining;

        if (drawCardResponse.remaining == 0) {
            actionDrawButton.style.color = "gray";
            actionDrawButton.style.backgroundColor = "var(--button-background-color-dark)";
            actionDrawButton.style.cursor = "default";
            actionDrawButton.style.borderStyle = "outset";
        }
    }
    else {
        console.error("Il n'y a plus de cartes dans le deck")
    }
}

//TEST


const getApiEndPointReturnCard = () => `https://deckofcardsapi.com/api/deck/${idDeck}/return/`;

async function returnCard(params) {
    console.log(">> return card");

    return await callAPI(getApiEndPointReturnCard());
}








// appel d'initialisation au lancement de l'application
actionReset();

// éléments HTML utiles pour les évènements et pour la manipulation du DOM
const actionResetButton = document.getElementById("action-reset");
const actionDrawButton = document.getElementById("action-draw");
const actionReturnButton = document.getElementById("action-return");
const counter = document.getElementById("card-count");

// écoutes d'évènements sur les boutons d'action
actionResetButton.addEventListener("click", actionReset);
actionDrawButton.addEventListener("click", actionDraw);
actionReturnButton.addEventListener("click", returnCard);