import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { socket } from '../socket';


export default function App() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false)

  const checkPermissions = async () => {
    if (!permission) return;

    if (permission.status !== "granted") {
      if (!permission.canAskAgain) {
        Alert.alert(
          "권한 필요",
          "앱 설정에서 카메라 권한을 변경해주세요.",
          [
            { text: "취소", style: "cancel" },
            {
              text: "설정 열기",
              onPress: () => {
                Linking.openSettings();
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        requestPermission();
      }

    }
  };

  const hasChecked = useRef(false);

  useEffect(() => {
    if (permission && !hasChecked.current) {
      hasChecked.current = true;
      checkPermissions();
    }
  }, [permission]);

  useEffect(() => {
    socket.on("bbox", (data) => {
      const base64Image = data.image ? data.image : data;
      setImage(base64Image)
    });
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });

      if (!photo) return;

      const data = {
        photo: photo.base64,
        width: photo.width
      }
      setPreviewVisible(true)
      socket.emit('image', data)
    }
  }

  const retakePictureHandler = () => {
    setPreviewVisible(false);
    setImage(null);
  };

  if (!permission) {
    return <View>
      <Text>hasCameraPermission is null</Text>
    </View>;
  }
  if (permission.status !== "granted") {
    return <View>
      <Text>카메라 권한을 허용해주세요.</Text>
    </View>;
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-start" }}>
      <View style={{ width: "100%", height: 200, backgroundColor: "black" }}>
        {previewVisible && <TouchableOpacity style={{ ...styles.button, backgroundColor: "red" }} onPress={retakePictureHandler} />}
      </View>
      <View>
        {previewVisible ? (
          <Image
            source={{ uri: image?.startsWith('data:image') ? image : `data:image/jpeg;base64,${image}` }}
            style={styles.camera}
            resizeMode="contain"
          />
        ) : (
          <CameraView style={styles.camera} ref={cameraRef} ratio={"1:1"} />
        )}
      </View>
      <View style={{ width: "100%", height: "100%", alignItems: "center", backgroundColor: "black" }}>
        {!previewVisible && <TouchableOpacity style={styles.button} onPress={takePicture} />}
      </View>
    </View>
  );
}

const { width: winWidth } = Dimensions.get('window');
const styles = StyleSheet.create({
  camera: {
    width: winWidth,
    height: winWidth,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    borderRadius: 40,
    backgroundColor: "gray",
    margin: 30
  }
})