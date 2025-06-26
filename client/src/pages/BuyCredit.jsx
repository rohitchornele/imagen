import axios from 'axios';
import React, { useContext } from "react";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const BuyCredit = () => {

  const {user, setShowLogin, backendUrl, loadCreditData, token} = useContext(AppContext);


  const navigate = useNavigate();

  const initPay = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency : order.currency,
      name: "Credits Payment",
      description: "Credits Payment",
      order_id : order.id,
      receipt : order.receipt,
      handler : async (response) => {
        //console.log("Inside buycredit handler");
        try {
          const {data} =  await axios.post(backendUrl + '/api/user/verify-payment', response, {headers: {token}});

          if(data.success) {
            loadCreditData();
            navigate('/');
            toast.success("Credits Added Successfully");
          }
        } catch (error) {
          //console.log("Error in BuyCredits", error);
          toast.error(error.message)
        }
      }
    }

    //console.log("Inside initpay order = ", order)

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  const paymentRazorpay = async (planId) => {
    try {
      if(!user) {
        setShowLogin(true);
      }
      
      const { data } = await axios.post(backendUrl + '/api/user/payment', {planId}, {headers: {token}} )

      //console.log("data inside buycredit  = ", data)

      if(data.success) {
        initPay(data.order);
      }
    } catch (error) {
      //console.log("Error in Buycredit ", error);
      toast.error(error.message)
    }
  }


  return (
    <motion.div className="min-h-[80vh] text-center pt-14 mb-10"
     initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}>
      <button className="border border-gray-400 px-10 py-2 rounded-full mb-6">
        Our Plans
      </button>
      <h1 className="text-center text-3xl font-medium mb-6 sm:mb-10">
        Chose the Plan
      </h1>

      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((item, index) => (
          <div
            className="bg-white drop-shadow-sm border border-neutral-200 rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500"
            key={index}
          >
            <img src={assets.logo_icon} alt="" width={40} />
            <p className="font-semibold mt-3 mb-1">{item.id}</p>
            <p className="text-sm">{item.desc}</p>
            <p className="mt-6">
              <span className="text-3xl font-medium">${item.price}</span>/ {item.credits} credits
            </p>
            <button className="w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52 cursor-pointer" 
            onClick={() => paymentRazorpay(item.id)}>
              {
                user ? "Purchase" : "Get Started"
              }
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BuyCredit;
