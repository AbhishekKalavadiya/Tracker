import React, {  useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import NavLink from '../components/NavLink'
import { NavigationEvents } from 'react-navigation'
import { useStateView } from '../context/StateProvider'
import trackerApi from '../api/trackerAPI' 
import AsyncStorage from '@react-native-community/async-storage'
import { navigate } from '../navigationRef'
import AuthForm from '../components/AuthForm'

const SignupScreen = () => {

    const[{auth}, dispatch] = useStateView()

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)


    const setSignupData = async ({ email, password }) => {

        try {
            const response = await trackerApi.post('/signup', { email, password})
            await AsyncStorage.setItem('token', response.data.token)

            dispatch({
                    type: 'SIGN_IN',
                    payload: {
                        isSignedIn: true,
                        token: response.data.token
                    }
                })
            setLoading(true)
            setError(false)
            navigate('TrackList')    

        } catch (error) {

            setError(true)
            setLoading(false)
        }
    }


    return (
        <View style={styles.viewStyle}>
            <NavigationEvents 
                onWillBlur = {() => setError(false)}
            />
            <AuthForm 
                headerText="Sign up !"
                loadingMessage={loading}
                submitButtonMessage="Sign Up"
                onSubmit = {({email, password}) => setSignupData({email, password})}
            />
            {
                loading ?<Text style={styles.errorStyle}>Please wait, we are logging in ...</Text> : null
            }
            {
                error ?<Text style={styles.errorStyle}>Something went Wrong in Signup !! Please try again</Text> :null
            }
            <NavLink 
                routeName = "Signin"
                textForLinkChange = "Already have account ?? Sign in instead."
            />
        </View>
    )
}

SignupScreen.navigationOptions = () => {
    return {
        headerShown: null
    }
}

const styles = StyleSheet.create({
    viewStyle: {
        flex:1,
        justifyContent: "center",
        marginBottom: 100
    },
    errorStyle: {
        color: "red",
        marginHorizontal: 'auto',
        fontSize: 20,
        marginBottom: 10
    },
})

export default SignupScreen
