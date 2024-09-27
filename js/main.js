async function callAPI(uri) {
    console.log("-- callAPI - start --");
    console.log("url = ", uri);

    const response = await fetch(uri);
    console.log("response = ", response);

    const data = await response.json();
    console.log("data = ", data);

    console.log("-- callAPI - end --");

    return (data);
}

const API_ENDPOINT_NEW_DECK = "https://deckofcardsapi.com/api/deck/new/";

async function getNewDeck() {
    console.log(">> getNewDeck");

    return (await callAPI(API_ENDPOINT_NEW_DECK));
}