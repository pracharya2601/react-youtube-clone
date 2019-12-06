

import React from 'react';
import '../App.css';

//creating the connection
import io from 'socket.io-client';
// const socket = io.connect('http://localhost:3000');


class Chat extends React.Component {
    constructor(props) {
        super(props)
        // const username = prompt('Enter your username')
        this.state = {
            messages: [],
            // from: []
            userName: []
        }
        this.sendMessage = this.sendMessage.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }   
    //adding username to the real time chat
    // changeUsername(e){
    //     e.preventDefault();
    //     if(this.state.username.length){
    //         this.props.setUsername(this.state.username);
    //     }else{
    //         alert('Please provide a username');
    //     }
    // }
    // onChange(e){
    //     this.setState({
    //         username : e.target.value
    //     })
    // }
    componentDidMount() {
        // const username = prompt('enter name here')
        this.socket = io('http://localhost:5000')
        this.socket.on('message', (message) => {
            this.setState({
                messages: [message, ...this.state.messages],
                // username : username
            });
        })
    }
    sendMessage(event) {
        // const from = event.target.value
        const body = event.target.value

        if (event.keyCode === 13 && body) {
            let message = {
                body,
                date: new Date().toLocaleString(),
                users: this.state.userName
                //we can put the username when the user logs into the account
                
            }
            // console.log('here', message)
            this.setState({ 
                messages: [message, ...this.state.messages],
            })
            this.socket.emit('message', message)
        }
    }

    handleClick = (event) => {
        const userName = prompt('Enter username')

        this.setState({
            userName : userName
        })
        this.socket.emit('userName', userName)
    }

    render() {
        return (
            <div className='Message-box'>
                
                <p id = 'greet'> <strong>Hi {this.state.userName}</strong></p>
                <input type ='button' id = 'userButton' value='Enter a username' onClick ={this.handleClick}></input>
                <input type='text' id='commentBox' placeholder='enter a message' onKeyUp={this.sendMessage} ></input>
                {this.state.messages.map((messages => {
                    return (<ul id='messages'><strong>{messages.users}</strong> : <small>{messages.date}</small> : <br />{messages.body}</ul>)
                }))}
            </div>
        )
    }
}

export default Chat;
