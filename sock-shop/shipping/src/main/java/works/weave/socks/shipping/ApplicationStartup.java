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

package works.weave.socks.shipping;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import pt.unl.fct.miei.usmanagement.manager.ApiException;
import pt.unl.fct.miei.usmanagement.manager.api.EndpointsApi;

import java.util.concurrent.TimeUnit;

@Component
public class ApplicationStartup implements ApplicationListener<ApplicationReadyEvent> {

	/**
	 * This event is executed as late as conceivably possible to indicate that the
	 * application is ready to service requests.
	 */
	@Override
	public void onApplicationEvent(final ApplicationReadyEvent event) {
		registerEndpoint();
	}

	private void registerEndpoint() {
		EndpointsApi endpointsApi = new EndpointsApi();
		final int sleep = 5;
		final int retries = 5;
		for (int i = 0; i < retries; i++) {
			try {
				endpointsApi.registerEndpoint();
				break;
			}
			catch (ApiException e) {
				e.printStackTrace();
				System.out.println("Failed to register app, retrying in " + sleep + " seconds");
				Thread.sleep(TimeUnit.SECONDS.toMillis(sleep));
			}
		}
	}

}