import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { io } from 'socket.io-client'

const MyAppointments = () => {

    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')
    
    // Review Modal States
    const [reviewDocId, setReviewDocId] = useState(null)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    
    // Chat Modal States
    const [chatModal, setChatModal] = useState(null)
    const [messages, setMessages] = useState([])
    const [messageText, setMessageText] = useState('')
    const [socket, setSocket] = useState(null)

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    // Getting User Appointments Data Using API
    const getUserAppointments = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to cancel appointment Using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Function to submit review
    const submitReview = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/add-review', { docId: reviewDocId, rating, comment }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                setReviewDocId(null)
                setComment('')
                setRating(5)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || error.message)
        }
    }

    // Function to download prescription
    const downloadPrescription = async (appointmentId) => {
        try {
            const response = await axios.post(
                backendUrl + `/api/user/download-prescription/${appointmentId}`, 
                {}, 
                { headers: { token }, responseType: 'blob' }
            )
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `prescription_${appointmentId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.log(error)
            toast.error('Failed to download prescription')
        }
    }


    // Function to make payment using stripe
    const appointmentStripe = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
            if (data.success) {
                const { session_url } = data
                window.location.replace(session_url)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }



    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    // Initialize Socket and handle incoming messages
    useEffect(() => {
        const newSocket = io(backendUrl);
        setSocket(newSocket);

        newSocket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => newSocket.close();
    }, [backendUrl]);

    const openChat = async (appointmentId) => {
        setChatModal(appointmentId);
        setMessages([]);
        if (socket) {
            socket.emit("join_room", appointmentId);
        }
        try {
            const { data } = await axios.get(backendUrl + `/api/user/chat-history/${appointmentId}`, { headers: { token } });
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const sendMessage = () => {
        if (!messageText.trim() || !socket || !chatModal) return;
        const msgData = {
            room: chatModal,
            sender: 'user',
            text: messageText,
            timestamp: Date.now()
        };
        socket.emit("send_message", msgData);
        setMessages((prev) => [...prev, msgData]);
        setMessageText('');
    }

    return (
        <div>
            <p className='pb-3 mt-12 text-lg font-medium text-gray-600 border-b'>My appointments</p>
            <div className=''>
                {appointments.map((item, index) => (
                    <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'>
                        <div>
                            <img className='w-36 bg-[#EAEFFF]' src={item.docData.image} alt="" />
                        </div>
                        <div className='flex-1 text-sm text-[#5E5E5E]'>
                            <p className='text-[#262626] text-base font-semibold'>{item.docData.name}</p>
                            <p>{item.docData.speciality}</p>
                            <p className='text-[#464646] font-medium mt-1'>Address:</p>
                            <p className=''>{item.docData.address.line1}</p>
                            <p className=''>{item.docData.address.line2}</p>
                            <p className=' mt-1'><span className='text-sm text-[#3C3C3C] font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} |  {item.slotTime}</p>
                        </div>
                        <div></div>
                        <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                            {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && <button onClick={() => setPayment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && <button onClick={() => appointmentStripe(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'><img className='max-w-20 max-h-5' src={assets.stripe_logo} alt="" /></button>}

                            {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-[#696969]  bg-[#EAEFFF]'>Paid</button>}

                            {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500 cursor-default'>Completed</button>}
                            {item.isCompleted && <button onClick={() => setReviewDocId(item.docId)} className='sm:min-w-48 py-2 border border-primary rounded text-primary hover:bg-primary hover:text-white transition-all duration-300'>Write Review</button>}
                            {item.prescription && <button onClick={() => downloadPrescription(item._id)} className='sm:min-w-48 py-2 border border-gray-500 rounded text-gray-500 hover:bg-gray-500 hover:text-white transition-all duration-300'>Download Rx</button>}
                            <button onClick={() => openChat(item._id)} className='sm:min-w-48 py-2 border border-blue-500 rounded text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300'>Chat with Doctor</button>

                            {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
                            {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment cancelled</button>}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Review Modal */}
            {reviewDocId && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white p-6 rounded-lg w-[90%] sm:w-[400px] shadow-lg'>
                        <h2 className='text-lg font-semibold mb-4'>Write a Review</h2>
                        <div className='mb-4'>
                            <p className='text-sm mb-1'>Rating (1-5)</p>
                            <input 
                                type="number" 
                                min="1" max="5" 
                                value={rating} 
                                onChange={(e) => setRating(e.target.value)} 
                                className='w-full border rounded p-2'
                            />
                        </div>
                        <div className='mb-4'>
                            <p className='text-sm mb-1'>Comment</p>
                            <textarea 
                                value={comment} 
                                onChange={(e) => setComment(e.target.value)} 
                                className='w-full border rounded p-2' 
                                rows="4" 
                                placeholder="Share your experience..."
                            />
                        </div>
                        <div className='flex justify-end gap-3'>
                            <button onClick={() => setReviewDocId(null)} className='px-4 py-2 text-gray-500 border rounded hover:bg-gray-100'>Cancel</button>
                            <button onClick={submitReview} className='px-4 py-2 bg-primary text-white rounded hover:opacity-90'>Submit</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Modal */}
            {chatModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white rounded-lg w-[90%] sm:w-[500px] shadow-lg flex flex-col h-[70vh]'>
                        <div className='p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg'>
                            <h2 className='text-lg font-semibold'>Chat with Doctor</h2>
                            <button onClick={() => setChatModal(null)} className='text-gray-500 hover:text-red-500 font-bold'>✕</button>
                        </div>
                        <div className='flex-1 p-4 overflow-y-scroll flex flex-col gap-3 bg-gray-100'>
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-3 rounded-lg max-w-[70%] text-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {messages.length === 0 && <p className='text-center text-gray-400 text-sm mt-10'>No messages yet. Say hi!</p>}
                        </div>
                        <div className='p-4 border-t bg-white rounded-b-lg flex gap-2'>
                            <input 
                                type="text" 
                                value={messageText} 
                                onChange={(e) => setMessageText(e.target.value)} 
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                className='flex-1 border rounded px-3 py-2 outline-none focus:border-primary' 
                                placeholder="Type a message..."
                            />
                            <button onClick={sendMessage} className='px-4 py-2 bg-primary text-white rounded hover:opacity-90'>Send</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyAppointments