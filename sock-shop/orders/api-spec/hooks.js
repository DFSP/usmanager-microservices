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

const hooks = require('hooks');
const {MongoClient} = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

let db;

const address = [
    {
        "_id": ObjectID("579f21ae98684924944651bd"),
        "_class": "works.weave.socks.users.entities.Address",
        "number": "69",
        "street": "Wilson Street",
        "city": "Hartlepool",
        "postcode": "TS26 8JU",
        "country": "United Kingdom"
    },
    {
        "_id": ObjectID("579f21ae98684924944651c0"),
        "_class": "works.weave.socks.users.entities.Address",
        "number": "122",
        "street": "Radstone WayNet",
        "city": "Northampton",
        "postcode": "NN2 8NT",
        "country": "United Kingdom"
    },
    {
        "_id": ObjectID("579f21ae98684924944651c3"),
        "_class": "works.weave.socks.users.entities.Address",
        "number": "3",
        "street": "Radstone Way",
        "city": "Northampton",
        "postcode": "NN2 8NT",
        "country": "United Kingdom"
    }
];


const card = [
    {
        "_id": ObjectID("579f21ae98684924944651be"),
        "_class": "works.weave.socks.users.entities.Card",
        "longNum": "8575776807334952",
        "expires": "08/19",
        "ccv": "014"
    },
    {
        "_id": ObjectID("579f21ae98684924944651c1"),
        "_class": "works.weave.socks.users.entities.Card",
        "longNum": "8918468841895184",
        "expires": "08/19",
        "ccv": "597"
    },
    {
        "_id": ObjectID("579f21ae98684924944651c4"),
        "_class": "works.weave.socks.users.entities.Card",
        "longNum": "6426429851404909",
        "expires": "08/19",
        "ccv": "381"
    }
];

const cart = [
    {
        "_id": ObjectID("579f21de98689ebf2bf1cd2f"),
        "_class": "works.weave.socks.cart.entities.Cart",
        "customerId": "579f21ae98684924944651bf",
        "items": [{"$ref": "item", "$id": ObjectID("579f227698689ebf2bf1cd31")}, {
            "$ref": "item",
            "$id": ObjectID("579f22ac98689ebf2bf1cd32")
        }]
    },
    {
        "_id": ObjectID("579f21e298689ebf2bf1cd30"),
        "_class": "works.weave.socks.cart.entities.Cart",
        "customerId": "579f21ae98684924944651bfaa",
        "items": []
    }
];


const item = [
    {
        "_id": ObjectID("579f227698689ebf2bf1cd31"),
        "_class": "works.weave.socks.cart.entities.Item",
        "itemId": "819e1fbf-8b7e-4f6d-811f-693534916a8b",
        "quantity": 20,
        "unitPrice": 99.0
    }
];


const customer = [
    {
        "_id": "579f21ae98684924944651bf",
        "_class": "works.weave.socks.users.entities.Customer",
        "firstName": "Eve",
        "lastName": "Berger",
        "username": "Eve_Berger",
        "addresses": [{"$ref": "address", "$id": ObjectID("579f21ae98684924944651bd")}],
        "cards": [{"$ref": "card", "$id": ObjectID("579f21ae98684924944651be")}]
    },
    {
        "_id": "579f21ae98684924944651c2",
        "_class": "works.weave.socks.users.entities.Customer",
        "firstName": "User",
        "lastName": "Name",
        "username": "user",
        "addresses": [{"$ref": "address", "$id": ObjectID("579f21ae98684924944651c0")}],
        "cards": [{"$ref": "card", "$id": ObjectID("579f21ae98684924944651c1")}]
    },
    {
        "_id": "579f21ae98684924944651c5",
        "_class": "works.weave.socks.users.entities.Customer",
        "firstName": "User1",
        "lastName": "Name1",
        "username": "user1",
        "addresses": [{"$ref": "address", "$id": ObjectID("579f21ae98684924944651c3")}],
        "cards": [{"$ref": "card", "$id": ObjectID("579f21ae98684924944651c4")}]
    }
];


// Setup database connection before Dredd starts testing
hooks.beforeAll((transactions, done) => {
    var MongoEndpoint = process.env.MONGO_ENDPOINT || 'mongodb://localhost:32769/data';
    MongoClient.connect(MongoEndpoint, function (err, conn) {
        if (err) {
            console.error(err);
        }
        db = conn;
        done(err);
    });
});

// Close database connection after Dredd finishes testing
hooks.afterAll((transactions, done) => {
    db.dropDatabase();
    done();

});

hooks.beforeEach((transaction, done) => {
    db.dropDatabase(function (s, r) {
        var promisesToKeep = [
            db.collection('customer').insertMany(customer),
            db.collection('card').insertMany(card),
            db.collection('cart').insertMany(cart),
            db.collection('address').insertMany(address),
            db.collection('item').insertMany(item)
        ];
        Promise.all(promisesToKeep).then(function (vls) {
            done();
        }, function (vls) {
            console.error(vls);
            done();
        });
    })

});


hooks.before("/orders > POST", function (transaction, done) {
    transaction.request.headers['Content-Type'] = 'application/json';
    transaction.request.body = JSON.stringify(
        {
            "customer": "http://users-orders-mock:80/customers/57a98d98e4b00679b4a830af",
            "address": "http://users-orders-mock:80/addresses/57a98d98e4b00679b4a830ad",
            "card": "http://users-orders-mock:80/cards/57a98d98e4b00679b4a830ae",
            "items": "http://users-orders-mock:80/carts/579f21ae98684924944651bf/items"
        }
    );

    done()

});

hooks.before("/orders > GET", function (transaction, done) {
    transaction.request.headers["User-Agent"] = "curl/7.43.0";
    transaction.request.headers["Accept"] = "*/*";
    done();
})
