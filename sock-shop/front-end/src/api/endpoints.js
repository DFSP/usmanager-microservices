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

        module.catalogueUrl = async function () {
            return await getServiceEndpoint("catalogue")
        }
        module.catalogueTagsUrl = async function () {
            return `${await getServiceEndpoint("catalogue")}/tags`
        }
        module.cartsUrl = async function () {
            return `${await getServiceEndpoint("carts")}/carts`
        }
        module.ordersUrl = async function () {
            return await getServiceEndpoint("orders")
        }
        module.userCustomersUrl = async function () {
            return `${await getServiceEndpoint("user")}/customers`
        }
        module.userAddressesUrl = async function () {
            return `${await getServiceEndpoint("user")}/addresses`
        }
        module.userCardsUrl = async function () {
            return `${await getServiceEndpoint("user")}/cards`
        }
        module.userLoginUrl = async function () {
            return `${await getServiceEndpoint("user")}/login`
        }
        module.userRegisterUrl = async function () {
            return `${await getServiceEndpoint("user")}/register`
        }

        return module;
    }

   /* function getServiceEndpointSync(service) {
        try {
            var res = request('GET', `http://localhost:1906/api/services/SOCK-SHOP-${service}/endpoint`);
            console.log(res)
            if (res.statusCode !== 200) {
                console.error("Request service endpoint error: " + res.message);
            }
            else {
                const resData = JSON.parse(res.getBody('utf8'));
                return resData.endpoint
            }
        } catch (error) {
            console.error("Request service endpoint error: " + error);
            return ''
        }
    }*/

    async function getServiceEndpoint(service) {
        try {
            const url = `http://localhost:1906/api/services/sock-shop-${service}/endpoint`;
            console.log(`GET ${url}`);
            const response = await axios.get(url);
            const data = response.data;
            const endpoint = data.endpoint;
            console.log(`Response: ${endpoint}`);
            return endpoint;
        } catch (error) {
            console.error("Request service endpoint error: " + error);
            throw error
        }
    }

}());
