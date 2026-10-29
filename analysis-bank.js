// Scenario questions restate facts from the course slides and instructor videos.
// Project-creation commands are supplementary practice, linked to official Expo docs.
export const ANALYSIS_SOURCES = {
  expoCreate: { name: 'Expo: Create a project · supplementary', url: 'https://docs.expo.dev/tutorial/create-your-first-app/' },
  expoStart: { name: 'Expo: Start developing · supplementary', url: 'https://docs.expo.dev/get-started/start-developing/' }
};

// topic | scenario | correct | three distractors | Thai reasoning | source | slide/time
const scenarios = [
  ['BLE','A battery-powered sensor sends a few bytes every minute. Which Bluetooth mode best fits the requirement?','Bluetooth Low Energy','Bluetooth Classic audio streaming','HDMI','Cellular data','BLE เหมาะกับการส่งข้อมูลขนาดเล็กโดยใช้พลังงานต่ำ','ble','4'],
  ['BLE','An app must stream audio continuously. Which mode is the better match in the lecture comparison?','Bluetooth Classic','Bluetooth Low Energy advertising','GATT descriptor','iBeacon','สไลด์เปรียบเทียบ Classic ว่าเหมาะกับข้อมูลต่อเนื่องอย่าง streaming','ble','4, 8–9'],
  ['BLE','A developer needs to find a value inside a BLE profile. Which path follows the hierarchy in the slides?','Profile → Service → Characteristic','Characteristic → Profile → Service','Service → Profile → Characteristic','Descriptor → Profile → Service','Profile ประกอบด้วย service และ service ประกอบด้วย characteristic','ble','16'],
  ['BLE','A device exposes heart-rate data and battery data as related groups. What should group each set of characteristics?','A service','A keystore','An APK','A Gradle task','Service ใช้รวม characteristic ที่มีหน้าที่เกี่ยวข้องกัน','ble','17'],
  ['BLE','A mobile app needs to retrieve the current value of a BLE characteristic once. Which property is relevant?','Read','Write','Notify','Prebuild','Read ใช้อ่านค่าปัจจุบันของ characteristic','ble','18'],
  ['BLE','A user changes a device setting from the app. Which characteristic property allows sending the new value?','Write','Read','Scan','Build','Write ใช้ส่งค่าใหม่ไปยัง characteristic','ble','18'],
  ['BLE','A sensor should push a fresh value to the connected app when it changes. Which property supports this?','Notify','Read only','Delete','Compile','Notify ใช้แจ้งค่าที่เปลี่ยนโดยไม่ต้องอ่านซ้ำทุกครั้ง','ble','15, 18'],
  ['BLE','The app needs extra information describing a characteristic value. Which GATT element provides it?','Descriptor','Keystore','Emulator','Build profile','Descriptor อธิบายข้อมูลเพิ่มเติมของค่า characteristic','ble','18'],
  ['BLE','A team defines a custom BLE service. Which UUID size is specified for custom services in the slide?','128-bit','16-bit','8-bit','4-bit','สไลด์ระบุ custom service ใช้ UUID แบบ 128 บิต','ble','19'],
  ['BLE','An app reads a standard Bluetooth profile UUID shown in the lecture. Which size should it expect?','16-bit','128-bit only','512-bit','4-bit','สไลด์แยก UUID มาตรฐานแบบ 16 บิตจากแบบ custom','ble','19'],
  ['BLE','A quiz compares BLE with Classic and asks for BLE radio channels in total. Which number matches the slide?','40','79','3','128','BLE มี 40 ช่อง ส่วน 3 ช่องเป็น primary advertising','ble','5–6'],
  ['BLE','A beacon starts advertising without a connection. How many primary advertising channels does BLE use?','3','40','79','16','BLE ใช้ 3 ช่องสำหรับ primary advertising','ble','6'],
  ['BLE','A phone scans and connects to a nearby BLE accessory. What role does the phone app usually take?','Central','Broadcaster','Descriptor','Keystore','ในตัวอย่างเชื่อมต่อ แอปบนโทรศัพท์เป็น central','ble','11–12'],
  ['BLE','A beacon sends information to any nearby listener without a connection. What is its role?','Broadcaster','Central','GATT descriptor','Gradle daemon','Broadcaster ส่ง advertisement ให้ observer แบบ connectionless','ble','11, 13'],
  ['BLE','Which example from the slides best fits a connectionless beacon use case?','iBeacon','Android Studio','Xcode','Gradle','สไลด์ยก iBeacon เป็นตัวอย่าง BLE แบบ connectionless','ble','13'],
  ['BLE code','A screen lists nearby accessories. Which call in the sample code begins finding them?','startDeviceScan','readCharacteristicForDevice','cancelDeviceConnection','setUpdateInterval','startDeviceScan เริ่มค้นหาอุปกรณ์ BLE ใกล้ตัว','code','11'],
  ['BLE code','The scanner sees the same device repeatedly. Why compare its ID before adding a row?','To prevent duplicate devices in the list','To sign an APK','To increase radio power','To create a service UUID','โค้ดตรวจ ID เพื่อไม่เพิ่มรายการอุปกรณ์เดิมซ้ำ','code','11'],
  ['BLE code','Connection succeeds, but the app has not listed the device data yet. What should it do before reading a characteristic?','Discover services and characteristics','Delete the device ID','Build a release APK','Disable Bluetooth permissions','ตัวอย่างเรียก discoverAllServicesAndCharacteristics หลังเชื่อมต่อ','code','12'],
  ['BLE code','A button must read a characteristic once using the sample manager. Which method fits?','readCharacteristicForDevice','monitorCharacteristicForDevice','startDeviceScan','cancelDeviceConnection','readCharacteristicForDevice อ่านค่า characteristic ตาม service และ device','code','13'],
  ['BLE code','A live dashboard needs repeated notifications from a characteristic. Which method fits?','monitorCharacteristicForDevice','readCharacteristicForDevice','startDeviceScan','isAvailableAsync','monitorCharacteristicForDevice ใช้ติดตามการแจ้งเตือนค่าที่เปลี่ยน','code','15'],
  ['BLE code','A command sent to the BLE device needs a write response. Which sample method is appropriate?','writeCharacteristicWithResponseForDevice','readCharacteristicForDevice','cancelDeviceConnection','setUpdateInterval','ตัวอย่างใช้ writeCharacteristicWithResponseForDevice เพื่อเขียนพร้อม response','code','14'],
  ['BLE code','Before writing text to a characteristic, what encoding does the sample use?','Base64','CSV','JPEG','MP3','โค้ดแปลงข้อความเป็น Base64 ก่อนเขียนค่า','code','14'],
  ['BLE code','A user taps Disconnect. Which sample method ends the BLE connection?','cancelDeviceConnection','discoverAllServicesAndCharacteristics','startDeviceScan','addListener','cancelDeviceConnection ใช้ตัดการเชื่อมต่อกับอุปกรณ์','code','16'],
  ['BLE code','The sample needs a JavaScript package to encode outgoing text. Which package is imported?','buffer','expo-location','expo-sqlite','react-native-maps','ตัวอย่างใช้ Buffer จากแพ็กเกจ buffer','code','6, 14'],

  ['Sensors','A phone reports changing x, y and z values while it is moved. Which sensor supplies acceleration data?','Accelerometer','Gyroscope','Bluetooth radio','Keystore','Accelerometer วัดความเร่งตามแกน x, y และ z','sensor','2'],
  ['Sensors','An app needs angular velocity during a turn. Which sensor should it read?','Gyroscope','Accelerometer only','BLE service','GPS latitude','Gyroscope วัดอัตราการหมุนหรือ angular velocity','sensor','3'],
  ['Sensors','A gyroscope callback returns a rotation rate. Which unit matches the slide?','Radians per second','Meters per second','Bytes per second','Volts','สไลด์ใช้หน่วย rad/s สำหรับอัตราการหมุน','sensor','3'],
  ['Sensors','A UI displays yaw as alpha. Around which axis does the slide place that rotation?','z axis','x axis','y axis','No axis','สไลด์ระบุ alpha หมุนรอบแกน z','sensor','4'],
  ['Sensors','A UI displays roll as beta. Around which axis does the slide place that rotation?','x axis','y axis','z axis','No axis','สไลด์ระบุ beta หมุนรอบแกน x','sensor','4'],
  ['Sensors','A UI displays pitch as gamma. Around which axis does the slide place that rotation?','y axis','x axis','z axis','No axis','สไลด์ระบุ gamma หมุนรอบแกน y','sensor','4'],
  ['Sensors','A motion feature combines linear and rotational measurements. Which sensor pair is discussed for six degrees of freedom?','Accelerometer and gyroscope','GPS and NFC','Camera and microphone','Screen and speaker','สไลด์เชื่อม accelerometer กับ gyroscope ใน 6 degrees of freedom','sensor','5'],
  ['Sensors','An Expo app imports both Accelerometer and Gyroscope. Which package contains them in the example?','expo-sensors','expo-sqlite','react-native-ble-plx','buffer','ตัวอย่าง import เซนเซอร์จาก expo-sensors','sensor','7, 19'],
  ['Sensors','The app must avoid offering a sensor feature on unsupported hardware. Which method checks availability first?','isAvailableAsync','setUpdateInterval','cancelDeviceConnection','eas login','isAvailableAsync ใช้ตรวจว่าอุปกรณ์มีเซนเซอร์นั้นหรือไม่','sensor','20'],
  ['Sensors','A sample calls setUpdateInterval(500). What interval does it request?','500 milliseconds','500 seconds','500 minutes','500 readings at once','ตัวเลข 500 ระบุช่วงเวลาอัปเดตเป็นมิลลิวินาที','sensor','21'],
  ['Sensors','A component needs a callback for each new sensor reading. Which method subscribes to updates?','addListener','isAvailableAsync','eas build:configure','cancelDeviceConnection','addListener สมัครรับข้อมูลเซนเซอร์ใหม่','sensor','21'],
  ['Sensors','After leaving a screen, readings keep arriving. What cleanup step from the sample prevents this?','Call remove on the subscription','Increase setUpdateInterval','Run Expo prebuild','Change the BLE UUID','ตัวอย่างเรียก remove เมื่อเลิกใช้งาน component','sensor','21'],
  ['Sensors','Which React hook in the sample starts listeners and returns their cleanup?','useEffect','useMemo only','useContext only','useReducer only','ตัวอย่างใช้ useEffect ติดตั้งและล้าง subscription','sensor','20–21'],
  ['Sensors','A phone lacks a sensor used by a card. Which UI state is shown in the example?','Not available on this device','APK signed','Bluetooth paired','GPS enabled','ตัวอย่างแสดงสถานะเมื่อเซนเซอร์ไม่พร้อมใช้งาน','sensor','13'],
  ['Sensors','A TypeScript value has numeric x, y and z fields. Which sample data shape does that describe?','SensorValues','EAS build profile','BLE descriptor','Android keystore','SensorValues เก็บค่า x, y, z เป็นตัวเลข','sensor','10'],
  ['Sensors','An app must distinguish turning the phone from translating it. Which sensor directly reports the turn rate?','Gyroscope','Accelerometer only','Bluetooth Classic','PATH variable','Gyroscope รายงาน angular velocity ส่วน accelerometer รายงานความเร่ง','sensor','2–3'],

  ['Android','A project needs native Android files before opening them in Android Studio. Which Expo operation creates them?','Prebuild','Notify','EAS login','Scan','Expo prebuild สร้างโฟลเดอร์ native Android','android','3:26'],
  ['Android','A developer wants to test without a physical Android phone. What should Android Studio provide?','An Android emulator','An iOS Simulator','A BLE characteristic','A keystore only','Android emulator เป็นอุปกรณ์จำลองสำหรับรันทดสอบ','android','0:00'],
  ['Android','An Expo project is ready to compile and run locally on Android. Which command is demonstrated?','npx expo run:android','npx expo run:ios','eas whoami','npm uninstall expo','คลิปสาธิต npx expo run:android สำหรับรัน native build','android','2:16'],
  ['Android','A connected Android phone must be selected explicitly for the local run. Which flag is added?','--device','--simulator-only','--ios','--no-java','คลิปใช้ --device เพื่อเลือกอุปกรณ์ Android จริง','android','12:37'],
  ['Android','The app runs as a development build and needs JavaScript served during development. What should run?','The development server','Only a signed APK','Only a BLE scanner','The iOS App Store','คลิป development build เริ่ม server สำหรับพัฒนา','cloud','8:04'],
  ['Android','A cloud Android build needs profile settings. Which project file stores them?','eas.json','index.html','robots.txt','package.pdf','eas.json เก็บ EAS build profiles','cloud','6:25'],
  ['Android','A release build needs proof that the Android package belongs to the developer. What is used to sign it?','A keystore','A gyroscope','A BLE descriptor','A simulator screenshot','Keystore ใช้ลงนามแอป Android','cloud','4:33'],
  ['Android','A tester needs an installable package from the demonstrated Android build. Which extension should they look for?','.apk','.ipa','.app','.csv','คลิปแสดง APK สำหรับติดตั้งบน Android','cloud','20:22'],
  ['Android','Android Studio starts the native build workflow. Which build system compiles that project?','Gradle','GATT','Expo Sensors','iBeacon','คลิปอธิบาย Gradle ในกระบวนการ build Android','android','4:52'],

  ['iOS','A Mac developer wants a virtual iPhone for testing. Which environment should be opened?','iOS Simulator','Android Emulator','BLE observer','EAS keystore','iOS Simulator จำลอง iPhone บน Mac','ios','0:06'],
  ['iOS','A cloud build is intended only for an iOS Simulator. Which output format is discussed?','.app','.ipa','.apk','.exe','คลิปแยก .app สำหรับ simulator','sim','0:47'],
  ['iOS','A build must be installed on a real iPhone. Which package format is discussed?','.ipa','.app','.apk','.jar','คลิปแยก .ipa สำหรับเครื่อง iOS จริง','sim','0:47'],
  ['iOS','The standalone Xcode build should not rely on a development server. Which configuration does the video choose?','Release','Debug','Bluetooth Notify','Development only','คลิปเปลี่ยน Build Configuration จาก Debug เป็น Release','release','1:11'],
  ['iOS','Before building in Xcode, a developer chooses the destination device. What does this control?','Where the app is built and run','The BLE service UUID','The npm registry','The Android keystore','การเลือก target ระบุอุปกรณ์ที่จะ build และ run','release','0:41'],
  ['iOS','Which IDE is used for the local iOS release workflow shown in class?','Xcode','Android Studio only','Gradle only','Notepad','คลิปใช้ Xcode สำหรับงาน build iOS','release','0:17'],
  ['iOS','An Expo app needs a local iOS simulator development build. Which command is shown?','npx expo run:ios','npx expo run:android','eas whoami','npm install buffer','คลิปสาธิต npx expo run:ios','ios','6:26'],
  ['iOS','An iOS development build is waiting for JavaScript changes. Which supporting process is needed?','A development server','Only an archived IPA','An Android emulator','A BLE beacon','โหมดพัฒนายังต้องใช้ server สำหรับส่ง JavaScript','ios','8:41'],
  ['iOS','An app is run on a connected iPhone rather than only the simulator. Which option prompts for a device?','--device','--apk','--gradle','--ble','คลิปใช้ --device เพื่อเลือกอุปกรณ์ iOS','ios','6:26'],

  ['Environment','A terminal says a tool is not recognized even though it is installed. Which variable is most relevant?','PATH','SensorValues','GATT','Build Configuration','PATH บอก shell ว่าจะค้นหา executable ที่ใด','env','1:04'],
  ['Environment','A Java-based Android tool cannot find the JDK. Which variable can point to the Java installation?','JAVA_HOME','BLE_UUID','EXPO_COLOR','APP_ICON','JAVA_HOME ชี้ไปยังตำแหน่งติดตั้ง Java','env','15:29'],
  ['Environment','A team uses terminal commands to work with Expo Application Services. Which tool provides them?','EAS CLI','Gyroscope','GATT','iOS Simulator','EAS CLI ใช้สั่งบริการ EAS จาก terminal','cloud','0:19'],
  ['Environment','After installing a CLI, why run a simple command from the terminal before building?','To verify the executable is available','To change sensor units','To pair Bluetooth automatically','To increase screen brightness','คลิปตรวจว่าระบบเรียกคำสั่ง EAS CLI ได้','cloud','0:37'],
  ['Environment','A developer wants to confirm which EAS account is currently authenticated. Which command is shown?','eas whoami','eas build:configure','npm start','npx expo prebuild','eas whoami แสดงบัญชี EAS ที่กำลังเข้าสู่ระบบ','cloud','1:42'],
  ['Environment','A Mac terminal needs to print environment variables as demonstrated. Which command is used?','env','eas init','adb devices','npm start','คลิปแสดงการใช้ env เพื่อดู environment variables','mac','0:26']
];

