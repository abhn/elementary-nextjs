import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'
import Container from '../../../components/container'
import PostBody from '../../../components/post-body'
import Header from '../../../components/header'
import PostHeader from '../../../components/post-header'
import SectionSeparator from '../../../components/section-separator'
import Layout from '../../../components/layout'
import PostTitle from '../../../components/post-title'
import Tags from '../../../components/tags'
import { getAllPostsWithSlug, getPostAndMorePosts } from '../../../lib/api'
import { CMS_NAME } from '../../../lib/constants'

export default function Post({ post, posts, preview }) {
  const router = useRouter()
  const morePosts = posts?.edges

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>
                  {post.title} | Abhishek Nagekar's Blog
                </title>
                <meta
                  property="og:image"
                  content={post.featuredImage?.node.sourceUrl}
                />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.featuredImage}
                date={post.date}
                author={post.author}
              />
              <PostBody content={post.content} />
              <footer>
                {post.tags.edges.length > 0 && <Tags tags={post.tags} />}
              </footer>
            </article>

            <SectionSeparator />
          </>
        )}
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const data = await getPostAndMorePosts(params?.slug, preview, previewData)

  return {
    props: {
      preview,
      post: data.post,
      posts: data.posts,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = await getAllPostsWithSlug()

  return {
    paths: allPosts.edges.map(({ node }) => {
      const postDate = new Date(node.date);
      const month = (postDate.getMonth() + 1).toString().padStart(2, "0");
      const year = postDate.getFullYear().toString();
      return {
        params: {
          year: year,
          month: month,
          slug: node.slug
        }
      }
    }) || [],
    fallback: true,
  }
}
