import moment from "moment";
import cookie from "react-cookie";
import { host } from "../config";
const signalR = require("@aspnet/signalr");

//const wsApi = `${host}/chat`;
//сonst testApi = "https://dev.todayme.ru/chat";

export const wsConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://dev.todayme.ru/chat")
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Debug)
      .build();

export const startConnection = (userId) => {
  
    //let arr = window.location.pathname.split("/");    

  wsConnection
      .start()
      .then(() => {
        return wsConnection.invoke("ConnectUser", userId);
      })
      .catch((err) => console.log(err));
      
      wsConnection.on("newChatMessage",  (mes)=> console.log('mes1:'))    
}

export const listenToMessages = (handleMessage) => { 

  wsConnection.on("newChatMessage",  (mes)=> console.log('mes1:'))
  }

export const sendMessageRequest = (data) => {
  const requestBody = {
    "AuthToken": cookie.load("token"),
    "Data": { ...data }
     };

  wsConnection.invoke("ChatMessageCreate", JSON.stringify(requestBody))
  
  
}

export const listenToUnreadMessages = (userId, type, typeId) => {
  if(wsConnection) {
    wsConnection.invoke("ChatSetReadToDate", userId, type, typeId, moment())
  }
}

export const stopConnection = () => {
   wsConnection
      .stop()
      .then(() => { })
      .catch((err) => console.log(err));
}