export const ANALYSIS_QUESTIONS = scenarios.map((r, i) => ({
  id: `a${i}`, topic: r[0], question: r[1], correct: r[2], wrong: r.slice(3, 6),
  explanation: r[6], source: r[7], ref: r[8]
}));

const codeBlanks = [
  ['Fill the method that requests sensor updates every 500 ms.', 'Accelerometer.____(500);', 'setUpdateInterval', 'กำหนดช่วงเวลาการส่งข้อมูลจากเซนเซอร์เป็น 500 ms', 'sensor', '21'],
  ['Fill the method that checks whether the sensor exists on this device.', 'const ready = await Accelerometer.____();', 'isAvailableAsync', 'ตรวจความพร้อมของ accelerometer ก่อนสมัครรับข้อมูล', 'sensor', '20'],
  ['Fill the method that subscribes to new accelerometer readings.', 'const subscription = Accelerometer.____(reading => setData(reading));', 'addListener', 'addListener เพิ่ม callback รับค่าจากเซนเซอร์', 'sensor', '21'],
  ['Fill the cleanup method when the screen unmounts.', 'return () => subscription.____();', 'remove', 'remove ยกเลิก subscription เพื่อไม่ให้ listener ทำงานต่อ', 'sensor', '21'],
  ['Fill the BLE method that starts searching for nearby devices.', 'manager.____(null, null, (error, device) => { /* ... */ });', 'startDeviceScan', 'startDeviceScan ใช้ค้นหาอุปกรณ์ BLE', 'code', '11'],
  ['Fill the method called after connecting, before reading services.', 'await device.____();', 'discoverAllServicesAndCharacteristics', 'ต้องค้นหา services และ characteristics หลังเชื่อมต่อ', 'code', '12'],
  ['Fill the manager method that reads one characteristic value.', 'await manager.____(deviceId, serviceUUID, characteristicUUID);', 'readCharacteristicForDevice', 'เมธอดนี้อ่านค่า characteristic จาก device ที่ระบุ', 'code', '13'],
  ['Fill the manager method that listens for BLE value changes.', 'manager.____(deviceId, serviceUUID, characteristicUUID, callback);', 'monitorCharacteristicForDevice', 'เมธอดนี้ติดตาม notification ของ characteristic', 'code', '15'],
  ['Fill the manager method that disconnects the selected device.', 'await manager.____(deviceId);', 'cancelDeviceConnection', 'cancelDeviceConnection ยุติการเชื่อมต่อ BLE', 'code', '16'],
  ['Fill the text encoding name used before the BLE write.', "const payload = Buffer.from(message).toString('____');", 'base64', 'ตัวอย่างแปลงข้อความเป็น Base64 ก่อนส่งผ่าน BLE', 'code', '14'],
  ['Fill the method that writes a BLE characteristic and waits for a response.', 'await manager.____(deviceId, serviceUUID, characteristicUUID, payload);', 'writeCharacteristicWithResponseForDevice', 'ตัวอย่างใช้การเขียนแบบมี response', 'code', '14']
];

