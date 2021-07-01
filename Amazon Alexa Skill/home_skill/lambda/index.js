/*  My Thai Star restaurant skill
    last update: 29.06.2021 
    comment: clean code updates
    
    This JS File contains the business logic of the my thai star skills. 
    It does only work with the corresponding JSON File, that can be inserted in the build part of the amazon developer console.
    
    Name and email-address for reservations and orders are hard coded to be more flexible in testing.
    The HTTPS communication of the skill with an on premise solution of my thai star can be established with ngrok(IP tunnel service) on port 80.
    Assign the ngrok link to the server const.
*/
const Alexa = require('ask-sdk-core');
const http = require('http');

const APP_NAME = "My Thai Star Home";
const messages = {
    NOTIFY_MISSING_PERMISSIONS: 'Bitte erlaube den Zugriff auf Profilinformationen in deiner Alexa App.',
    ERROR: 'Oh o, irgendwas ist schiefgelaufen.'
};

const FULL_NAME_PERMISSION = "alexa::profile:name:read";
const EMAIL_PERMISSION = "alexa::profile:email:read";
const MOBILE_PERMISSION = "alexa::profile:mobile_number:read";

// update link for every session!
const server = '9b0f7cb59e79.ngrok.io';
/*  postHTTP
        all http communication is defined here. 
*/
const postHttp = function(hostname, path, data) {

    let options = {
        hostname: hostname,
        port: 80,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }

    }
    return new Promise((resolve, reject) => {
        let request = http.request(options, response => {

            let returnData = "";

            response.on('data', chunk => {
                returnData += chunk;
            });

            response.on('end', () => {
                resolve(returnData);
            });

            request.on('error', error => {
                reject(error);
            })
        });

        request.write(data);
        request.end();
    });
}


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {

        // get user name start
        var profileName;
        const {
            serviceClientFactory,
            responseBuilder
        } = handlerInput;
        try {
            const upsServiceClient = serviceClientFactory.getUpsServiceClient();
            profileName = await upsServiceClient.getProfileName();
        } catch (error) {
            console.log(JSON.stringify(error));
            if (error.statusCode === 403) {
                return responseBuilder
                    .speak(messages.NOTIFY_MISSING_PERMISSIONS)
                    .withAskForPermissionsConsentCard([FULL_NAME_PERMISSION])
                    .getResponse();
            }
            console.log(JSON.stringify(error));
            const response = responseBuilder.speak(messages.ERROR).getResponse();
            return response;
        }
        // get user name end 

        const attributesManager = handlerInput.attributesManager;

        var sessionAttributes = attributesManager.getSessionAttributes();
        sessionAttributes.Orders = [];
        sessionAttributes.bookingToken = "";
        sessionAttributes.table = 0;

        sessionAttributes.profileName = profileName;

        var speakOutput = `Hallo ${profileName} und Willkommen zu My Thai Star. Gerne nehme Ich deine Reservierung auf. Falls du Hilfe benötigst, sage "Hilfe" `;
        sessionAttributes.OrdersOutput = " ";
        sessionAttributes.orderId = "";
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// allow the guest to book a table in the restaurant and alexa ask for the requierd information
const ReservationIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReservationIntent';
    },
    async handle(handlerInput) {
        const http = require('http');
        const attributesManager = handlerInput.attributesManager;
        var sessionAttributes = attributesManager.getSessionAttributes();

        var SpeakOutput = 'Vielen Dank, die Reservierung war erfolgreich. Falls du Hilfe brauchst, sage Hilfe. ansonsten stehe ich dir für deine Bestellung zur Verfügung.';
        // save slot values in variables
        var nameAttribute = sessionAttributes.profileName;
        var daySlot = handlerInput.requestEnvelope.request.intent.slots.day.value;
        var timeSlot = handlerInput.requestEnvelope.request.intent.slots.time.value;
        var numberOfGuestsSlot = handlerInput.requestEnvelope.request.intent.slots.numberOfGuests.value;
        var g = parseInt(timeSlot) - 2;
        let time = g.toString() + ":00";


        // HTTP Request Start  
        let serverResponse = await postHttp(server, "/mythaistar/services/rest/bookingmanagement/v1/booking", JSON.stringify({
            booking: {
                bookingDate: daySlot + "T" + time + ":00.000Z",
                name: nameAttribute,
                email: "Nicholas.klag@gmail.com",
                assistants: numberOfGuestsSlot
            }
        }));


        let responseObject = JSON.parse(serverResponse);
        let bookingToken = responseObject.bookingToken;

        sessionAttributes.bookingToken = bookingToken;



        return handlerInput.responseBuilder
            .speak(SpeakOutput)
            .reprompt(SpeakOutput)
            .getResponse();
    }
};
// allow the guest to book a table in the restaurant and alexa take the requierd information from the user's input
const ReservationOneStepHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReservationOneStep';
    },
    async handle(handlerInput) {
        const http = require('http');
        const attributesManager = handlerInput.attributesManager;
        var sessionAttributes = attributesManager.getSessionAttributes();

        var SpeakOutput = 'Vielen Dank, die Reservierung war erfolgreich. Falls du Hilfe brauchst, sage Hilfe. ansonsten stehe ich dir für deine Bestellung zur Verfügung.';
        // save slot values in variables
        var nameAttribute = sessionAttributes.profileName;
        var daySlot = handlerInput.requestEnvelope.request.intent.slots.date.value;
        var timeSlot = handlerInput.requestEnvelope.request.intent.slots.time.value;
        var numberOfGuestsSlot = handlerInput.requestEnvelope.request.intent.slots.numberOfGuest.value;
        var g = parseInt(timeSlot) - 2;
        let time = g.toString() + ":00";


        let serverResponse = await postHttp(server, "/mythaistar/services/rest/bookingmanagement/v1/booking", JSON.stringify({
            booking: {
                bookingDate: daySlot + "T" + time + ":00.000Z",
                name: nameAttribute,
                email: "Nicholas.klag@gmail.com",
                assistants: numberOfGuestsSlot
            }
        }));


        let responseObject = JSON.parse(serverResponse);
        let bookingToken = responseObject.bookingToken;

        sessionAttributes.bookingToken = bookingToken;

        return handlerInput.responseBuilder
            .speak(SpeakOutput)
            .reprompt(SpeakOutput)
            .getResponse();
    }
};

