#  MIT License
#
#  Copyright (c) 2020 manager
#
#  Permission is hereby granted, free of charge, to any person obtaining a copy
#  of this software and associated documentation files (the "Software"), to deal
#  in the Software without restriction, including without limitation the rights
#  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
#  copies of the Software, and to permit persons to whom the Software is
#  furnished to do so, subject to the following conditions:
#
#  The above copyright notice and this permission notice shall be included in all
#  copies or substantial portions of the Software.
#
#  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
#  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
#  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
#  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
#  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
#  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
#  SOFTWARE.

from flask import Flask, jsonify, make_response, request

app = Flask(__name__)


def get_data(customer_id, address_id="57a98d98e4b00679b4a830b3", card_id="57a98d98e4b00679b4a830b4"):
	customers = {
		"firstName": "User1",
		"lastName": "Name1",
		"email": "",
		"username": "user1",
		"addresses": [
			{
				"street": "Maes-Y-Deri",
				"number": "4",
				"country": "United Kingdom",
				"city": "Aberdare",
				"postcode": "CF44 6TF",
				"id": address_id,
				"_links": {
					"address": {
						"href": "http://user/addresses/" + address_id
					},
					"self": {
						"href": "http://user/addresses/" + address_id
					}
				}
			}
		],
		"cards": [
			{
				"longNum": "0908415193175205",
				"expires": "08/19",
				"ccv": "280",
				"id": card_id,
				"_links": {
					"card": {
						"href": "http://user/cards/" + card_id
					},
					"self": {
						"href": "http://user/cards/" + card_id
					}
				}
			}
		],
		"id": customer_id,
		"_links": {
			"addresses": {
				"href": "http://user/customers/57a98d98e4b00679b4a830b5/addresses"
			},
			"cards": {
				"href": "http://user/customers/57a98d98e4b00679b4a830b5/cards"
			},
			"customer": {
				"href": "http://user/customers/" + customer_id
			},
			"self": {
				"href": "http://user/customers/" + customer_id
			}
		}
	}

	customer_cards = {
		"_embedded": {
			"card": [
				{
					"longNum": "0908415193175205",
					"expires": "08/19",
					"ccv": "280",
					"id": card_id,
					"_links": {
						"card": {
							"href": "http://user/cards/" + card_id
						},
						"self": {
							"href": "http://user/cards/" + card_id
						}
					}
				}
			]
		}
	}

	customer_addresses = {
		"_embedded": {
			"address": [
				{
					"street": "Maes-Y-Deri",
					"number": "4",
					"country": "United Kingdom",
					"city": "Aberdare",
					"postcode": "CF44 6TF",
					"id": address_id,
					"_links": {
						"address": {
							"href": "http://user/addresses/" + address_id
						},
						"self": {
							"href": "http://user/addresses/" + address_id
						}
					}
				}
			]
		}
	}
	return customers, customer_cards, customer_addresses


@app.route('/customers/<custid>')
def api_cusutomers(custid):
	resp = make_response(jsonify(get_data(custid)[0]))
	resp.headers['Content-Type'] = 'application/hal+json'
	return resp


@app.route('/cards/<cardid>')
def api_cards(cardid):
	resp = make_response(jsonify(get_data("", card_id=cardid)[0].get("cards")[0]))
	resp.headers['Content-Type'] = 'application/hal+json'
	return resp


@app.route('/addresses/<addressid>')
def api_addresses(addressid):
	resp = make_response(jsonify(get_data("", address_id=addressid)[0].get("addresses")[0]))
	resp.headers['Content-Type'] = 'application/hal+json'
	return resp


@app.route('/carts/<custid>')
def api_carts(custid):
	resp = make_response(jsonify({
		"id": custid
	}))
	resp.headers['Content-Type'] = 'application/hal+json'
	return resp


@app.route('/carts/<custid>/items')
def api_carts_items(custid):
	resp = make_response(jsonify(
		[{
			"id": custid,
			"quantity": 10,
			"unitPrice": 1.99,
			"itemId": "abc123"
		}]))
	resp.headers['Content-Type'] = 'application/json'
	return resp


@app.route('/paymentAuth', methods=['POST'])
def api_payment_auth():
	resp = make_response(jsonify(
		{
			"authorised": True
		}))
	resp.headers['Content-Type'] = 'application/json'
	return resp


@app.route('/shipping', methods=['POST'])
def api_shipping():
	req = request.get_json()
	app.logger.debug(req)
	resp = make_response(jsonify(req))
	resp.headers['Content-Type'] = 'application/json'
	return resp
