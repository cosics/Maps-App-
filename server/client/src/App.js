import React, { Component } from "react";
import L from "leaflet";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { Card, CardText, Button } from "reactstrap";

import userLocationURL from "./user_location.svg";
import messageLocationURL from "./message_location.svg";

import MessageCardForm from "./MessageCardForm";
import { getMessages, getLocation, sendMessage } from "./API";

import "./App.css";

const myIcon = L.icon({
  iconUrl: userLocationURL,
  iconSize: [50, 82],
});

const messageIcon = L.icon({
  iconUrl: messageLocationURL,
  iconSize: [50, 82],
});

class App extends Component {
  state = {
    location: {
      lat: 51.505,
      lng: -0.09,
    },
    haveUsersLocation: false,
    zoom: 2,
    userMessage: {
      name: "",
      message: "",
    },
    showMessageForm: false,
    sendingMessage: false,
    sentMessage: false,
    messages: [],
  };

  componentDidMount() {
    getMessages().then((messages) => {
      this.setState({
        messages,
      });
    });
  }

  showMessageForm = () => {
    this.setState({
      showMessageForm: true,
    });
    getLocation().then((location) => {
      this.setState({
        location,
        haveUsersLocation: true,
        zoom: 13,
      });
    });
  };

  cancelMessage = () => {
    this.setState({
      showMessageForm: false,
    });
  };

  formIsValid = () => {
    let { name, message } = this.state.userMessage;
    name = name.trim();
    message = message.trim();

    const validMessage =
      name.length > 0 &&
      name.length <= 500 &&
      message.length > 0 &&
      message.length <= 500;

    return validMessage && this.state.haveUsersLocation ? true : false;
  };

  formSubmitted = (event) => {
    event.preventDefault();

    if (this.formIsValid()) {
      this.setState({
        sendingMessage: true,
      });

      const message = {
        name: this.state.userMessage.name,
        message: this.state.userMessage.message,
        latitude: this.state.location.lat,
        longitude: this.state.location.lng,
      };

      sendMessage(message).then((result) => {
        setTimeout(() => {
          this.setState({
            sendingMessage: false,
            sentMessage: true,
          });
        }, 4000);
      });
    }
  };

  valueChanged = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      userMessage: {
        ...prevState.userMessage,
        [name]: value,
      },
    }));
  };

  render() {
    const position = [this.state.location.lat, this.state.location.lng];
    return (
      <div className="map">
        <Map
          className="map"
          worldCopyJump={true}
          center={position}
          zoom={this.state.zoom}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors and Chat location by Iconika from the Noun Project'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {this.state.haveUsersLocation ? (
            <Marker position={position} icon={myIcon}></Marker>
          ) : (
            ""
          )}
          {this.state.messages.map((message) => (
            <Marker
              key={message._id}
              position={[message.latitude, message.longitude]}
              icon={messageIcon}
            >
              <Popup>
                <p>
                  <em>{message.name}:</em> {message.message}
                </p>
                {message.otherMessages
                  ? message.otherMessages.map((message) => (
                      <p key={message._id}>
                        <em>{message.name}:</em> {message.message}
                      </p>
                    ))
                  : ""}
              </Popup>
            </Marker>
          ))}
        </Map>
        {!this.state.showMessageForm ? (
          <Button
            className="message-form"
            onClick={this.showMessageForm}
            color="info"
          >
            Add a Message
          </Button>
        ) : !this.state.sentMessage ? (
          <MessageCardForm
            cancelMessage={this.cancelMessage}
            showMessageForm={this.state.showMessageForm}
            sendingMessage={this.state.sendingMessage}
            sentMessage={this.state.sentMessage}
            haveUsersLocation={this.state.haveUsersLocation}
            formSubmitted={this.formSubmitted}
            valueChanged={this.valueChanged}
            formIsValid={this.formIsValid}
          />
        ) : (
          <Card body className="thanks-form">
            <CardText>Thanks for submitting a message!</CardText>
          </Card>
        )}
        <Card className="footer">
          <CardText>
            {" "}
            Facut cu durere si{" "}
            <span role="img" aria-label="love">
              💚
            </span>{" "}
            de{" "}
            <a
              href="https://github.com/cosics"
              target="_blank"
              rel="noopener noreferrer"
            >
              cezi
            </a>
          </CardText>
        </Card>
      </div>
    );
  }
}

export default App;