const commandPrompts = [
  ['Create an Expo React Native project named MyApp using the latest project creator.', 'npx create-expo-app@latest MyApp', 'สร้างโปรเจกต์ Expo/React Native ใหม่ชื่อ MyApp', 'expoCreate', 'Initialize an app', 'create'],
  ['Move the terminal into the newly created MyApp project directory.', 'cd MyApp', 'เข้าโฟลเดอร์โปรเจกต์ก่อนรันคำสั่งอื่น', 'expoCreate', 'Navigate to project', 'other'],
  ['Start the Expo development server using the Expo CLI.', 'npx expo start', 'เริ่ม development server ของ Expo', 'expoStart', 'Start a development server', 'other'],
  ['Generate native Android and iOS project directories for an Expo app.', 'npx expo prebuild', 'prebuild สร้างโฟลเดอร์ native รวมถึง android ที่เปิดใน Android Studio ได้', 'android', '3:26', 'android'],
  ['Compile and run the Expo app locally on Android.', 'npx expo run:android', 'ใช้ Android SDK/Android Studio สำหรับ native development build', 'android', '2:16', 'android'],
  ['Run the app on a selected connected Android device.', 'npx expo run:android --device', 'เพิ่ม --device เพื่อเลือกเครื่อง Android ที่ต่อไว้', 'android', '12:37', 'android'],
  ['Install the Expo sensor package used by the lecture example.', 'npm install expo-sensors', 'ติดตั้งแพ็กเกจเซนเซอร์ตามสไลด์', 'sensor', '7', 'other'],
  ['Install the BLE library used by the lecture example.', 'npm install react-native-ble-plx', 'ติดตั้งไลบรารี BLE ตามสไลด์ตัวอย่าง', 'code', '6', 'other'],
  ['Install EAS CLI globally using npm.', 'npm install -g eas-cli', 'ติดตั้งเครื่องมือ EAS สำหรับงาน build', 'cloud', '0:19', 'build'],
  ['Configure EAS Build for the current project.', 'eas build:configure', 'สร้างการตั้งค่า EAS Build', 'cloud', '5:21', 'build'],
  ['Log in to Expo Application Services using the EAS CLI.', 'eas login', 'เข้าสู่ระบบ EAS ก่อนทำงานกับบริการ', 'cloud', '1:54', 'build'],
  ['Check which EAS account is currently authenticated.', 'eas whoami', 'แสดงบัญชี EAS ที่ล็อกอินอยู่', 'cloud', '1:42', 'other'],
  ['Run the Expo app locally on an iOS simulator.', 'npx expo run:ios', 'สั่ง native development build บน iOS simulator', 'ios', '6:26', 'other']
];

export const ANALYSIS_SHORT = [
  ...codeBlanks.map((r, i) => ({ id: `ac${i}`, topic: 'Code completion', kind: 'code', question: r[0], snippet: r[1], correct: r[2], explanation: r[3], source: r[4], ref: r[5] })),
  ...commandPrompts.map((r, i) => ({ id: `as${i}`, topic: 'Commands', kind: 'command', question: r[0], correct: r[1], explanation: r[2], source: r[3], ref: r[4], category: r[5] }))
];
