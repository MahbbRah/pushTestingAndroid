package com.pushtestingapp;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.app.ActivityManager;
import android.app.KeyguardManager;

import android.content.Context;
import android.os.Bundle;
import android.os.PowerManager;

import android.net.Uri;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.CatalystInstance;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.Arguments;

import com.facebook.react.bridge.ReadableMap;

import java.util.HashMap;
import java.util.Map;
import android.util.Log;
import android.widget.Toast;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
/**
 * Expose Java to JavaScript. Methods annotated with {@link ReactMethod} are exposed.
 */
class ActivityStarterModule extends ReactContextBaseJavaModule {
    private static DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter = null;
    ReactApplicationContext reactContext;
    private static Bundle bundle = null;
    public static final String LOG_TAG = "onMessageResponse";

    private KeyguardManager.KeyguardLock lock;
    private PowerManager.WakeLock wakeLock;

    ActivityStarterModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public void initialize() {
        super.initialize();
        eventEmitter = getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
    }
    /**
    * @return the name of this module. This will be the name used to {@code require()} this module
    * from JavaScript.
    */
    @Override
    public String getName() {
    return "ActivityStarter";
    }


    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("MyEventName", "MyEventValue");
        return constants;
    }


    // private void initWakeLock(String ) {
    //     PowerManager pwm = (PowerManager) reactContext.getSystemService(Context.POWER_SERVICE);
    //     wakeLock = pwm.newWakeLock(PowerManager.FULL_WAKE_LOCK, className);
    //     wakeLock.acquire();
    //     wakeLock.release();
        
    //     KeyguardManager keyguardManager = (KeyguardManager) reactContext.getSystemService(Context.KEYGUARD_SERVICE);
    //     lock = keyguardManager.newKeyguardLock(className);
    //     lock.disableKeyguard();
    // }


    @ReactMethod
    public void invokeApp(ReadableMap params) {

        ReadableMap data = params.hasKey("data") ? params.getMap("data") : null;

        if (data != null) {
            bundle = Arguments.toBundle(data);
        }

        try {

            String packageName = reactContext.getPackageName();
            Intent launchIntent = reactContext.getPackageManager().getLaunchIntentForPackage(packageName);
            String className = launchIntent.getComponent().getClassName();

            PowerManager pwm = (PowerManager) reactContext.getSystemService(Context.POWER_SERVICE);
            wakeLock = pwm.newWakeLock(PowerManager.FULL_WAKE_LOCK, className);
            wakeLock.acquire();
            wakeLock.release();
            
            KeyguardManager keyguardManager = (KeyguardManager) reactContext.getSystemService(Context.KEYGUARD_SERVICE);
            lock = keyguardManager.newKeyguardLock(className);
            lock.disableKeyguard();

            Class<?> activityClass = Class.forName(className);
            Intent activityIntent = new Intent(reactContext, activityClass);

            activityIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);

            reactContext.startActivity(activityIntent);
            // Toast.makeText(getReactApplicationContext(),"Event recevied for Firebase data",Toast.LENGTH_SHORT).show();
        } catch(Exception e) {
            Log.e(LOG_TAG, "Class not found", e);
            return;
        }
    }

    @ReactMethod
    void getActivityName(@Nonnull Callback callback) {
        
        Activity activity = getCurrentActivity();
        if (activity != null) {
        callback.invoke(activity.getClass().getSimpleName());
        } else {
        callback.invoke("No current activity");
        }
    }

    @ReactMethod
        void getActivityNameAsPromise(@Nonnull Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            promise.resolve(activity.getClass().getSimpleName());
        } else {
            promise.reject("NO_ACTIVITY", "No current activity");
        }
    }

    @ReactMethod
    void callJavaScript() {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            MainApplication application = (MainApplication) activity.getApplication();
            ReactNativeHost reactNativeHost = application.getReactNativeHost();
            ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
            ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
            if (reactContext != null) {
                CatalystInstance catalystInstance = reactContext.getCatalystInstance();
                WritableNativeArray params = new WritableNativeArray();
                params.pushString("Hello, JavaScript!");
                catalystInstance.callFunction("JavaScriptVisibleToJava", "alert", params);
                }
        }
    }
    /**
    * To pass an object instead of a simple string, create a {@link WritableNativeMap} and populate it.
    */
    static void triggerAlert(@Nonnull String message) {
    eventEmitter.emit("MyEventValue", message);
    }
}