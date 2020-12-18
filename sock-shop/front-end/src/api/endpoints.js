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

    const axios = require("axios");

    module.exports = function () {

        module.catalogueUrl = function () {
            return getServiceEndpointSync("CATALOGUE")
        }
        module.catalogueTagsUrl = function () {
            return `${getServiceEndpointSync("CATALOGUE")}/tags`
        }
        module.cartsUrl = function () {
            return `${getServiceEndpointSync("CARTS")}/carts`
        }
        module.ordersUrl = function () {
            return getServiceEndpointSync("ORDERS")
        }
        module.userCustomersUrl = function () {
            return `${getServiceEndpointSync("USER")}/customers`
        }
        module.userAddressesUrl = function () {
            return `${getServiceEndpointSync("USER")}/addresses`
        }
        module.userCardsUrl = function () {
            return `${getServiceEndpointSync("USER")}/cards`
        }
        module.userLoginUrl = function () {
            return `${getServiceEndpointSync("USER")}/login`
        }
        module.userRegisterUrl = function () {
            return `${getServiceEndpointSync("USER")}/register`
        }

        return module;
    }

    // TODO : change to the async version
    function getServiceEndpointSync(service) {
        try {
            var res = request('GET', `http://localhost:1906/api/services/SOCK-SHOP-${service}/endpoint`);
            const resData = JSON.parse(res.getBody('utf8'));
            return resData.endpoint
        } catch (error) {
            console.error("Request service endpoint error: " + error);
            return ''
        }
    }

    async function getServiceEndpoint(service) {
        try {
            const response = await axios.get(`http://localhost:1906/api/services/SOCK-SHOP-${service}/endpoint`);
            const data = response.data;
            return data.endpoint
        } catch (error) {
            console.error("Request service endpoint error: " + error);
            return ''
        }
    }

}());
