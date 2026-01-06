import { useState, useEffect } from "react"
import { cdnClient, urlFor } from './SanityClient'
import { motion } from "framer-motion"
import './app.scss'
import { FaExternalLinkAlt } from "react-icons/fa";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { Link, useParams } from 'react-router-dom';
import { toHTML } from '@portabletext/to-html'
import htm from 'htm'
import vhtml from 'vhtml'
import parse from 'html-react-parser';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

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

const Blog = ({ darkMode, setDarkMode }) => {
  let { slug } = useParams();

  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    cdnClient.fetch(`*[_type == 'post' && slug.current == '${slug}']{ _id, title, publishedAt, _updatedAt, mainImage, body, tags, link }[0]`)
      .then((data) => {
        setData(data)
        setLoading(false)
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      })
      .catch((e) => {
        console.error('Failed to fetch post', e)
        setLoading(false)
      })
  }, [slug])

  return loading ? <PageSpinner dark={darkMode} /> : <div className={`w-full h-full relative transition-all ${darkMode ? "dark" : ""}`}>
    <div className="fixed top-4 right-4 w-8 h-8 flex justify-center items-center">
      <span onClick={() => setDarkMode(!darkMode)} className={`${darkMode ? "icon-light bg-black" : "icon-dark bg-white"}`} style={{ "border": 0 }}>
        {darkMode ? <IoMoonOutline /> : <IoSunnyOutline />}
      </span>
    </div>

    <section className="hero-blog-wrapper" style={{ backgroundImage: `url(${data.mainImage ? urlFor(data.mainImage).url() : data.mainImage})` }}>
      <div className="flex justify-start items-end h-full w-full bg-gradient-to-t from-black to-transparent p-8">
        {
          data != "" &&
          <motion.div
            initial={{ opacity: 0, marginBottom: "-100px" }}
            whileInView={{ opacity: 1, marginBottom: 0 }}
            viewport={{ once: true, amount: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            className="h-full title-content"
            lang="en"
          >
            <div className="text-6xl heading-text hyphenate">{data.title}</div>
            <div className="text-sm opacity-75">
              <div>Created: {new Date(data.publishedAt).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div>Last edited: {new Date(data._updatedAt).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div className="flex flex-wrap gap-3">{
              data.tags && data.tags.map((tag) => (
                <span className="tag-badge">{tag}</span>
              ))
            }</div>
            {data.link && <div className="items-center hover:text-red-300 transition-all truncate max-w-[80vh] text-sm">
              <span className="inline-block mr-2"><FaExternalLinkAlt /></span>
              <Link to={data.link} target="_blank" rel="noopener noreferrer">{data.link}</Link>
            </div>}
          </motion.div>
        }
      </div>
    </section >
    <section className={`w-full h-full ${darkMode ? "bg-black" : "bg-white"}`}>
      <div className="body-content bg-transparent">
        <PhotoProvider>
          {
            parse(toHTML(data.body, {
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
    </section>
  </div >
};

function PageSpinner({ dark }) {
  return (
    <div className={`page-spinner ${dark ? 'dark' : ''}`}>
      <svg width={64} height={64} viewBox="0 0 24 24" fill="none" style={{ color: dark ? 'white' : 'black' }}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.4 62.8">
          <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
}

export default Blog;
