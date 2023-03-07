import React, { useEffect, useState, useContext } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { BsChatSquareTextFill } from 'react-icons/bs';
import { MdOutlineTransitEnterexit } from 'react-icons/md';
import { v4 as uuid } from 'uuid';
import './MainChat.css';

const MainChat = ({ socket, messages }) => {
    const { sendRequest, error, clearError } = useHttpClient();
    const auth = useContext(AuthContext);

    const [openChat, setOpenChat] = useState(false);
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const unique_id = uuid();
    const small_id = unique_id.slice(0, 8)

    const openChathandler = (event) => {
        event.stopPropagation();
        setOpenChat(!openChat);
    }

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                msgId: small_id,
                chat: 'main_chat',
                authorId: auth.userId || 'guestId',
                authorName: auth.userName || 'guest',
                messageBody: currentMessage,
                date:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");

            //send to bcakend

            try {
                await sendRequest('http://localhost:5000/api/mainchat/sendMsg', 'POST',
                    JSON.stringify({
                        msgId: messageData.msgId,
                        chat: messageData.chat,
                        authorId: messageData.authorId,
                        authorName: messageData.authorName,
                        messageBody: messageData.messageBody,
                        date: messageData.date
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
            } catch (err) { };
        }

    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
        return () => {
            socket.off('receive_message');
        };
    }, [socket]);

    useEffect(() => {
        setMessageList(messages)
    }, [messages]);

    return <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {!openChat ? <div className='chat-icon flex column justify-center align-center'
            onClick={openChathandler}>
            <p>Live Chat</p>
            <BsChatSquareTextFill />
        </div>
            :
            <div className='chat-window flex column space-between'>
                <MdOutlineTransitEnterexit className='chat-icon-exit pointer' onClick={(event) => { openChathandler(event) }} />
                <div className='chat-header'>
                    <p>live chat</p>
                </div>
                <div className="chat-body">
                    <ScrollToBottom className="message-container">
                        {messageList.map((messageContent) => {
                            return (
                                <div
                                    className="message"
                                    id={auth.userId === messageContent.authorId ? "you" : "other"}
                                    key={messageContent.msgId}
                                >
                                    <div>
                                        <div className="message-content flex justify-center">
                                            <p>{messageContent.messageBody}</p>
                                        </div>
                                        <div className="message-meta">
                                            <p id="time">{messageContent.date}</p>
                                            <p id="author">{messageContent.authorName}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </ScrollToBottom>
                </div>

                <div className="chat-footer">
                    <input
                        type="text"
                        value={currentMessage}
                        placeholder="Hey..."
                        onChange={(event) => {
                            setCurrentMessage(event.target.value);
                        }}
                        onKeyPress={(event) => {
                            event.key === "Enter" && sendMessage();
                        }}
                    />
                    <button onClick={sendMessage}>&#9658;</button>
                </div>

            </div>
        }
    </React.Fragment>
}

export default MainChat;
