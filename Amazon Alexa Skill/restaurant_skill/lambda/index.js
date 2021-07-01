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
const APP_NAME = "My Thai Star Restaurant";
const messages = {
    NOTIFY_MISSING_PERMISSIONS: 'Bitte erlaube den Zugriff auf Profilinformationen in deiner Alexa App.',
    ERROR: 'Oh o, irgendwas ist schiefgelaufen.'
};

const FULL_NAME_PERMISSION = "alexa::profile:name:read";
const EMAIL_PERMISSION = "alexa::profile:email:read";
const MOBILE_PERMISSION = "alexa::profile:mobile_number:read";

var globalName = "Nicholas Klag";
var globalEmail = "nicholas.klag@gmx.de";

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

        const attributesManager = handlerInput.attributesManager;

        var sessionAttributes = attributesManager.getSessionAttributes();
        //sessionAttributes.orderState = 'STARTED';
        sessionAttributes.Orders = [];
        sessionAttributes.bookingToken = "";
        sessionAttributes.table = 0;


        var speakOutput = `Herzlich Willkommen zu My Thai Star. Gerne nehme Ich deine Bestellung auf. Falls du Hilfe benötigst, sage "Hilfe" `;
        sessionAttributes.OrdersOutput = " ";
        sessionAttributes.orderId = "";
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
// returns the dish of today that is defined by the waiter in the 'waiter cockpit' of my thai star
const DishOfTodayIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'DishOfToday';
    },
    async handle(handlerInput) {

        let speakOutput = "";
        let repromptOutput = " Möchtest du noch etwas anderes tun?";

        try {

            let serverResponse = await postHttp(server, "/mythaistar/services/rest/dishmanagement/v1/dish/search", JSON.stringify({
                categories: [],
                searchBy: "",
                pageable: {
                    pageSize: 50,
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

                speakOutput += " Etwas ist schiefgelaufen, frage das Personal nach Hilfe oder versuche es noch einmal."

            } else {
                let dishNum;
                for (let i = 0; i < dishes.length; i++)
                    dishNum = i;

                speakOutput += "Das Tagesgericht heute: " + dishes[dishNum].dish.name + " für nur " + dishes[dishNum].dish.price + "€ ";

            }

            handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(repromptOutput)

        } catch (error) {
            handlerInput.responseBuilder
                .speak(error + ' Entschuldige, es liegt ein technisches Problem vor. Versuche es noch einmal oder frage das Personal nach Hilfe.')
                .reprompt(repromptOutput)
        }


        return handlerInput.responseBuilder
            .getResponse();
    }
};

// orders the dish of today, if the user wants to.
const OrderDishOfTodayIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'OrderDishOfToday';
    },
    async handle(handlerInput) {

        let speakOutput = "";
        let repromptOutput = " Möchtest du noch etwas anderes tun?";
        
        //http response 
        try {

            let serverResponse = await postHttp(server, "/mythaistar/services/rest/dishmanagement/v1/dish/search", JSON.stringify({
                categories: [],
                searchBy: "",
                pageable: {
                    pageSize: 50,
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

                speakOutput += " Etwas ist schiefgelaufen, frage das Personal nach Hilfe oder versuche es noch einmal."

            } else {
                let dishNum;
                for (let i = 0; i < dishes.length; i++)
                    if (dishes[i].dish.isDishOfTheDay)
                        dishNum = i;


                sessionAttributes.Orders.push({
                    orderLine: {
                        dishId: dishNum,
                        amount: "",
                        comment: ""
                    },
                    extras: []
                });

                const attributesManager = handlerInput.attributesManager;
                var sessionAttributes = attributesManager.getSessionAttributes();
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
                speakOutput += "Das Tagesgericht  " + dishes[dishNum].dish.name + " wird bestellt " + " . Möchtest du noch etwas bestellen?";

            }

            handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(repromptOutput)

        } catch (error) {
            handlerInput.responseBuilder
                .speak(error + ' Entschuldige, es liegt ein technisches Problem vor. Versuche es noch einmal oder frage das Personal nach Hilfe.')
                .reprompt(repromptOutput)
        }


        return handlerInput.responseBuilder
            .getResponse();
    }
};
// returns the complete menu
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
                    pageSize: 50,
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
                .speak(error + ' Entschuldige, es liegt ein technisches Problem vor. Du kannst es noch einmal versuchen, oder das Personal um Hilfe fragen.')
                .reprompt(repromptOutput)
        }


        return handlerInput.responseBuilder
            .getResponse();
    }
};

