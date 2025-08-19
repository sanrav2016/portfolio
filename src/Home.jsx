import { useState, useEffect } from "react"
import { cdnClient, urlFor } from './SanityClient'
import { motion } from "framer-motion"
import './app.scss'
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { Link } from 'react-router-dom'
import Scene from './Scene.jsx'

import profile from '../assets/img/profile.png'

const Home = ({ darkMode, setDarkMode }) => {
  const [projects, setProjects] = useState([])
  const [age, setAge] = useState(0);

  useEffect(() => {
    const birthDate = new Date("2007-06-06T10:04:00");
    const updateAge = () => {
      const now = new Date();
      const diffMs = now - birthDate;
      const years = diffMs / (1000 * 60 * 60 * 24 * 365.2425);
      setAge(years);
    };

    updateAge();
    const interval = setInterval(updateAge, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    cdnClient.fetch(`*[_type == 'post']{ _id, "slug": slug.current, mainImage, "category": category->title } | order(dateTime(_updatedAt) desc)`).then((data) => {
      setProjects(data)
    })
  }, [])

  return <div className={`w-full h-full relative transition-all ${darkMode ? "dark" : ""}`}>
    <div className="fixed top-4 right-4 w-8 h-8 flex justify-center items-center z-10">
      <span onClick={() => setDarkMode(!darkMode)} className={`icon ${darkMode ? "bg-black" : "bg-white"}`} style={{ "border": 0 }}>
        {darkMode ? <IoMoonOutline /> : <IoSunnyOutline />}
      </span>
    </div>
    <Scene darkMode={darkMode} />
    <section className="flex-row h-[100vh]">
      <div>
        <div className="flex flex-wrap justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
          >
            <div className="align-left flex flex-col p-12 gap-4 z-10">
              <div className="text-6xl playfair tracking-tighter w-full  z-10">Hi, I'm <br />Sanjay!</div>
              <div className="text-xs tracking-tighter italic z-10">
                <div>{age.toFixed(9)} years old @ <br />Carnegie Mellon University</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ scale: 0.5, rotate: 20, opacity: 0 }}
            whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            className="hero-image-container"
          >
            <div className="hero-image-wrapper" />
            <div className={`hero-image ${darkMode ? "border-white" : "border-black"}`}>
              <img src={profile} />
            </div>
          </motion.div>
        </div>
      </div>
    </section >
    <section>
      <div className="title">Researcher</div>
      <div className="flex gap-5 flex-wrap justify-center max-w-100%">
        {
          projects.filter(x => x.category == "Researcher").map((x, i) =>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.25,
                delay: i / 10,
              }}
              key={i}
            >
              <Link to={`/${x.slug}`}>
                <div className={`tile ${darkMode ? "border-white" : "border-black"}`} style={{ backgroundImage: `url(${urlFor(x.mainImage).url()})` }} />
              </Link>
            </motion.span>
          )
        }
      </div>
    </section>
    <section>
      <div className="title">Maker</div>
      <div className="flex gap-5 flex-wrap justify-center max-w-100%">
        {
          projects.filter(x => x.category == "Maker").map((x, i) =>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.25,
                delay: i / 10,
              }}
              key={i}
            >
              <Link to={`/${x.slug}`}>
                <div className={`tile ${darkMode ? "border-white" : "border-black"}`} style={{ backgroundImage: `url(${urlFor(x.mainImage).url()})` }} />
              </Link>
            </motion.span>
          )
        }
      </div>
    </section>
    <section>
      <div className="title">Artist</div>
      <div className="flex gap-5 flex-wrap justify-center max-w-100%">
        {
          projects.filter(x => x.category == "Artist").map((x, i) =>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.25,
                delay: i / 10,
              }}
              key={i}
            >
              <Link to={`/${x.slug}`}>
                <div className={`tile ${darkMode ? "border-white" : "border-black"}`} style={{ backgroundImage: `url(${urlFor(x.mainImage).url()})` }} />
              </Link>
            </motion.span>
          )
        }
      </div>
    </section>
  </div >
};

export default Home;
