import React, { useEffect, useState, useContext } from 'react';
import MainNavigation from '../../shared/components/Navigation/MainNavigation';
import ScrollToBottom from "react-scroll-to-bottom";
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Button from '../../shared/components/FormElements/Button';
import { v4 as uuid } from 'uuid';

const LiveChat = ({ socket }) => {
    const { sendRequest, error, clearError } = useHttpClient();
    const auth = useContext(AuthContext);

    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const unique_id = uuid();
    const small_id = unique_id.slice(0, 8);



    const sendMessage = async () => {
        if (currentMessage !== "") {
            let hours = new Date(Date.now()).getHours();
            if (hours < 10) { hours = '0' + hours };
            let minutes = new Date(Date.now()).getMinutes();
            if (minutes < 10) { minutes = '0' + minutes };
            const messageData = {
                msgId: small_id,
                chat: 'main_chat',
                authorId: auth.userId || 'guestId',
                authorName: auth.userName || 'guest',
                messageBody: currentMessage,
                date:
                    hours +
                    ":" +
                    minutes
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");

            //send to bcakend
            try {
                await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/mainchat/sendMsg`, 'POST',
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
        socket.emit("join_room", 'main_chat');

        const fetchMainCHatMessages = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/mainchat`);
                setMessageList(responseData.loadedMessages);
            } catch (err) { };
        };
        fetchMainCHatMessages();
    }, [sendRequest, socket]);

    if (!auth.isLoggedIn) {
        return (
            <div className='live-chat-page flex column'>
                <MainNavigation />
                <div className='fill-height center'>
                        <div className='log-in-card'>
                            <h1 className='colorPrimary'>Sorry but you need</h1>
                            <h2 className='colorPrimary'>to login first...</h2>
                            <div className='mt10'>
                                <Button action to="/auth">Log in</Button>
                            </div>
                        </div>
                </div>
            </div>
        );
    }

    return <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        <div className='live-chat-page flex column'>
            <MainNavigation />
            <div className='chat-container flex justify-center '>
                <div className='chat-window flex column space-between'>
                    <div className='chat-header center'>
                        <h2>live chat</h2>
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
            </div>
        </div>
    </React.Fragment>
}

export default LiveChat;
