/*
 * MIT License
 *
 * Copyright (c) 2020 manager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function () {
    'use strict';

    const async = require("async"),
        express = require("express"),
        request = require("request"),
        endpoints = require("../endpoints")(),
        helpers = require("../../helpers"),
        app = express();

    app.get("/orders", function (req, res, next) {
        console.log("Request received with body: " + JSON.stringify(req.body));
        const loggedIn = req.cookies.loggedIn;
        if (!loggedIn) {
            throw new Error("User not logged in.");
        }

        const customerId = req.session.customerId;
        async.waterfall([
                async function (callback) {
                    const url = `${await endpoints.ordersUrl()}/orders/search/customerId?sort=date&customerId=${customerId}`
                    request(url, function (error, response, body) {
                        if (error) {
                            return callback(error);
                        }
                        console.log("Received response: " + JSON.stringify(body));
                        if (response.statusCode === 404) {
                            console.log("No orders found for user: " + customerId);
                            return callback(null, []);
                        }
                        callback(null, JSON.parse(body)._embedded.customerOrders);
                    });
                }
            ],
            function (err, result) {
                if (err) {
                    return next(err);
                }
                helpers.respondStatusBody(res, 201, JSON.stringify(result));
            });
    });

    app.get("/orders/*", async function (req, res, next) {
        const url = await endpoints.ordersUrl() + req.url.toString();
        request.get(url).pipe(res);
    });

    app.post("/orders", function (req, res, next) {
        console.log("Request received with body: " + JSON.stringify(req.body));
        const loggedIn = req.cookies.loggedIn;
        if (!loggedIn) {
            throw new Error("User not logged in.");
        }

        const customerId = req.session.customerId;

        async.waterfall([
                async function (callback) {
                    const url = `${await endpoints.userCustomersUrl()}/${customerId}`;
                    request(url, async function (error, response, body) {
                        if (error || body.status_code === 500) {
                            callback(error);
                            return;
                        }
                        console.log("Received response: " + JSON.stringify(body));
                        const jsonBody = JSON.parse(body);
                        //var customerlink = jsonBody._links.customer.href;
                        //var addressLink = jsonBody._links.addresses.href;
                        //var cardLink = jsonBody._links.cards.href;
                        const addressLink = url + "/addresses";
                        const cardLink = url + "/cards";
                        const order = {
                            "customer": url,
                            "address": null,
                            "card": null,
                            "items": `${await endpoints.cartsUrl()}/${customerId}/items`
                        };
                        callback(null, order, addressLink, cardLink);
                    });
                },
                function (order, addressLink, cardLink, callback) {
                    async.parallel([
                        function (callback) {
                            console.log("GET Request to: " + addressLink);
                            request.get(addressLink, async function (error, response, body) {
                                if (error) {
                                    callback(error);
                                    return;
                                }
                                console.log("Received response: " + JSON.stringify(body));
                                const jsonBody = JSON.parse(body);
                                if (jsonBody.status_code !== 500 && jsonBody._embedded.address[0] != null) {
                                    order.address = `${await endpoints.userAddressesUrl()}/${jsonBody._embedded.address[0].id}`;
                                }
                                callback();
                            });
                        },
                        function (callback) {
                            console.log("GET Request to: " + cardLink);
                            request.get(cardLink, async function (error, response, body) {
                                if (error) {
                                    callback(error);
                                    return;
                                }
                                console.log("Received response: " + JSON.stringify(body));
                                const jsonBody = JSON.parse(body);
                                if (jsonBody.status_code !== 500 && jsonBody._embedded.card[0] != null) {
                                    order.card = `${await endpoints.userCardsUrl()}/${jsonBody._embedded.card[0].id}`;
                                }
                                callback();
                            });
                        }
                    ], function (err, result) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        console.log(result);
                        callback(null, order);
                    });
                },
                async function (order, callback) {
                    const options = {
                        uri: `${await endpoints.ordersUrl()}/orders`,
                        method: 'POST',
                        json: true,
                        body: order
                    };
                    console.log("Posting Order: " + JSON.stringify(order));
                    request(options, function (error, response, body) {
                        if (error) {
                            return callback(error);
                        }
                        console.log("Order response: " + JSON.stringify(response));
                        console.log("Response body: " + JSON.stringify(body));
                        callback(null, response.statusCode, body);
                    });
                }
            ],
            function (err, status, result) {
                if (err) {
                    return next(err);
                }
                helpers.respondStatusBody(res, status, JSON.stringify(result));
            });
    });

    module.exports = app;
}());
