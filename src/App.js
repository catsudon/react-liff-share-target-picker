import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Pass } from 'codemirror';

const liff = window.liff

const App = () => {

  const [os, setOs] = React.useState('')
  const [language, setLanguage] = React.useState('')
  const [version, setVersion] = React.useState('')
  const [isInClient, setIsInClient] = React.useState('')
  const [isLoggedIn, setIsLoggedIn] = React.useState('')
  const [isLoggedInText, setIsLoggedInText] = React.useState('')
  const [profile, setProfile] = React.useState('')
  const [uid, setUid] = React.useState('0')
  const [ref, setRef] = React.useState('0')
  const [messageSent, setMessageSent] = React.useState("")


  React.useEffect(() => {
    initializeLiff()
  }, [])

  React.useEffect(() => {
    callBackend()
  }, [uid])

  React.useEffect(() => {
    liff.shareTargetPicker([
      {
        "type": "flex",
        "altText": "share",
        "contents": {
          "type": "bubble",
          "hero": {
            "type": "image",
            "size": "full",
            "aspectRatio": "3:2",
            "aspectMode": "cover",
            "url": "https://images2.imgbox.com/11/33/zNWcdCmr_o.png"
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": [
              {
                "type": "button",
                "style": "primary",
                "height": "sm",
                "action": {
                  "type": "uri",
                  "label": "แอดเลย",
                  "uri": "https://liff.line.me/1657084978-W5NaqyDN?refer="+ref
                },
                "color": "#E6564E"
              }
            ],
            "flex": 0
          }
        }
      }
    ])
      .then(result => alert(result.status))
      .then(() => setMessageSent("Message Sent!"))
  }, [ref])

  const initializeLiff = () => {
    liff
      .init({
        liffId: process.env.REACT_APP_LIFF_ID
      })
      .then(initializeApp)
      .catch((err) => {
        alert(err)
      })

  }

  const callBackend = () => {
    fetch("https://speedkub-line-bot-3kuvjve3ma-et.a.run.app/share?userID=" + uid)
      .then(r => r.json())
      .then(result => setRef(result['refer']))
  }

  const initializeApp = () => {
    displayLiffData();
    displayIsInClientInfo();
  }

  const displayLiffData = () => {
    setOs(liff.getOS())
    setLanguage(liff.getLanguage())
    setVersion(liff.getVersion())
    setIsInClient(liff.isInClient())
    setIsLoggedIn(liff.isLoggedIn())
    setIsLoggedInText(liff.isLoggedIn() ? 'True' : 'False')
    liff.getProfile().then(profile => {
      setProfile(profile)
      setUid(profile.userId)
    })
  }

  const displayIsInClientInfo = () => {
    if (liff.isInClient()) {
      setIsInClient('You are opening the app in the in-app browser of LINE.');
    } else {
      setIsInClient('You are opening the app in an external browser.');
    }
  }


  const handleCloseLIFFAppButton = () => {
    if (!liff.isInClient()) {
      sendAlertIfNotInClient()
    } else {
      liff.closeWindow();
    }
  }



  const handleSendMessageButton = () => {
    if (!liff.isInClient()) {
      sendAlertIfNotInClient();
    } else {
      liff.sendMessages([{
        'type': 'text',
        'text': uid + '\n' + ref
      }]).then(function () {
        window.alert('Message sent');
      }).catch(function (error) {
        window.alert('Error sending message: ' + error);
      });
    }
  }



  const sendAlertIfNotInClient = () => {
    alert('This button is unavailable as LIFF is currently being opened in an external browser.');
  }

  return (
    <main className="App">
      <section>
        {/* { ref == "กรุณาผูกไลน์กับspeedkubก่อน คุณสามารถผูกได้ที่เมนู" ? "กรุณาผูกไลน์กับspeedkubก่อน คุณสามารถผูกได้ที่เมนู" : ""} */}
        { messageSent == "Message Sent!" ? messageSent : 
                                ref == 0 ? "please wait . . ." : 
                                "refer code :" + ref + "\n"}
      </section>
    </main>
  );
}

export default App;
