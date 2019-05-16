import firebase from 'react-native-firebase';
import { NativeModules } from 'react-native';
import InCallManager from 'react-native-incall-manager';
import NavigaionService from './app/lib/NavigationService';
const activityStarter = NativeModules.ActivityStarter;

// Optional flow type
import type { RemoteMessage } from 'react-native-firebase';

export default async (message: RemoteMessage) => {
    // handle your message

    console.log(`Messages From Headless Background,`, message)

    const routeToVisit = { route: 'Home' };

    activityStarter.invokeApp({
        data: routeToVisit
    });

    const notification = new firebase.notifications.Notification()
        .setNotificationId(message.messageId)
        .setTitle(message.data.title)
        .setBody(message.data.body)
        // .setSubtitle("This is subtitle addeds!")
        .setSound("default")
        .setData({
            key1: 'value1',
            key2: 'value2',
        })
        .android.setChannelId("TripplePowered")
        .android.setPriority(firebase.notifications.Android.Priority.Max)
        .android.setVisibility(firebase.notifications.Android.Visibility.Public)

        try {
            
            InCallManager.startRingtone("incallmanager_ringtone.mp3");
            // setTimeout(() => {
            //     InCallManager.stopRingtone();
            //     console.log("clearing the RingTone Sound!");
            // }, 4000);
        } catch (error) {
            console.log("error for incallManager: ", error);
        }

        try {
            NavigaionService.navigate("AcceptPatientRequestPush");
        } catch (error) {
            console.log("navigate To a Service;; ");
        }

        
    // notification.android.setPriority(firebase.notifications.Android.Priority.Max);
    // notification.android.setVisibility(firebase.notifications.Android.Visibility.Public);

    firebase.notifications().displayNotification(notification);

    return Promise.resolve();
}