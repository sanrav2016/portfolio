import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const cdnClient = createClient({
    projectId: 'av4t4p3s',
    dataset: 'production',
    apiVersion: '2021-11-16',
    useCdn: true,
    token: "skh8vhLhqNnr06yhI4lsZOE96KuTSC2ivJ4aShQIGwAXa2cElnThDEBWQcPXjK8PQvrgIYvjzmIv9nRwVuAQPmz3Xcu0OKjSvpF6taE8GYIo56ZSDvOMER5jUj7IQzmc3VQjXEnDoYehvT9W5WErisrPj7zRo6X2nrT2gBLccb2ofDl7nIxO", // gee, i sure hope no one steals my api token from this public repo :)
    ignoreBrowserTokenWarning: true,
    perspective: 'published'
})

const builder = imageUrlBuilder(cdnClient)

export const urlFor = (source) => builder.image(source)