// returns the dish of today thai tis defined by the waiter in the 'waiter cockpit' of my thai star
const DishOfTodayIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'DishOfToday';
    },
    async handle(handlerInput) {

        let speakOutput = "Die Tagesgerichte heute sind: "
        let repromptOutput = " Möchtest du noch etwas anderes tun?";

        try {

            let serverResponse = await postHttp(server, "/mythaistar/services/rest/dishmanagement/v1/dish/search", JSON.stringify({
                categories: [],
                searchBy: "",
                pageable: {
                    pageSize: 32,
                    pageNumber: 0,
                    sort: [{
                        property: "price",
                        direction: "DESC"
                    }]
                },
                maxPrice: null,
                minLikes: null,
                showOnlyDailyOffer: true
            }));

            let responseObject = JSON.parse(serverResponse);

            let dishes = responseObject.content;

            if (dishes.length === 0) {

                speakOutput += " Es tut uns leid, du kannst es später noch einmal versuchen."

            } else {
                let dishNum;
                for (let i = 0; i < dishes.length; i++)
                    speakOutput += dishes[i].dish.name + " für nur " + dishes[i].dish.dailyPrice + "€ ,";

                speakOutput += " .";

            }

            handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(repromptOutput)

        } catch (error) {
            handlerInput.responseBuilder
                .speak(error + ' Entschuldige, es liegt ein technisches Problem vor.')
                .reprompt(repromptOutput)
        }


        return handlerInput.responseBuilder
            .getResponse();
    }
};
//returns the complete menu from my thai star 
const MenuIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'MenuIntent';
    },
    async handle(handlerInput) {

        let speakOutput = "";
        let repromptOutput = " Möchtest du noch etwas anderes tun?";

        try {

            let serverResponse = await postHttp(server, "/mythaistar/services/rest/dishmanagement/v1/dish/search", JSON.stringify({
                categories: [],
                searchBy: "",
                pageable: {
                    pageSize: 32,
                    pageNumber: 0,
                    sort: [{
                        property: "price",
                        direction: "DESC"
                    }]
                },
                maxPrice: null,
                minLikes: null
            }));

            let responseObject = JSON.parse(serverResponse);

            let dishes = responseObject.content;

            if (dishes.length === 0) {

                speakOutput += " Es tut uns leid, du kannst es später noch einmal versuchen."

            } else {
                let menu = "";
                for (let i = 0; i < dishes.length; i++)
                    menu += dishes[i].dish.name + ", ";


                speakOutput += "Die Speisekarte :  " + menu + ".";

            }

            handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(repromptOutput)

        } catch (error) {
            handlerInput.responseBuilder
                .speak(error + ' Entschuldige, es liegt ein technisches Problem vor.')
                .reprompt(repromptOutput)
        }


        return handlerInput.responseBuilder
            .getResponse();
    }
};
//allow the guest to filter the menu by defined parameters like 'vegan'. Filters can be updated in the correspannding JSON file
const GuestFilterIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'GuestFilter';
    },
    async handle(handlerInput) {

        let speakOutput = " ";
        let repromptOutput = " Möchtest du noch etwas anderes tun?";

        try {
            var filterSlot = handlerInput.requestEnvelope.request.intent.slots.filter.resolutions.resolutionsPerAuthority[0].values[0].value.id;
            let serverResponse = await postHttp(server, "/mythaistar/services/rest/dishmanagement/v1/dish/search", JSON.stringify({
                categories: [{
                    id: filterSlot
                }],
                searchBy: "",
                pageable: {
                    pageSize: 32,
                    pageNumber: 0,
                    sort: [{
                        property: "price",
                        direction: "DESC"
                    }]
                },
                maxPrice: null,
                minLikes: null
            }));

            let responseObject = JSON.parse(serverResponse);

            let dishes = responseObject.content;

            for (let i = 0; i < dishes.length; i++) {
                speakOutput += dishes[i].dish.name + ", ";

            }

            handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(repromptOutput)

        } catch (error) {
            handlerInput.responseBuilder
                .speak(error + ' Entschuldige, es liegt ein technisches Problem vor.')
                .reprompt(repromptOutput)
        }


        return handlerInput.responseBuilder
            .getResponse();
    }
};

