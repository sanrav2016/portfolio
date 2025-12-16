import React from 'react'
import { HiOutlineMail } from "react-icons/hi";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export const Icons = ({ darkMode }) => {
  return (
    <div className="flex flex-col gap-3 my-4 relative">
      <div className="flex flex-row gap-3">
        <span className={`${darkMode ? "icon-dark" : "icon-light"}`}><a href="mailto:sanrav2016@gmail.com" target="_blank"><HiOutlineMail /></a></span>
        <span className={`${darkMode ? "icon-dark" : "icon-light"}`}><a href="https://github.com/sanrav2016" target="_blank"><FaGithub /></a></span>
        <span className={`${darkMode ? "icon-dark" : "icon-light"}`}><a href="https://www.instagram.com/sanrav2016/" target="_blank"><FaInstagram /></a></span>
        <span className={`${darkMode ? "icon-dark" : "icon-light"}`}><a href="https://www.linkedin.com/in/sanjay-ravishankar/" target="_blank"><FaLinkedinIn /></a></span>
      </div>
      {/*<a href="/resume.pdf" target="_blank"><button className={`${darkMode ? "button-dark" : "button-light"}`}>Resume</button></a>*/}
    </div>
  )
}

const Footer = () => {
  return (
    <section className="bg-black h-[250px] text-white border-t-white border-b-slate-800 border-y-2 relative">
      <Icons darkMode={true} />
      <span className="absolute bottom-2 text-xs  font-thin">Made with ❤️ by Sanjay Ravishankar</span>
    </section>
  )
}

export default Footer