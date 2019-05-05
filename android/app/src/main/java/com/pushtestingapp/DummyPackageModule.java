package com.pushtestingapp;

import android.content.Intent;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.util.Map;
import java.util.HashMap;

public class DummyPackageModule extends ReactContextBaseJavaModule {
    private static Boolean isOn = false;
    public DummyPackageModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void getStatus(Callback successCallback) {
        successCallback.invoke(null, isOn);
    }

    @ReactMethod
    public void turnOn() {
        isOn = true;
        System.out.println("Bulb is turn ON");
    }

    @ReactMethod
    public void turnOff() {
        isOn = false;
        System.out.println("Bulb is turn OFF");
    }

    @ReactMethod
    public String ShowMessage(String message) {
        // System.out.println("Hi this is Mahbub" + message);
        return "Your name is: "+ message;
    }

    @Override
    public String getName() {
        return "Bulb";
    }

}