// allow the guest to order dishes from my thai star. Extras and comments are possible. 

const OrderIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'OrderIntent';
    },
    async handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        var sessionAttributes = attributesManager.getSessionAttributes();
        sessionAttributes.orderState = 'STARTED';
        var speakOutput = " ";

        let dish = handlerInput.requestEnvelope.request.intent.slots.dish.value;
        let amount = handlerInput.requestEnvelope.request.intent.slots.amount.value;
        let extraId; 
        let extra = handlerInput.requestEnvelope.request.intent.slots.extra.value;
        let extra2 = handlerInput.requestEnvelope.request.intent.slots.extraToo.value;
        let comment = handlerInput.requestEnvelope.request.intent.slots.comment.value;
        if (!amount) {
            amount = 1;
        }
        if (extra === 'Tofu')
            extraId = 0;
        else
            extraId = 1;

        if (extra && extra2) {
            sessionAttributes.Orders.push({
                orderLine: {
                    dishId: handlerInput.requestEnvelope.request.intent.slots.dish.resolutions.resolutionsPerAuthority[0].values[0].value.id,
                    amount: amount,
                    comment: comment
                },
                extras: [{
                    id: 0
                }, {
                    id: 1
                }]
            });
        } else if (extra && !extra2) {
            sessionAttributes.Orders.push({
                orderLine: {
                    dishId: handlerInput.requestEnvelope.request.intent.slots.dish.resolutions.resolutionsPerAuthority[0].values[0].value.id,
                    amount: amount,
                    comment: comment
                },
                extras: [{
                    id: extraId
                }]
            });
        } else {
            sessionAttributes.Orders.push({
                orderLine: {
                    dishId: handlerInput.requestEnvelope.request.intent.slots.dish.resolutions.resolutionsPerAuthority[0].values[0].value.id,
                    amount: amount,
                    comment: comment
                },
                extras: []
            });

        }



        if (extra && extra2) {
            if (!comment)
                comment = "";
            if (amount === 1 || !amount) {
                sessionAttributes.OrdersOutput += " ein " + dish + " mit " + extra + ", " + extra2 + " " + comment;
            } else {
                sessionAttributes.OrdersOutput += " " + amount + " " + dish + " mit " + extra + ", " + extra2 + " " + comment;
            }

        } else {

            if (extra && comment) {
                if (amount === 1 || !amount) {
                    sessionAttributes.OrdersOutput += " ein " + dish + " mit " + extra + ", " + comment;
                } else {
                    sessionAttributes.OrdersOutput += " " + amount + " " + dish + " mit " + extra + ", " + comment;
                }
            } else if (!extra && !comment) {
                if (amount === 1 || !amount) {
                    sessionAttributes.OrdersOutput += " ein " + dish + ", ";
                } else {
                    sessionAttributes.OrdersOutput += " " + amount + " " + dish + ", ";
                }
            } else if (comment && !extra) {
                if (amount === 1 || !amount) {
                    sessionAttributes.OrdersOutput += " ein " + dish + ", " + comment;
                } else {
                    sessionAttributes.OrdersOutput += " " + amount + " " + dish + ", " + comment;
                }
            } else if (!comment && extra) {
                if (amount === 1 || !amount) {
                    sessionAttributes.OrdersOutput += " ein " + dish + " mit " + extra;
                } else {
                    sessionAttributes.OrdersOutput += " " + amount + " " + dish + " mit " + extra;
                }
            }
        }

        speakOutput += sessionAttributes.OrdersOutput + ' steht jetzt auf der Liste. Möchtest du eine weitere Bestellung aufgeben oder die Bestellung abschließen? ';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt
            .getResponse();
    }
};

