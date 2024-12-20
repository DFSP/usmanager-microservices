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

package works.weave.socks.cart.action;

import org.junit.Test;

import java.util.Arrays;
import java.util.Collections;

import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertThat;

public class UnitFirstResultOrDefault {
	@Test
	public void whenEmptyUsesDefault() {
		String defaultValue = "test";
		FirstResultOrDefault<String> CUT = new FirstResultOrDefault<>(Collections.emptyList(), () -> defaultValue);
		assertThat(CUT.get(), equalTo(defaultValue));
	}

	@Test
	public void whenNotEmptyUseFirst() {
		String testValue = "test";
		FirstResultOrDefault<String> CUT = new FirstResultOrDefault<>(Arrays.asList(testValue), () -> "nonDefault");
		assertThat(CUT.get(), equalTo(testValue));
	}

	@Test
	public void whenMultipleNotEmptyUseFirst() {
		String testValue = "test";
		FirstResultOrDefault<String> CUT = new FirstResultOrDefault<>(Arrays.asList(testValue, "test2"), () ->
			"nonDefault");
		assertThat(CUT.get(), equalTo(testValue));
	}
}
