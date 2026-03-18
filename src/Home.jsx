import { useState, useEffect } from "react"
import { cdnClient, urlFor } from './SanityClient'
import { motion } from "framer-motion"
import './app.scss'
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { Link } from 'react-router-dom'
import Scene from './Scene.jsx'
import { Icons } from './Footer'
import LofiPlayer from "./LofiPlayer.jsx";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { toHTML } from '@portabletext/to-html'
import htm from 'htm'
import vhtml from 'vhtml'
import parse from 'html-react-parser';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

import headshot from '../assets/img/headshot.jpeg'

const html = htm.bind(vhtml)

const components = {
  types: {
    image: ({ value }) => html`<div className="w-full h-auto flex justify-center"><img src="${urlFor(value).url()}" /></div>`,
    callToAction: ({ value, isInline }) =>
      isInline
        ? html`<a href="${value.url}" target="_blank">${value.text}</a>`
        : html`<div class="callToAction">${value.text}</div>`,
  },

  marks: {
    link: ({ children, value }) => {
      const href = value.href || ''

      const rel = href.startsWith('/') ? undefined : 'noreferrer noopener'
      return html`<a href="${href}" rel="${rel}" target="_blank">${children}</a>`
    },
  },
}

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
  const [currentSlide, setCurrentSlide] = useState(0)
  const [age, setAge] = useState(0);
  const isSmallScreen = useIsSmallScreen()

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % projects.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length)
  }

  useEffect(() => {
    const birthDate = new Date("June 6, 2007");
    const now = new Date();
    const diffMs = now - birthDate;
    const years = diffMs / (1000 * 60 * 60 * 24 * 365.2425);
    setAge(years);
  }, []);

  useEffect(() => {
    cdnClient.fetch(`*[_type == 'post']{ _id, "slug": slug.current, mainImage, title, publishedAt, _updatedAt, tags, link, body } | order(dateTime(publishedAt) desc)`).then((data) => {
      setProjects(data)
    })
  }, [])

  const currentProject = projects[currentSlide]

  return <div className={`w-full h-full relative transition-all ${darkMode ? "dark" : ""}`}>
    <div className="fixed top-4 left-4 w-8 h-8 flex justify-center items-center z-10">
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
              <div className="z-10">
                <span className="text-4xl tracking-tighter z-10">Hi, I'm</span>
                <br />
                <span className="text-5xl tracking-tighter w-full z-10 font-bold">Sanjay!</span>
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
              <div className="text-5xl w-full z-10">About Me</div>
              <div className="text-sm max-w-sm z-10">
                <div>My name is Sanjay Ravishankar, and I'm a undergrad student in Pittsburgh majoring in Electrical and Computer Engineering. I love working on projects that help people, building and finding ways technology can make everyday life a little easier. In my free time, I enjoy drawing, singing, and LoFi music.</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section >
    <section id="project-container" className="relative w-full min-h-[600px] max-h-full flex items-center justify-center overflow-visible py-12 px-8">
      {projects.length > 0 && currentProject && (
        <div className="mx-auto px-8 md:mx-32 py-8 relative w-full h-full rounded-xl overflow-hidden">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 0.8, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-lg bg-cover bg-center w-full h-full carousel-bg-image"
            style={{
              backgroundImage: `url(${urlFor(currentProject.mainImage).url()})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 0,
              opacity: 0.6,
              filter: 'blur(2px)'
            }}
          >
          </motion.div>

          <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-stretch justify-stretch gap-4 p-8">
            {/* Left side - Info */}
            <motion.div
              key={`info-${currentSlide}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full md:w-1/3 flex flex-col gap-4 justify-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold">{currentProject.title}</h2>

              <div className="text-xs md:text-sm opacity-75">
                <div>Created: {new Date(currentProject.publishedAt).toLocaleDateString("en-US", { month: 'long', year: 'numeric' })}</div>
                <div>Last edited: {new Date(currentProject._updatedAt).toLocaleDateString("en-US", { month: 'long', year: 'numeric' })}</div>
              </div>

              {currentProject.tags && currentProject.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentProject.tags.map((tag, idx) => (
                    <span key={idx} className="tag-badge text-xs py-1 px-2">{tag}</span>
                  ))}
                </div>
              )}

              {currentProject.link && (
                <div className="items-center hover:text-red-300 transition-all text-xs md:text-sm underline">
                  <span className="inline-block mr-2"><FaExternalLinkAlt /></span>
                  <a href={currentProject.link} target="_blank" rel="noopener noreferrer">View project</a>
                </div>
              )}
            </motion.div>

            {/* Right side - Scrollable body */}
            {currentProject.body && (
              <motion.div
                key={`body-${currentSlide}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="w-full md:w-2/3 overflow-y-auto max-h-full rounded-lg bg-black/60 p-4 md:p-6 pb-8 md:pb-12"
              >
                <div className="body-content-carousel text-xs md:text-sm">
                  <PhotoProvider>
                    {
                      parse(toHTML(currentProject.body, {
                        components: components
                      }), {
                        replace(domNode) {
                          if (domNode.attribs && domNode.name === "img") {
                            return <PhotoView src={domNode.attribs.src}><img src={domNode.attribs.src} /></PhotoView>
                          }
                        }
                      })
                    }
                  </PhotoProvider>
                </div>
              </motion.div>
            )}
          </div>


        </div>
      )}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
        <button
          onClick={prevSlide}
          className={`p-3 rounded-full border-2 transition-all hover:scale-110 ${darkMode ? "border-white hover:bg-white hover:text-black" : "border-black hover:bg-black hover:text-white"}`}
          aria-label="Previous project"
        >
          <MdArrowBack size={24} />
        </button>
      </div>

      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
        <button
          onClick={nextSlide}
          className={`p-3 rounded-full border-2 transition-all hover:scale-110 ${darkMode ? "border-white hover:bg-white hover:text-black" : "border-black hover:bg-black hover:text-white"}`}
          aria-label="Next project"
        >
          <MdArrowForward size={24} />
        </button>
      </div>

      <div className="absolute top-16 right-4 transform -translate-x-1/2 text-sm z-20 rounded-xl px-3 py-1 bg-black/50 text-center">
        {currentSlide + 1} / {projects.length}
      </div>
    </section >
  </div >
};

export default Home;