//this handler catches the confermation to an order and send it to the backend of my thai star 
const AskForOrderConfirmationHandler = { 
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'AskForOrderConfirmationIntent';
    },
    handle(handlerInput) {
        var speakOutput = 'Ok, möchtest du deine Bestellung bestätigen?';
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes;

        sessionAttributes.orderState = 'STOPPED';
        sessionAttributes.orderConfirmation = 'STARTED';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();

    }
};
//this handler catches the confermation to an order
const ConfirmOrderHandler = {
    canHandle(handlerInput) {

        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConfirmOrderIntent';
    },
    async handle(handlerInput) {

        const attributesManager = handlerInput.attributesManager;
        var sessionAttributes = attributesManager.getSessionAttributes();

        var speakOutput = `Vielen Dank ${sessionAttributes.profileName}`; 

        try {

            let serverResponse = await postHttp(server, "/mythaistar/services/rest/ordermanagement/v1/order", JSON.stringify({
                booking: {
                    bookingToken: sessionAttributes.bookingToken
                },
                order: {
                    orderState: "orderTaken",
                    paymentState: "pending"
                },
                orderLines: sessionAttributes.Orders
            }));

            let responseObject = JSON.parse(serverResponse);
            sessionAttributes.orderId = responseObject.id;

            handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)

        } catch (error) {
            handlerInput.responseBuilder
                .speak(error + ' Entschuldige, es liegt ein technisches Problem vor.')
                .reprompt(speakOutput)
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();

    }
};

// allow the user to cancel the order
const CancelOrderHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'CancelOrder';
    },
    async handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        var sessionAttributes = attributesManager.getSessionAttributes();

        sessionAttributes.Orders.splice(sessionAttributes.Orders.length - 1, 1);

        const speakOutput = 'Die Bestellung wird storniert!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const CancelReservationHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'CancelReservation';
    },
    async handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        var sessionAttributes = attributesManager.getSessionAttributes();
        let serverResponse = await postHttp(server, "/mythaistar/services/rest/bookingmanagement/v1/booking/" + 1 + "/", JSON.stringify({
            orderState: "canceled",
            paymentState: "canceled"
        }));

        let responseObject = JSON.parse(serverResponse);


        const speakOutput = 'Die Bestellung wird storniert!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

