import { StyleSheet, TextInput,View, Text} from "react-native";
import Main from "../Component/Main";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Importez le type NativeStackNavigationProp

//const {height, width} = Dimensions.get('window');

export type RootFromProfile = {
  Profile: undefined;
};

export type LoginScreenProp = NativeStackNavigationProp<RootFromProfile>;


export default function Login() {
  const data = {
    user: "khalifa",
    password : "dione"
  }
   const [inputText, setInputText] = useState<{ [key: string]: string }>({});
   const [errorAuthe, setErrorAuthe] = useState("");
  
   const navigation = useNavigation<LoginScreenProp>();

   const handleChange = (name: string, value: string) => {
     setInputText((prevState) => ({
       ...prevState,
       [name]: value,
     }));
   };

   const handleSubmit = () => {
       // Récupérez les valeurs des champs de saisie
       const username = inputText.Username;
       const password1 = inputText.Password;
     
       // Vérifiez si le nom d'utilisateur et le mot de passe sont corrects
       if (username !== data.user || password1 !== data.password) {
           setErrorAuthe("Username ou mot de passe incorrect");
       } else {
           setErrorAuthe(""); // Réinitialisez le message d'erreur
           // Utilisez les valeurs comme vous le souhaitez
           console.log("Usernamennn :", username);
           console.log("Password1 :", password1);
          
          
       }
       handleConnect();
       
     };

     const handleConnect = () => {
      // Naviguez vers la page de ton profil (Profile) après la connexion réussie
      navigation.navigate('Profile');
     };
  

   return (
     <Main styles={style.disposition}>
       <View style={style.composantInput}>
         <TextInput
           keyboardType="default"
           onChangeText={(text) => handleChange('Username', text)}
           style={style.inputProp}
           placeholderTextColor="black"
           placeholder="Username"
           value={inputText.Username}
         />        
           <TextInput
           keyboardType="default" 
           secureTextEntry={true} // Texte masqué par des points
           onChangeText={(text) => handleChange('Password', text)}
           style={style.inputProp}
           placeholderTextColor="black"
           placeholder="Password"
           value={inputText.Password}
         />
         
         { //Executer que si identfiant ou mot de passe incorrect
           errorAuthe !== "" && <Text style={{ color: "red", fontSize: hp(2.2)}}>{errorAuthe}</Text>}
         
         <Text style={style.buttonLogin} onPress={handleSubmit}>Login</Text>
         <View style={{display: "flex", flexDirection: "row", gap: wp(40)}}>
            <Text  style={{ color: "#A3298B", fontSize: hp(2)}}>Create Account</Text>
            <Text style={{ color: "#A3298B", fontSize: hp(2)}}>Need Help</Text>
         </View>
         
       </View>
     </Main>
   );
}

const style = StyleSheet.create({
    composantInput: {
        borderLeftWidth: wp(2), 
        borderLeftColor: '#A3298B', 
        borderRightWidth: wp(2), 
        borderRightColor: '#A3298B',
        width: wp(95),
        alignItems: 'center',
        borderRadius: 25

    },
    disposition : {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: wp(30),
        backgroundColor: "white"
       
    },  
    
    inputProp : {
        width: wp(85),
        height: hp(8),
        backgroundColor: "#dcdcdc",
        borderRadius: 10,
        fontSize: hp(2.5),
        margin: hp(1.5),
        padding: 10 
    },

    buttonLogin : {
        fontSize: hp(3),
        backgroundColor: "#A3298B",
        textAlign: "center",
        textAlignVertical: "center",
        height: hp(8),
        width: wp(50),
        borderRadius: 10,
        margin: hp(3),
        color: "white"
    }

});


