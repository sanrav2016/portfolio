import React from 'react'
import { HiOutlineMail } from "react-icons/hi";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <section className="bg-black h-[250px] text-white border-t-white border-b-slate-800 border-y-2 relative">
      <div className="flex flex-row gap-3">
        <span className="icon"><a href="mailto:sanrav2016@gmail.com" target="_blank"><HiOutlineMail /></a></span>
        <span className="icon"><a href="https://github.com/sanrav2016" target="_blank"><FaGithub /></a></span>
        <span className="icon"><FaInstagram /></span>
        <span className="icon"><a href="https://www.linkedin.com/in/sanjay-ravishankar-399308296/" target="_blank"><FaLinkedinIn /></a></span>
      </div>
      <span className="absolute bottom-2 text-xs tracking-tighter italic">Made with React, Vite, THREE.js and Sanity.io</span>
    </section>
  )
}

export default Footer