//the intuitive intents and intent handlers should not replace the initially developed intents, they just add user experience
const IntuitiveOrderIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'IntuitiveOrderIntent';
    },
    async handle(handlerInput) {
        const http = require('http');
        const attributesManager = handlerInput.attributesManager;
        var sessionAttributes = attributesManager.getSessionAttributes();

        sessionAttributes.orderState = 'STARTED';
        var speakOutput = " ";

        let dish = handlerInput.requestEnvelope.request.intent.slots.dish.value;
        let amount = handlerInput.requestEnvelope.request.intent.slots.amount.value;
        let extraId; 
        let extra = handlerInput.requestEnvelope.request.intent.slots.extra.value;
        let comment = handlerInput.requestEnvelope.request.intent.slots.comment.value;
        if (!amount) {
            amount = 1;
        }
        if (extra === "extra curry")
            extraId = 1
        else
            extraId = 2;
        if (extra) {
            sessionAttributes.Orders.push({
                orderLine: {
                    dishId: handlerInput.requestEnvelope.request.intent.slots.dish.resolutions.resolutionsPerAuthority[0].values[0].value.id,
                    amount: amount,
                    comment: comment
                },
                extras: [{
                    id: 1
                }]
            });
        } else {
            sessionAttributes.Orders.push({
                orderLine: {
                    dishId: handlerInput.requestEnvelope.request.intent.slots.dish.resolutions.resolutionsPerAuthority[0].values[0].value.id,
                    amount: amount,
                    comment: comment
                },
                extras: []
            });
        }
        
        if (extra && comment) {
            if (amount === 1 || !amount) {
                sessionAttributes.OrdersOutput += " ein " + dish + " mit " + extra + ", " + comment;
            } else {
                sessionAttributes.OrdersOutput += " " + amount + " " + dish + " mit " + extra + ", " + comment;
            }
        } else if (!extra && !comment) {
            if (amount === 1 || !amount) {
                sessionAttributes.OrdersOutput += " ein " + dish + ", ";
            } else {
                sessionAttributes.OrdersOutput += " " + amount + " " + dish + ", ";
            }
        } else if (comment && !extra) {
            if (amount === 1 || !amount) {
                sessionAttributes.OrdersOutput += " ein " + dish + ", " + comment + ", ";
            } else {
                sessionAttributes.OrdersOutput += " " + amount + " " + dish + ", " + comment + ", ";
            }
        } else if (!comment && extra) {
            if (amount === 1 || !amount) {
                sessionAttributes.OrdersOutput += " ein " + dish + " mit " + extra + ", ";
            } else {
                sessionAttributes.OrdersOutput += " " + amount + " " + dish + " mit " + extra + ", ";
            }
        }

        speakOutput += 'Sehr gerne, ' + sessionAttributes.OrdersOutput + ' ist notiert. Möchtest du eine weitere Bestellung aufgeben oder die Bestellung abschließen?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const RecommendationIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'RecommendationIntent';
    },
    handle(handlerInput) {

        var recommendDish;
        const speakOutput = `Meine heutige Empfehlung ist ${recommendDish} .`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = ' Um einen Tisch zu reservieren, sage: "reserviere einen Tisch". Für das aktuelle Tagesgericht, sage Tagesgericht. Du kannst dir auch das Menü vorlesen lassen oder das Menü nach Katagorien filtern lassen. Sage dazu einfach "Menü vorlesen" oder zum Beispiel "vegan Gerichte"? Um eine Bestellung aufzugeben: sage "Bestellung aufgeben".';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Damit kann ich dir nicht weiterhelfen. Du kannst hier Bestellungen aufgeben, das Tagesgericht erfragen oder dir Gerichte passend zu deinen Vorlieben ausgeben.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `Du hast ${intentName} ausgelöst`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Entschuldige, ich hatte Schwierigkeiten dich zu verstehen. Bitte versuche es noch einmal.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ReservationIntentHandler,
        ReservationOneStepHandler,
        OrderIntentHandler,
        AskForOrderConfirmationHandler,
        ConfirmOrderHandler,
        MenuIntentHandler,
        DishOfTodayIntentHandler,
        GuestFilterIntentHandler,
        RecommendationIntentHandler,
        HelpIntentHandler,
        FallbackIntentHandler,
        CancelReservationHandler,
        SessionEndedRequestHandler,
        CancelOrderHandler,
        IntuitiveOrderIntentHandler,
        IntentReflectorHandler,
    )
    .addErrorHandlers(ErrorHandler)
    .withApiClient(new Alexa.DefaultApiClient())
    .withCustomUserAgent('sample/basic-fact/v2')
    .lambda();