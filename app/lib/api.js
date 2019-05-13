import AsyncStorage from '@react-native-community/async-storage';

export default class API {
    async POST(url, payload){
        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                // 'authorization': await this._retrieveData('token')
            },
            body: JSON.stringify(payload)
        };

        const response = await fetch(url, options);

        return await response.json();
    }

    async PUT(url, payload){
        let options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'authorization': await this._retrieveData('token')
            },
            body: JSON.stringify(payload)
        };

        const response = await fetch(url, options);

        return await response.json();
    }

    async GET(url, query){
        let options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                // 'authorization': await this._retrieveData('token')
            }
        };

        query = JSON.stringify(query);
        url = url + '?filter=' + query;

        const response = await fetch(url, options);

        return await response.json();
    }

    // async copyDatabaseToStorage() {

    //     try {

    //         let documentDirectory = Expo.FileSystem.documentDirectory;

    //         // var expoAsset = await Expo.Asset.fromModule(require('../assets/db/drugDatabase.db'));
    //         var expoAsset = await Expo.Asset.fromModule(require('../assets/db/drugDatabase.db'));
    //         await expoAsset.downloadAsync()


    //         // let dirInfo = await Expo.FileSystem.getInfoAsync(documentdir + 'SQLite')
    //         let fileInfo = await Expo.FileSystem.getInfoAsync(documentDirectory + 'SQLite/drugDatabase.db')
    //         // .then((fileInfo) => console.log('Dir Info: ', fileInfo))
    //         // .catch( (dirReadingErr) => console.log('Dir Err: ', dirReadingErr))

    //         console.log(fileInfo);

    //         if (fileInfo.exists) {
    //             await Expo.FileSystem.copyAsync({ from: expoAsset.localUri, to: documentDirectory + 'SQLite/drugDatabase.db' })
    //                 .then((results) => console.log('success: ', results))
    //                 .catch((err) => alert('err: '+ err))
    //         } else {

    //             await Expo.FileSystem.makeDirectoryAsync(documentDirectory + 'SQLite')
    //                 .then((dirInfo) => console.log('created Dir: ', dirInfo))
    //                 .catch((dirReadingErr) => alert('Dir creating Err: '+ dirReadingErr))

    //             Expo.FileSystem.copyAsync({ from: expoAsset.localUri, to: documentDirectory + 'SQLite/drugDatabase.db' })
    //                 .then((results) => console.log('File Copied success: ', results))
    //                 .catch((err) => alert(' file copying err: '+ err))


    //         }

    //     } catch (error) {
    //         console.log('errors from catch block:', 'error');
    //     }
    // }

    _storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (err) {
            throw err;
        }
    }
    
    _retrieveData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            return value;
        } catch (err) {
            throw err;
        }
    }
    _removeItem = async (key) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (err) {
            throw err;
        }
    }

    formatUserName = (userName='') => {
        return userName.replace("|", " ");
    }

    formatDate(date) {

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        var hours = date.getHours();
        var minutes = date.getMinutes();
        //Hacks here to match the AM PM with server time. It's TEMP only
        // var ampm = hours >= 12 ? 'pm' : 'am';
        var ampm = hours <= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        var monthNumber = date.getMonth();
        return date.getDate() + " " + monthNames[monthNumber] + " " + date.getFullYear() + "  " + strTime;
    }
}