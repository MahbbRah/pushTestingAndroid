import firebase from 'react-native-firebase';
import { NativeModules } from 'react-native';
const activityStarter = NativeModules.ActivityStarter;

// Optional flow type
import type { RemoteMessage } from 'react-native-firebase';

export default async (message: RemoteMessage) => {
    // handle your message

    console.log(`Messages From Headless Background,`, message)

    const routeToVisit = { route: 'Home' };

    // activityStarter.navigateToExample();
    // activityStarter.callJavaScript();
    activityStarter.invokeApp({
        data: routeToVisit
    });

    return Promise.resolve();
}