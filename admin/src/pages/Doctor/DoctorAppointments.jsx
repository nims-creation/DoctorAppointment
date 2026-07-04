import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment, addPrescription } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  const [prescriptionModal, setPrescriptionModal] = useState(null)
  const [prescriptionText, setPrescriptionText] = useState('')

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
                    {!item.prescription && <button onClick={() => setPrescriptionModal(item._id)} className='text-[10px] border border-primary text-primary px-2 py-1 rounded hover:bg-primary hover:text-white transition-all'>Write Rx</button>}
                  </div>
                : <div className='flex'>
                  <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                  <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
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

    </div>
  )
}

export default DoctorAppointments