import React, {Component} from "react"
import {Button, Text, TextInput, View} from "react-native";
import {applyMiddleware, compose, createStore} from "redux";
import createSagaMiddleware from "redux-saga";
import {Field, reducer as formReducer, reduxForm} from "redux-form";
import {combineReducers} from "redux";
import {connect, Provider} from "react-redux";
import {takeEvery} from "redux-saga";

// AsyncStorage:
import {AsyncStorage} from "react-native";
import {persistStore, autoRehydrate} from "redux-persist";
// Action-Type when rehydrating the state from storage:
import {REHYDRATE} from "redux-persist/constants";


const sagaMiddleware = createSagaMiddleware();
const runner = function*(action) {
    console.log("runner : " + JSON.stringify(action))
}
const saga = function*() {
    yield takeEvery("SUBMIT", runner)
}

// AsyncStorage:
// Add autoRehydrate-storeEnhancer:
const storeEnhancer =
    compose(applyMiddleware(sagaMiddleware), autoRehydrate());

const reducer = (state, action) => {
    switch (action.type) {
        case "SUBMIT":
            console.log("action submit: " + JSON.stringify(action));
            return state
//        case REHYDRATE:
//            console.log("Rehydrating state from storage:" + JSON.stringify(action.payload))
        default:
            return state
    }
}
const submit = () => {
    type:"SUBMIT"
};
const rootReducer = combineReducers({app: reducer, form: formReducer})
sagaMiddleware.run(saga)

const store = createStore(rootReducer, storeEnhancer);

// AsyncStorage:
// Start persisting to AsyncStorage whenever state in app-field change:
persistStore(store, {storage: AsyncStorage, whitelist: ["app"]});

class App extends Component {
    render() {
        console.log("props: " + JSON.stringify(this.props));
        const {fields: {name}, handleSubmit} = this.props;
        return (
            <Provider store={store}>
                <View>
                    <Text>Name</Text>
                    <Field name="name" component={TextInput} {...name}/>
                </View>
                <Button title="Submit" onPress={handleSubmit}/>
            </Provider>)
    }
}


export default reduxForm({
    form: "app",
    fields: ["name"]
}, null, {submit})(App)
