import AsyncStorage from "@react-native-community/async-storage";

export const fetch_notes = async () => {
    try {
        const data = JSON.parse(await AsyncStorage.getItem("data"));
        if (data != null) {
            return data;
        }else {
            return () => {};
        }
    }catch (error) {
        alert(error);
    }
}