/*import React, { Component } from "react";
import Joi from "joi";
import L from "leaflet";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import {
  Card,
  Button,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import userLocationURL from "./user_location.svg";
import messageLocationURL from "./message_location.svg";

import "./App.css";

const myIcon = L.icon({
  iconUrl: userLocationURL,
  iconSize: [50, 82],
  iconAnchor: [0, 82],
  popupAnchor: [25, -20],
});

const messageIcon = L.icon({
  iconUrl: messageLocationURL,
  iconSize: [50, 82],
  iconAnchor: [0, 82],
  popupAnchor: [25, -20],
});

const schema = Joi.object().keys({
  name: Joi.string().min(1).max(100).required(),
  message: Joi.string().min(1).max(500).required(),
});

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/v1/messages"
    : "production-url-here";

class App extends Component {
  state = {
    location: {
      lat: 51.505,
      lng: -0.09,
    },
    haveUsersLocation: false,
    zoom: 2,
    userMessage: {
      name: "",
      message: "",
    },
    sendingMessage: false,
    sentMessage: false,
    messages: [],
  };

  componentDidMount() {
    fetch(API_URL)
      .then((res) => res.json())
      .then((messages) => {
        const haveSeenLocation = {};
        messages = messages.reduce((all, message) => {
          const key = `${message.latitude}${message.longitude}`;
          if (haveSeenLocation[key]) {
            haveSeenLocation[key].otherMessages =
              haveSeenLocation[key].otherMessages || [];
            haveSeenLocation[key].otherMessages.push(message);
          } else {
            haveSeenLocation[key] = message;
            all.push(message);
          }
          return all;
        }, []);
        this.setState({
          messages,
        });
      });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        //do_something(position.coords.latitude, position.coords.longitude);

        this.setState({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          haveUsersLocation: true,
          zoom: 13,
        });
      },
      () => {
        console.log("oh no nu ne-a dat locatia :(");
        fetch("https://ipapi.co/json")
          .then((res) => res.json())
          .then((location) => {
            console.log(location);
            this.setState({
              location: {
                lat: location.latitude,
                lng: location.longitude,
              },
              haveUsersLocation: true,
              zoom: 13,
            });
          });
      }
    );
  }

  formIsValid = () => {
    const userMessage = {
      name: this.state.userMessage.name,
      message: this.state.userMessage.message,
    };
    const result = Joi.validate(userMessage, schema);

    return !result.error && this.state.haveUsersLocation ? true : false;
  };

  formSubmitted = (event) => {
    event.preventDefault(); //page doesnt refresh
    if (this.formIsValid()) {
      this.setState({
        sendingMessage: true,
      });
      fetch(API_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: this.state.userMessage.name,
          message: this.state.userMessage.message,
          latitude: this.state.location.lat,
          longitude: this.state.location.lng,
        }),
      })
        .then((res) => res.json())
        .then((message) => {
          console.log(message);
          setTimeout(() => {
            this.setState({
              sendingMessage: false,
              sentMessage: true,
            });
          }, 4000);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  valueChanged = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      userMessage: {
        ...prevState.userMessage,
        [name]: value,
      },
    }));
  };

  render() {
    const position = [this.state.location.lat, this.state.location.lng];
    return (
      <div>
        <Map className="map" center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href=""http://osm.org/copyright"">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {this.state.haveUsersLocation ? (
            <Marker position={position} icon={myIcon}></Marker>
          ) : (
            ""
          )}
          {this.state.messages.map((message) => (
            <Marker
              key={message._id}
              position={[message.latitude, message.longitude]}
              icon={messageIcon}
            >
              <Popup>
                <p>
                  <em>{message.name}:</em>
                  {message.message}
                </p>
                {message.otherMessages
                  ? message.otherMessages.map((message) => (
                      <p key={message._id}>
                        <em>{message.name}:</em>
                        {message.message}
                      </p>
                    ))
                  : ""}
              </Popup>
            </Marker>
          ))}
        </Map>
        <Card body className="message-form">
          <CardTitle>Welcome to whatever this is!</CardTitle>
          <CardText>Lasă un mesaj</CardText>
          {!this.state.sendingMessage &&
          !this.state.sentMessage &&
          this.state.haveUsersLocation ? (
            <Form onSubmit={this.formSubmitted}>
              <FormGroup>
                <Label for="name">Nume:</Label>
                <Input
                  onChange={this.valueChanged}
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Cine"
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label for="message">Mesaj:</Label>
                <Input
                  onChange={this.valueChanged}
                  type="textarea"
                  name="message"
                  id="message"
                  placeholder="Hai spune ceva"
                ></Input>
              </FormGroup>
              <Button type="submit" color="info" disabled={!this.formIsValid()}>
                Trimite
              </Button>
            </Form>
          ) : this.state.sendingMessage || !this.state.haveUsersLocation ? (
            <video
              autoPlay
              loop
              className="videoInsert"
              src="https://i.giphy.com/media/3oEjHTSuJrMnj08DpS/giphy.mp4"
            ></video>
          ) : (
            <CardText>Thanks for your contribution!</CardText>
          )}
        </Card>
      </div>
    );
  }
}

export default App; */
