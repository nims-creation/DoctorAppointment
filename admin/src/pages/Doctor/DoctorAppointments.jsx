import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { io } from 'socket.io-client'

const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment, addPrescription } = useContext(DoctorContext)
  const { backendUrl, slotDateFormat, calculateAge, currency } = useContext(AppContext)

  const [prescriptionModal, setPrescriptionModal] = useState(null)
  const [prescriptionText, setPrescriptionText] = useState('')

  // Chat Modal States
  const [chatModal, setChatModal] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [socket, setSocket] = useState(null)

  const handleAddPrescription = async () => {
    if (!prescriptionText.trim()) return;
    await addPrescription(prescriptionModal, prescriptionText);
    setPrescriptionModal(null);
    setPrescriptionText('');
  }

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

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
        const { data } = await axios.get(backendUrl + `/api/doctor/chat-history/${appointmentId}`, { headers: { dtoken: dToken } });
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
        sender: 'doctor',
        text: messageText,
        timestamp: Date.now()
    };
    socket.emit("send_message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setMessageText('');
  }

  return (
    <div className='w-full max-w-6xl m-5 '>

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index}</p>
            <div className='flex items-center gap-2'>
              <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <p>{item.userData.name}</p>
            </div>
            <div>
              <p className='text-xs inline border border-primary px-2 rounded-full'>
                {item.payment?'Online':'CASH'}
              </p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <p>{currency}{item.amount}</p>
            {item.cancelled
              ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
              : item.isCompleted
                ? <div className='flex flex-col items-start gap-1'>
                    <p className='text-green-500 text-xs font-medium'>Completed</p>
                    <div className='flex gap-2'>
                        {!item.prescription && <button onClick={() => setPrescriptionModal(item._id)} className='text-[10px] border border-primary text-primary px-2 py-1 rounded hover:bg-primary hover:text-white transition-all'>Write Rx</button>}
                        <button onClick={() => openChat(item._id)} className='text-[10px] border border-blue-500 text-blue-500 px-2 py-1 rounded hover:bg-blue-500 hover:text-white transition-all'>Chat</button>
                    </div>
                  </div>
                : <div className='flex items-center gap-2'>
                  <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                  <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                  <button onClick={() => openChat(item._id)} className='text-[10px] border border-blue-500 text-blue-500 px-2 py-1 rounded hover:bg-blue-500 hover:text-white transition-all'>Chat</button>
                </div>
            }
          </div>
        ))}
      </div>

      {/* Prescription Modal */}
      {prescriptionModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg w-[90%] sm:w-[500px] shadow-lg'>
            <h2 className='text-lg font-semibold mb-4'>Write Prescription</h2>
            <div className='mb-4'>
              <textarea 
                value={prescriptionText} 
                onChange={(e) => setPrescriptionText(e.target.value)} 
                className='w-full border rounded p-2' 
                rows="6" 
                placeholder="Medicines, dosage, instructions..."
              />
            </div>
            <div className='flex justify-end gap-3'>
              <button onClick={() => setPrescriptionModal(null)} className='px-4 py-2 text-gray-500 border rounded hover:bg-gray-100'>Cancel</button>
              <button onClick={handleAddPrescription} className='px-4 py-2 bg-primary text-white rounded hover:opacity-90'>Save & Send</button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {chatModal && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
              <div className='bg-white rounded-lg w-[90%] sm:w-[500px] shadow-lg flex flex-col h-[70vh]'>
                  <div className='p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg'>
                      <h2 className='text-lg font-semibold'>Chat with Patient</h2>
                      <button onClick={() => setChatModal(null)} className='text-gray-500 hover:text-red-500 font-bold'>✕</button>
                  </div>
                  <div className='flex-1 p-4 overflow-y-scroll flex flex-col gap-3 bg-gray-100'>
                      {messages.map((msg, idx) => (
                          <div key={idx} className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`p-3 rounded-lg max-w-[70%] text-sm ${msg.sender === 'doctor' ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border'}`}>
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

export default DoctorAppointments