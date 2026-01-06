import React, { createContext, useContext, useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlay, FaPause, FaTimes } from 'react-icons/fa'
import Marquee from "react-fast-marquee";

const LofiContext = createContext(null)

export const useLofi = () => useContext(LofiContext)

const STREAM_URL = "https://streams.ilovemusic.de/iloveradio17.mp3"

export default function LofiProvider({ children }) {
    const audioRef = useRef(null)
    const [playing, setPlaying] = useState(false)
    const [loading, setLoading] = useState(false)
    const [bannerVisible, setBannerVisible] = useState(false)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const onPlaying = () => {
            setPlaying(true)
            setLoading(false)
        }
        const onPause = () => setPlaying(false)
        const onWaiting = () => setLoading(true)
        const onEnded = () => setPlaying(false)
        const onError = () => {
            setLoading(false)
            setPlaying(false)
        }

        audio.addEventListener('playing', onPlaying)
        audio.addEventListener('pause', onPause)
        audio.addEventListener('waiting', onWaiting)
        audio.addEventListener('ended', onEnded)
        audio.addEventListener('error', onError)

        return () => {
            audio.removeEventListener('playing', onPlaying)
            audio.removeEventListener('pause', onPause)
            audio.removeEventListener('waiting', onWaiting)
            audio.removeEventListener('ended', onEnded)
            audio.removeEventListener('error', onError)
        }
    }, [])

    useEffect(() => {
        if (!bannerVisible && playing) {
            pause();
        }
    }, [bannerVisible])

    const play = async () => {
        if (!audioRef.current) return
        try {
            setLoading(true)
            await audioRef.current.play()
            setBannerVisible(true)
        } catch (e) {
            console.error('Playback failed', e)
            setLoading(false)
        }
    }

    const pause = () => {
        if (!audioRef.current) return
        audioRef.current.pause()
    }

    const toggle = async () => {
        if (playing) pause()
        else await play()
    }

    const value = {
        audioRef,
        playing,
        loading,
        bannerVisible,
        setBannerVisible,
        play,
        pause,
        toggle,
    }

    return (
        <LofiContext.Provider value={value}>
            {children}

            <audio ref={audioRef} src={STREAM_URL} preload="none" />

            <AnimatePresence>
                {bannerVisible && (
                    <div className="fixed flex justify-center w-full bottom-0 right-0 z-50 p-4">
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="lofi-banner z-50"
                            style={{
                                background: 'rgba(0,0,0,0.9)',
                                color: 'white',
                                padding: '8px 12px',
                                borderRadius: 12,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                boxShadow: '0 6px 24px rgba(0,0,0,0.4)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                <div style={{ cursor: 'pointer' }} onClick={toggle}>
                                    {loading ? (
                                        <svg width={28} height={28} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 62.8"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" /></circle></svg>
                                    ) : playing ? <FaPause /> : <FaPlay />}
                                </div>
                                <div style={{
                                    fontSize: 14, opacity: 0.9, position: 'relative',
                                    maskImage: 'linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0) 100%)'
                                }}>
                                    <Marquee speed={30} gradient={false}>
                                        <span className="mr-12">🎵 ILOVEMUSIC 24/7 Lofi Hip Hop Radio - Beats to Relax/Study to 🎵</span>
                                    </Marquee>
                                </div>
                            </div>

                            <div style={{ cursor: 'pointer' }} onClick={() => setBannerVisible(false)} title="Close">
                                <FaTimes />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </LofiContext.Provider>
    )
}
