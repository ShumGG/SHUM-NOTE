import React, { Component } from "react";
import {createDrawerNavigator} from "react-navigation-drawer";
import {createStackNavigator} from "react-navigation-stack";
import {createAppContainer, createSwitchNavigator, DrawerItems} from "react-navigation";
import Home from "../screens/Home";
import Create from "../screens/Create";
import Edit from "../screens/Edit";
import Archive from "../screens/Archive";
import About from "../screens/About";
import Search from "../screens/Search";
import Drawer_style from "../components/Drawer_style";
import Header from "../components/Header";
import Childs_header from "../components/Childs_header";
import {Feather} from "@expo/vector-icons";

const Home_stack = createStackNavigator({ //hooks
    Home: {
        screen: Home, 
        navigationOptions: ({navigation}) => {
            return {
            header: () => <Header navigation = {navigation} title = "Shum Note"/>}
        }
    },
    Create: {
        screen: Create, 
        navigationOptions: ({navigation}) => {
            return {
            header: () => <Childs_header navigation = {navigation} title = "Create Note"/>,
            headerLeft: () => <Feather name = "check-square" size = {20} color = "black"/>}
        }
    },
    Edit: {
        screen: Edit, 
        navigationOptions: ({navigation}) => {
            return {
            header: () => <Childs_header navigation = {navigation} title = "Edit Note"/>}
        }
    },
    Search: {
        screen: Search,
        navigationOptions: ({navigation}) => {
            return {
            header: () => <Childs_header navigation = {navigation} title = "Search Note"/>}
        }
    }
});

const Archived_notes_stack = createStackNavigator({
    Archive: {       
        screen: Archive, 
        navigationOptions: ({navigation}) => {
            return {
            header: () => <Header navigation = {navigation} title = "Archive"/>}
        }
    },
    Edit: {
        screen: Edit, 
        navigationOptions: ({navigation}) => {
            return {
            header: () => <Childs_header navigation = {navigation} title = "Edit Note"/>}
        }
    },
});

const About_stack = createStackNavigator({ 
    About: {
        screen: About, 
        navigationOptions: ({navigation}) => {
            return {
            header: () => <Header navigation = {navigation} title = "About"/>}
    }},
});

const drawer = createDrawerNavigator(
    {
        home: Home_stack, //routes
        archived_notes: Archived_notes_stack,
        about: About_stack,
    },
    {  
        initialRouteName: "home", //config
        contentComponent: props => <Drawer_style {...props}/>,
        contentOptions: {
            activeTintColor: "#1E90FF", //color: dodger blue
            inactiveTintColor: "black",
        },
        overlayColor: 1,
    }
);

const Route = createAppContainer(
    createSwitchNavigator({
        drawer
    })
);

export default Route;

