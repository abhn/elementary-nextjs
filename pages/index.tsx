import Head from 'next/head'
import { GetStaticProps } from 'next'
import Container from '../components/container'
import Essays from '../components/essays'
import Layout from '../components/layout'
import { getAllPostsForHome } from '../lib/api'
import { CMS_NAME } from '../lib/constants'

export default function Index({ allPosts: { edges }, preview }) {
  const essays = edges

  return (
    <Layout preview={preview}>
      <Head>
        <title>Abhishek Nagekar's Blog</title>
      </Head>
      <Container>
        <Essays posts={essays} />
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const allPosts = await getAllPostsForHome(preview)

  return {
    props: { allPosts, preview },
    revalidate: 10,
  }
}
