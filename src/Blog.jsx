import { useState, useEffect } from "react"
import { cdnClient, urlFor } from './SanityClient'
import { motion } from "framer-motion"
import './app.scss'
import { IoSunnyOutline, IoMoonOutline, IoArrowBack } from "react-icons/io5";
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
    image: ({ value }) => html`<img src="${urlFor(value).url()}" />`,
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

  const [title, setTitle] = useState("")
  const [publishedAt, setPublishedAt] = useState("")
  const [author, setAuthor] = useState("")
  const [mainImage, setMainImage] = useState()
  const [body, setBody] = useState("")

  useEffect(() => {
    cdnClient.fetch(`*[_type == 'post' && slug.current == '${slug}']{ _id, title, publishedAt, author->, mainImage, body }[0]`).then((data) => {
      window.scrollTo(0, 0);
      setTitle(data.title)
      setPublishedAt(new Date(data.publishedAt).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
      setAuthor(data.author.name)
      setMainImage(data.mainImage)
      setBody(data.body)
    })
  }, [])

  return <div className={`w-full h-full relative transition-all ${darkMode ? "dark" : ""}`}>
    <Link to="/">
      <div className="fixed top-4 left-4 w-8 h-8 flex justify-center items-center">
        <span onClick={() => setDarkMode(!darkMode)} className={`${darkMode ? "icon-light bg-black" : "icon-dark bg-white"}`} style={{ "border": 0 }}>
          <IoArrowBack />
        </span>
      </div>
    </Link>
    <div className="fixed top-4 right-4 w-8 h-8 flex justify-center items-center">
      <span onClick={() => setDarkMode(!darkMode)} className={`${darkMode ? "icon-light bg-black" : "icon-dark bg-white"}`} style={{ "border": 0 }}>
        {darkMode ? <IoMoonOutline /> : <IoSunnyOutline />}
      </span>
    </div>

    <section className="hero-blog-wrapper" style={{ backgroundImage: `url(${mainImage ? urlFor(mainImage).url() : mainImage})` }}>
      <div className="flex justify-start items-end h-full w-full bg-gradient-to-t from-black to-transparent p-8">
        {
          title != "" &&
          <motion.div
            initial={{ opacity: 0, marginBottom: "-200px" }}
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
            <div className="text-5xl title-text hyphenate">{title}</div>
            <div className="text-sm">
              <div>{publishedAt}</div>
            </div>
          </motion.div>
        }
      </div>
    </section>
    <section className={`w-full h-full ${darkMode ? "bg-black" : "bg-white"}`}>
      <div className="body-content bg-transparent">
        <PhotoProvider>
          {
            parse(toHTML(body, {
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

export default Blog;
