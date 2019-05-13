package com.doctor_achen;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.zxcpoiu.incallmanager.InCallManagerPackage;
import com.imagepicker.ImagePickerPackage;
import com.christopherdro.htmltopdf.RNHTMLtoPDFPackage;
import io.underscope.react.fbak.RNAccountKitPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import org.pgsqlite.SQLitePluginPackage;
import com.oney.WebRTCModule.WebRTCModulePackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RNFetchBlobPackage(),
          new VectorIconsPackage(),
          new WebRTCModulePackage(),
          new InCallManagerPackage(), 
          new ImagePickerPackage(), 
          new SQLitePluginPackage(),  
          new RNHTMLtoPDFPackage(),
          new RNAccountKitPackage(),
          new RNGestureHandlerPackage(),
          new RNFirebasePackage(),
          new RNFirebaseNotificationsPackage(),
          new RNFirebaseMessagingPackage(),
          new AsyncStoragePackage(),
          new ActivityStarterReactPackage(),
          new DummyPackageName()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
