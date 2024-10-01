actionReset();

async function callAPI(uri) {
    console.log("-- callAPI - start --");
    console.log("url = ", uri);

    const response = await fetch(uri);
    console.log("response = ", response);

    const data = await response.json();
    console.log("data = ", data);

    console.log("-- callAPI - end --");

    return data;
}

const API_ENDPOINT_NEW_DECK = "https://deckofcardsapi.com/api/deck/new/";

async function getNewDeck() {
    console.log(">> getNewDeck");

    return await callAPI(API_ENDPOINT_NEW_DECK);
}

let idDeck = null;

const getApiEndPointShuffleDeck = () => 'https://deckofcardsapi.com/api/deck/${idDeck}/shuffle/';

async function shuffleDeck() {
    console.log(">> shuffleDeck");
    return await callAPI(getApiEndPointShuffleDeck());
}

const getApiEndPointDrawCard = () => 'https://deckofcardsapi.com/api/deck/${idDeck}/draw/?count=1';

async function drawCard() {
    console.log(">> drawCard");
    return await callAPI(getApiEndPointDrawCard());
}

const cleanDomCardsFromPreviousDeck = () => document.querySelectorAll(".card").forEach((child) => child.remove());

async function actionReset() {
    cleanDomCardsFromPreviousDeck();

    const newDeckResponse = await getNewDeck();
    idDeck = newDeckResponse.deck_id;//idDeck?

    await shuffleDeck();
}

const cardsContainer = document.getElementById("cards-container");

function addCardToDomByImgUri(imgUri){
    const imgCardHtmlElement = document.createElement("img");
    imgCardHtmlElement.classList.add("card");
    imgCardHtmlElement.src = imgUri;

    cardsContainer.append(imgCardHtmlElement);
}

async function actionDraw() {
    const drawCardResponse = await drawCard();
    console.log("drawCardResponse = ", drawCardResponse);
    const imgCardUri = drawCardResponse.cards[0].image;

    addCardToDomByImgUri(imgCardUri);
}



const actionResetButton = document.getElementById("action-reset")
const actionDrawButton = document.getElementById("action-draw")

actionResetButton.addEventListener("click", actionReset());
actionDrawButton.addEventListener("click", actionDraw());