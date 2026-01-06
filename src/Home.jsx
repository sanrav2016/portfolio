import { useState, useEffect } from "react"
import { cdnClient, urlFor } from './SanityClient'
import { motion } from "framer-motion"
import './app.scss'
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { Link } from 'react-router-dom'
import Scene from './Scene.jsx'
import { Icons } from './Footer'
import LofiPlayer from "./LofiPlayer.jsx";

import headshot from '../assets/img/headshot.jpeg'

const useIsSmallScreen = (breakpoint = 768) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowSizeChange = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleWindowSizeChange);
    handleWindowSizeChange();

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return width <= breakpoint;
}

const Home = ({ darkMode, setDarkMode }) => {
  const [projects, setProjects] = useState([])
  const [age, setAge] = useState(0);
  const [scrollPos, setScrollPos] = useState(0);
  const [actualScrollPos, setActualScrollPos] = useState(0);
  const isSmallScreen = useIsSmallScreen()

  const handleScroll = () => {
    const projectContainer = document.querySelector("#project-container");
    const n = 5;
    const fraction = 1 - Math.max(0, Math.min(n * Math.abs(window.scrollY - projectContainer.offsetTop) / (window.innerHeight / 2), 1));
    setScrollPos(fraction);
    setActualScrollPos(window.scrollY);
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const birthDate = new Date("June 6, 2007");
    const now = new Date();
    const diffMs = now - birthDate;
    const years = diffMs / (1000 * 60 * 60 * 24 * 365.2425);
    setAge(years);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    cdnClient.fetch(`*[_type == 'post']{ _id, "slug": slug.current, mainImage, title, publishedAt } | order(dateTime(publishedAt) desc)`).then((data) => {
      setProjects(data)
    })
  }, [])

  return <div className={`w-full h-full relative transition-all ${darkMode ? "dark" : ""}`}>
    <div className="fixed top-4 right-4 w-8 h-8 flex justify-center items-center z-10">
      <span onClick={() => setDarkMode(!darkMode)} className={`${darkMode ? "icon-light bg-black" : "icon-dark bg-white"}`} style={{ "border": 0 }}>
        {darkMode ? <IoMoonOutline /> : <IoSunnyOutline />}
      </span>
    </div>
    <Scene darkMode={darkMode} />
    <section className="flex-row">
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
            <div className="items-center text-center flex flex-col p-12 gap-4 z-10">
              <div className="z-10 title-text">
                <span className="text-4xl tracking-tighter z-10">Hi, I'm</span>
                <br />
                <span className="text-5xl title-text tracking-tighter w-full z-10">Sanjay</span>
              </div>
              <div className="text-sm tracking-tighter font-light z-10">
                <div>{Math.floor(age)} years old @ <br />Carnegie Mellon University</div>
                <div>
                  <Icons darkMode={darkMode} />
                </div>
              </div>

            </div>
          </motion.div>
          <LofiPlayer />
        </div>
      </div>
    </section >
    <section className="flex-row">
      <div>
        <div className="flex flex-wrap justify-center items-center">
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
              <img src={headshot} />
            </div>
          </motion.div>
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
              <div className="text-5xl heading-text w-full z-10">About Me</div>
              <div className="text-sm max-w-sm z-10">
                <div>My name is Sanjay Ravishankar, and I'm a undergrad student in Pittsburgh majoring in Electrical and Computer Engineering. I love working on projects that help people, building and finding ways technology can make everyday life a little easier. In my free time, I enjoy drawing, singing, and LoFi music.</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section >
    <section id="project-container" className="relative h-auto p-0" style={{
      WebkitMaskImage: "url(#cutout)",
      WebkitMaskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      WebkitMaskSize: "contain",
      maskImage: "url(#cutout)",
      maskRepeat: "no-repeat",
      maskPosition: "center",
      maskSize: "contain",
    }}>
      <svg
        width="0"
        height="0"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <defs>
          <mask id="cutout" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <text
              x="50%"
              y="50vh"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="8vw"
              opacity={isSmallScreen ? 0 : 1}
              lengthAdjust="spacingAndGlyphs"
              fill={`rgba(0,0,0,${scrollPos})`}
              fontFamily="BBH Bartle"
            >
              PROJECTS
            </text>
          </mask>
        </defs>
      </svg>
      <div className="sticky md:absolute top-0 left-0 w-full h-screen  justify-center items-center pointer-events-none z-50">
        <svg
          className="w-full h-full absolute inset-0 pointer-events-none"
        >
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8vw"
            lengthAdjust="spacingAndGlyphs"
            opacity={`${isSmallScreen ? 0 : scrollPos}`}
            stroke={darkMode ? "white" : "black"}
            strokeWidth="2"
            fontFamily="BBH Bartle"
          >
            PROJECTS
          </text>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8vw"
            lengthAdjust="spacingAndGlyphs"
            opacity={`${isSmallScreen ? 1 : 0}`}
            stroke={darkMode ? "white" : "black"}
            fill={!darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"}
            strokeWidth="1"
            fontFamily="BBH Bartle"
          >
            PROJECTS
          </text>
        </svg>
      </div>
      <div className="flex justify-around flex-wrap w-full mt-[-100vh] md:mt-0">
        {
          projects.map((x, i) =>
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.25,
                delay: i / 20,
              }}
              key={i}
              style={{
                flex: `1 1 25%`,
                minWidth: "300px",
                minHeight: "300px",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            >
              <Link to={`/${x.slug}`}>
                <div className={`tile ${darkMode ? "border-white" : "border-black"}`} style={{ backgroundImage: `url(${urlFor(x.mainImage).url()})` }}>
                  <div className="tile-text">
                    <div className="tile-title">{x.title}</div>
                    <div className="tile-date">{new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(x.publishedAt))}</div>
                  </div>
                </div>
              </Link>
            </motion.span>
          )
        }
      </div>
    </section >
  </div >
};

export default Home;
