import React, { useEffect, useState } from 'react'
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';
import { useSelector, useDispatch } from "react-redux";
import { signInSuccess } from '../redux/user/userSlice';
import { store } from '../redux/store';


const LoginScreen = () => {
  const navigation = useNavigation();
  const BASE_URL = "http://192.168.0.105"
const dispatch = useDispatch();

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const [login, setLogin] =useState(false);
  const [signup, setSignup]=useState(false);
  const [loginFacebook, setLoginFacebook] = useState(false)
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let timeoutId;

    if (error) {
      // Set a timeout to clear the error state after 3 seconds
      timeoutId = setTimeout(() => {
        setError(null);
      }, 2000);
    }

    return () => {
      // Clear the timeout when the component unmounts or the error changes
      clearTimeout(timeoutId);
    };
  }, [error]);
  const handleLoginPress = () => {
   setLogin(true);         
  }
   const handleModalClose = () => {
    setLogin(false);
    setEmail('');
    setPassword('');
  };
  const handleLoginSubmit =async () => {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}:3000/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email, password})
      });
      const data = await res.json();
      if(data.success === false){
        setError(data.message)
        setLoading(false);
        return;
      }
    dispatch(signInSuccess(data));
    console.log('State after login:', store.getState());
      navigation.navigate("Home")
      handleModalClose();
    } catch (error) {
      setLoading(false);
      setError(error.message);
      return 
    }


    handleModalClose();
  };
  const handleSignup = ()=>{
    setSignup(true);
    

  }
  const handleSignupSubmit =async () => {
    try {
      setLoading(true)
    const res = await fetch(`${BASE_URL}:3000/api/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username, email, password}),
    });
    const data = await res.json();
    if (data.success === false) {
      setError(data.message);
      setLoading(false);
      return;
    }
    navigation.navigate("Home")
    handleModalClose();
  } catch (error) {
    setLoading(false);
    setError(error.message);
    return;
  }

  };
  const handleSignupModalClose = () => {
    setSignup(false);
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        console.log('Facebook login was cancelled.');
      } else {
        const data = await AccessToken.getCurrentAccessToken();
        console.log('Facebook login successful:', data);

        // Call your backend API to handle Facebook login
        await handleBackendFacebookLogin(data.accessToken);

        // Perform further actions if needed
      }
    } catch (error) {
      console.error('Error during Facebook login:', error);
    }
  };

  const handleBackendFacebookLogin = async (accessToken) => {
    try {
      // Make a POST request to your backend API endpoint
      const response = await fetch(`${BASE_URL}:3000/api/user/auth/facebook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: accessToken,
        }),
      });

      // Check if the request was successful
      if (response.ok) {
        const result = await response.json();
        console.log('Backend Facebook login successful:', result);
        // Handle further actions based on the response from your backend
      } else {
        console.error('Backend Facebook login failed:', response.status);
        // Handle error scenarios
      }
    } catch (error) {
      console.error('Error during backend Facebook login:', error);
      // Handle error scenarios
    }
  };

  return (
    <View className="justify-center flex-1">
        <View className=" w-1/2  mx-auto">
        <TouchableOpacity
          className="bg-blue-500 p-3 rounded-lg "
          onPress={handleSignup}
        >
          <Text className="text-center  text-white font-bold ">Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-orange-600 p-3 rounded-lg mt-2"
          onPress={handleLoginPress}
        >
          <Text className="text-center text-white font-bold ">Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-600 p-3 rounded-lg mt-2"
          onPress={handleFacebookLogin}
        >
          <Text className="text-center text-white font-bold ">Login with Facebook</Text>
        </TouchableOpacity>
      </View>
      <View>

      <Modal visible={login} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Login</Text>
            <TextInput
              placeholder="Email"
              style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              style={{ borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 }}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
              style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, marginBottom: 10 }}
              onPress={handleLoginSubmit}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'gray', padding: 10, borderRadius: 5 }}
              onPress={handleModalClose}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
          {error && 
      <View className="bg-slate-300 p-2 rounded-2xl">
        <Text className="text-center font-semibold text-red-500 ">{error}</Text>
        </View>}
        </View>

      </Modal>
      </View>
<View>

      <Modal visible={signup} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>SignUp</Text>
            <TextInput
              placeholder="UserName"
              style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
              value={username}
              onChangeText={(text) => setUsername(text)}
            />
            <TextInput
              placeholder="Email"
              style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              style={{ borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 }}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
              style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, marginBottom: 10 }}
              onPress={handleSignupSubmit}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Signup</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'gray', padding: 10, borderRadius: 5 }}
              onPress={handleSignupModalClose}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>

      {error && 
      <View className="bg-slate-300 p-2 rounded-2xl">
        <Text className="text-center font-semibold text-red-500 ">{error}</Text>
        </View>}
        </View>
      </Modal>
</View>

        </View>
  )
}

export default LoginScreen