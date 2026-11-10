export type GalleryItem = {
  title: string
  category: string
  image: string
  alt: string
  description: string
}

export const artwork: GalleryItem[] = [
  {
    title: 'Studio work',
    category: 'Artwork',
    image: '/images/artwork/art-1.jpe',
    alt: 'Detailed photograph of artwork in the studio',
    description: 'A quiet moment of colour and texture.',
  },
  {
    title: 'Soft study',
    category: 'Artwork',
    image: '/images/artwork/art-2.jpe',
    alt: 'Photograph of a layered artistic piece with soft tones',
    description: 'A close look at the careful layering and softness in the work.',
  },
  {
    title: 'Colour and light',
    category: 'Artwork',
    image: '/images/artwork/art-3.jpe',
    alt: 'Photograph of an art piece lit softly in a warm room',
    description: 'A gentle study in light, tone, and feeling.',
  },
]

export const crochet: GalleryItem[] = [
  {
    title: 'Crochet detail',
    category: 'Crochet',
    image: '/images/crochet/crochet-1.jpe',
    alt: 'Close photograph of a crochet pattern in soft tones',
    description: 'The rhythm of the stitches and the texture of the piece.',
  },
  {
    title: 'Tiny texture',
    category: 'Crochet',
    image: '/images/crochet/crochet-2.jpe',
    alt: 'Photograph of crochet in close detail with soft yarn colours',
    description: 'A little reminder that patience makes beautiful things.',
  },
  {
    title: 'Finished work',
    category: 'Crochet',
    image: '/images/crochet/crochet-3.jpe',
    alt: 'Photograph of a completed crochet project',
    description: 'A piece that holds time, care, and softness.',
  },
  {
    title: 'Loop by loop',
    category: 'Crochet',
    image: '/images/crochet/crochet-4.jpe',
    alt: 'Photograph of crochet work with visible yarn texture',
    description: 'The beauty of turning simple loops into something handmade.',
  },
  {
    title: 'A quiet project',
    category: 'Crochet',
    image: '/images/crochet/crochet-5.jpe',
    alt: 'Photograph of crochet pieces laid together in a calm arrangement',
    description: 'A small collection of thoughtful, handmade texture.',
  },
]