//allows the guests to filter the menu by defined parameters like 'vegan'. Filters can be updated in the corresponding JSON File
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
                    pageSize: 50,
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

            speakOutput += "Du kannst das Tagesgericht nach Kategorien wie: vegetarisch, vegan oder curry Filtern. Weitere Filter kannst du auf unserer Website sehen."

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

// allows the guest to order dishes from my thai star. Extras and comments on the order are possible.
const OrderIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'OrderIntent';
    },
    handle(handlerInput) {
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
        if (extra === "extra curry")
            extraId = 1
        else
            extraId = 2;
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
            .getResponse();
    }
};

// this handler just asks the confirmation to an order
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

// this handler catches the confirmation to an order and send it to the backend of my thai star 
const ConfirmOrderHandler = {
    canHandle(handlerInput) {

        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConfirmOrderIntent';
    },
    async handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        var sessionAttributes = attributesManager.getSessionAttributes();
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;
        var hour = String(new Date().getHours());
        var g = parseInt(hour) + 2;
        hour = g.toString().padStart(2, '0');
        var minute = String(new Date().getMinutes());
        g = parseInt(minute) + 5;
        minute = g.toString().padStart(2, '0');
        let time = hour + ":" + minute + ":";
        
        // save slot values in variables
        var nameAttribute = sessionAttributes.profileName;

        var numberOfGuestsSlot = 2;
        let serverResponse = await postHttp(server, "/mythaistar/services/rest/bookingmanagement/v1/booking", JSON.stringify({
            booking: {
                bookingDate: today + "T" + time + "00.000Z",
                name: globalName,
                email: globalEmail,
                assistants: numberOfGuestsSlot
            }
        }));


        let responseObject = JSON.parse(serverResponse);
        let bookingToken = responseObject.bookingToken;

        sessionAttributes.bookingToken = bookingToken;
        var speakOutput = `Vielen Dank, deine Bestellung wurde erfolgreich aufgenommen. Also, ${sessionAttributes.nameAttribute}, habe noch einen schönen Tag und wir sehen uns dann bei My Thai Star.`;
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
                sessionAttributes.OrdersOutput += " ein " + dish + " mit " + extra + ", " + comment + ", ";
            } else {
                sessionAttributes.OrdersOutput += " " + amount + " " + dish + " mit " + extra + ", " + comment + ", ";
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

// triggered, if the user needs help. 
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = ' Für das aktuelle Tagesgericht, sage Tagesgericht. Du kannst dir auch das Menü vorlesen lassen oder das Menü nach Kategorien filtern lassen. Sage dazu einfach "Menü vorlesen" oder zum Beispiel "vegan Gerichte"? Um eine Bestellung aufzugeben: sage "Bestellung aufgeben".';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};




/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in a skill
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
            .getResponse();
    }
};

/**
 * error handling to capture any syntax or routing errors. If you receive an error
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
 * This handler acts as the entry point for the skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        OrderIntentHandler,
        AskForOrderConfirmationHandler,
        ConfirmOrderHandler,
        MenuIntentHandler,
        DishOfTodayIntentHandler,
        OrderDishOfTodayIntentHandler,
        GuestFilterIntentHandler,
        HelpIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        CancelOrderHandler,
        IntuitiveOrderIntentHandler,
        IntentReflectorHandler,
    )
    .addErrorHandlers(ErrorHandler)
    .withApiClient(new Alexa.DefaultApiClient())
    .withCustomUserAgent('sample/basic-fact/v2')
    .lambda();