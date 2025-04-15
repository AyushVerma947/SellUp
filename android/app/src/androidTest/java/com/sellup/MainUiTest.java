package com.sellup;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.UiObject;
import androidx.test.uiautomator.UiSelector;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import static org.junit.Assert.assertTrue;

@RunWith(AndroidJUnit4.class)
public class MainUiTest {

    private UiDevice device;

    @Before
    public void setUp() {
        device = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());
    }

    @Test
    public void testUiButtonClick() throws Exception {
        Thread.sleep(2000);

        UiObject button = device.findObject(new UiSelector().text("Click Me"));
        assertTrue("Button not found!", button.exists());
        button.click();

        Thread.sleep(1000);
        UiObject resultText = device.findObject(new UiSelector().textContains("Success"));
        assertTrue("Success message not found!", resultText.exists());
    }
}
